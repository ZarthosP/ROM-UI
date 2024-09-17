import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  FlatList,
  Platform,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import BasketItem from "./Components/BasketItem";
import QuantitySelector from "./Components/QuantitySelector";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "text-encoding-polyfill";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

function Menu({ route }) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tableId, setTableId] = useState(route.params.tableId);
  const { t } = useTranslation();

  const [cart, setCart] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [numberTest, setNumberTest] = useState(0);

  useEffect(() => {
    // Initialize the STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Handle successful connection
    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);

      // Subscribe to the topic to receive messages
      stompClient.subscribe("/topic/cart", (response) => {
        const parsedResponse = JSON.parse(response.body);
        setCart(parsedResponse);
        initalizeLocalCart(parsedResponse);
        console.log(parsedResponse);
        setIsLoading(false);
        setError("");
      });

      // Send an initial message to request data as soon as the connection is established
      stompClient.publish({
        destination: "/app/cartWS/completeCart",
        body: JSON.stringify({ id: tableId, completeCartDto: null }),
      });
    };

    // Handle errors during connection or session
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: ", frame.headers["message"]);
      console.error("Additional details: ", frame.body);
      Alert.alert(
        "WebSocket Error",
        "Failed to connect or maintain the WebSocket connection."
      );
    };

    // Activate the client to start the connection process
    stompClient.activate();
    setClient(stompClient);

    // Clean up the client when the component is unmounted
    return () => {
      stompClient.deactivate();
    };
  }, []);

  const changeItemQuantity = (id, newPreSelectedValue) => {
    if (client && isConnected) {
      client.publish({
        destination: "/app/cartWS/completeCart",
        body: JSON.stringify({
          id: cart.id,
          completeCartDto: updatePreSelected(id, newPreSelectedValue),
        }),
      });
    } else {
      Alert.alert(
        "Connection Error",
        "WebSocket is not connected. Please wait and try again."
      );
    }
  };

  const validateCart = () => {
    if (client && isConnected) {
      client.publish({
        destination: "/app/cartWS/completeCart",
        body: JSON.stringify({
          id: cart.id,
          completeCartDto: finalCart(),
        }),
      });
    } else {
      Alert.alert(
        "Connection Error",
        "WebSocket is not connected. Please wait and try again."
      );
    }
  };

  const finalCart = () => {
    const updatedCartItems = cart.cartItems.map((item) => {
      const matchingLocalItem = localCart.cartItems.find(
        (localItem) => localItem.id === item.id
      );

      if (matchingLocalItem) {
        return {
          ...item,
          payed: item.payed + matchingLocalItem.payed,
          ready: matchingLocalItem.ready,
        };
      }

      return item;
    });

    return { ...cart, cartItems: updatedCartItems };
  };

  const initalizeLocalCart = (cart) => {
    const initLocalCart = cart.cartItems.map((item) => {
      return {
        ...item,
        payed: 0,
      };
    });
    setLocalCart({ ...localCart, cartItems: initLocalCart });
    return { ...localCart, cartItems: initLocalCart };
  };

  const updatePayed = (itemId, qtyPayed) => {
    const updatedCart = localCart.cartItems.map((item) => {
      const matchingCartItem = cart.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (item.id === itemId) {
        return {
          ...item,
          payed: qtyPayed,
          ready: matchingCartItem.ready - qtyPayed,
        };
      }
      return item;
    });
    setLocalCart({ ...localCart, cartItems: updatedCart });
    return { ...localCart, cartItems: updatedCart };
  };

  const handleNumberSelectedChange = (id, newNumber) => {
    updatePayed(id, newNumber);
  };

  const getReadyItemsFromCart = (id) => {
    const matchingCartItem = cart.cartItems.find(
      (cartItem) => cartItem.id === id
    );

    if (matchingCartItem) {
      return matchingCartItem.ready;
    }
    return 77;
  };

  const getTotalToPay = () => {
    let totalToPay = 0;

    // Check if localCart has cartItems array
    if (localCart.cartItems && localCart.cartItems.length > 0) {
      localCart.cartItems.forEach((item) => {
        totalToPay += item.payed * item.menuItem.price;
      });
    }

    return totalToPay.toFixed(2); // Return total with two decimal places
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff"></ActivityIndicator>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("logged-user");
      console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button title="Log cart" onPress={() => console.log(cart)}></Button>
      <Button title="Log user" onPress={() => getData()}></Button>
      <Button
        title="Log localCart"
        onPress={() => console.log(localCart)}
      ></Button>
      <Button
        title="Log quantity"
        onPress={() => console.log(numberTest)}
      ></Button> */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.titleText}>To pay</Text>
          <FlatList
            data={localCart.cartItems.filter((i) => i.ready > 0 || i.payed > 0)}
            renderItem={({ item }) => {
              return (
                <View style={styles.itemContainer}>
                  <View style={styles.basketItemContainer}>
                    <BasketItem
                      title={item.menuItem.title}
                      price={item.menuItem.price}
                      quantity={item.quantity}
                      confirmed={item.confirmed}
                      preSelected={item.preSelected}
                      ready={getReadyItemsFromCart(item.id)}
                      payed={item.payed}
                    />
                  </View>
                  <View style={styles.quantitySelectorContainer}>
                    <QuantitySelector
                      ready={item.ready}
                      payed={item.payed}
                      change={handleNumberSelectedChange}
                      id={item.id}
                      price={item.menuItem.price}
                    />
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<Text>No items found</Text>}
            refreshing={refreshing}
          />

          <Button
            title="Validate changes"
            onPress={() => setIsModalVisible(true)}
          />
          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Items Selected</Text>
                <FlatList
                  data={localCart.cartItems.filter((i) => i.payed > 0)}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>
                          <Text style={styles.itemPayedText}>
                            {" "}
                            - {item.payed}{" "}
                          </Text>
                          <Text style={styles.itemMultiplicationSign}> x </Text>
                          <Text style={styles.itemTitleText}>
                            {t(item.menuItem.title)}
                          </Text>
                        </Text>
                      </View>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No items selected</Text>
                  }
                  refreshing={refreshing}
                />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabelText}>
                    Total to Pay:{" "}
                    <Text style={styles.totalAmountText}>
                      {getTotalToPay()} €
                    </Text>
                  </Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.validateButton]}
                    onPress={() => {
                      validateCart();
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Validate Payment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 5,
  },
  basketItemContainer: {
    flex: 2,
    marginRight: 10,
  },
  quantitySelectorContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  itemTitleText: {
    fontWeight: "bold",
    color: "#000",
  },
  itemMultiplicationSign: {
    color: "#666",
    fontWeight: "normal",
    marginHorizontal: 5,
  },
  itemPayedText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#FFC0CB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#D8000C",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    textAlign: "left",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  validateButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  totalLabelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmountText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default Menu;

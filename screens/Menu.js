import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  Button,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MenuItem from "./Components/MenuItem";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Menu({ route }) {
  const WEBSOCKET_URL = "http://10.50.104.71:8080/ws";
  const [loggedUser, setLoggedUser] = useState({});
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tableId, setTableId] = useState(route.params.tableId);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAlreadyPayedListVisible, setiIsAlreadyPayedListVisible] =
    useState(false);

  const { t } = useTranslation();
  
  const getLoggedUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("logged-user");
      setLoggedUser(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.error("Error reading user data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize the STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setIsConnected(true);
      stompClient.subscribe("/topic/cart", (response) => {
        const parsedResponse = JSON.parse(response.body);
        setCart(parsedResponse);
        setIsLoading(false);
        setError("");
      });
      stompClient.publish({
        destination: "/app/cartWS/completeCart",
        body: JSON.stringify({ id: tableId, completeCartDto: null }),
      });
    };

    stompClient.onStompError = (frame) => {
      Alert.alert(
        "WebSocket Error",
        "Failed to connect or maintain the WebSocket connection."
      );
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
    getLoggedUserData();
  }, []);

  const changeItemQuantity = (id, newPreSelectedValue) => {
    if (newPreSelectedValue >= 0) {
      if (client && isConnected) {
        client.publish({
          destination: "/app/cartWS/completeCart",
          body: JSON.stringify({
            id: cart.id,
            completeCartDto: updatePreSelected(id, newPreSelectedValue),
          }),
        });
      } else {
        Alert.alert("Connection Error", "WebSocket is not connected.");
      }
    }
  };

  const validateCart = () => {
    if (client && isConnected) {
      const newCompleteCartDto = validatePreSelectedCartItems();
      client.publish({
        destination: "/app/cartWS/completeCart",
        body: JSON.stringify({
          id: cart.id,
          completeCartDto: newCompleteCartDto,
        }),
      });
    } else {
      Alert.alert("Connection Error", "WebSocket is not connected.");
    }
  };

  const updatePreSelected = (itemId, newPreSelectedValue) => {
    const updatedCart = cart.cartItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity =
          item.quantity + newPreSelectedValue - item.preSelected;
        return {
          ...item,
          preSelected: newPreSelectedValue,
          quantity: newQuantity,
        };
      }
      return item;
    });
    setCart({ ...cart, cartItems: updatedCart });
    return { ...cart, cartItems: updatedCart };
  };

  const validatePreSelectedCartItems = () => {
    const updatedCart = cart.cartItems.map((item) => {
      const newConfirmed = item.confirmed + item.preSelected;
      return { ...item, confirmed: newConfirmed, preSelected: 0 };
    });
    setCart({ ...cart, cartItems: updatedCart });
    return { ...cart, cartItems: updatedCart };
  };

  const addWaiterNotification = async () => {
    try {
      const response = await fetch(
        "http://10.50.104.71:8080/table/callWaiter/" + tableId
      );
      const data = await response.json();
      setIsWaiterCalled(true);
      setIsLoading(false);

      setTimeout(() => {
        setIsWaiterCalled(false);
      }, 3000);
    } catch (error) {
      setError("Failed to load tables");
      setIsLoading(false);
    }
  };

  const getTotalOrdered = () => {
    let totalToPay = 0;

    // Check if localCart has cartItems array
    if (cart.cartItems && cart.cartItems.length > 0) {
      cart.cartItems.forEach((item) => {
        totalToPay += (item.payed + item.ready + item.confirmed) * item.menuItem.price;
      });
    }

    return totalToPay.toFixed(2); // Return total with two decimal places
  };

  // Group items by their menuItemType into sections
  const sections = [
    {
      title: t("meals"),
      data: cart.cartItems
        ? cart.cartItems.filter((item) => item.menuItem.menuItemType === "MEAL")
        : [],
    },
    {
      title: t("drinks"),
      data: cart.cartItems
        ? cart.cartItems.filter(
            (item) => item.menuItem.menuItemType === "DRINK"
          )
        : [],
    },
    {
      title: t("desserts"),
      data: cart.cartItems
        ? cart.cartItems.filter(
            (item) => item.menuItem.menuItemType === "DESSERT"
          )
        : [],
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <Button
        title={isWaiterCalled ? t("waiterOnHisWay") : t("callWaiter")}
        onPress={addWaiterNotification}
        color="#f57c00"
      />
      {/* <Button
        title="log cart"
        onPress={() => console.log(cart)}
        color="#f57c00"
      /> */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          {/* SectionList rendering sections */}
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    changeItemQuantity(item.id, item.preSelected - 1)
                  }
                >
                  <Text style={styles.buttonText}>-</Text>
                </Pressable>
                <MenuItem
                  title={item.menuItem.title}
                  price={item.menuItem.price}
                  quantity={item.quantity}
                  confirmed={item.confirmed}
                  preSelected={item.preSelected}
                  ready={item.ready}
                />
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    changeItemQuantity(item.id, item.preSelected + 1)
                  }
                >
                  <Text style={styles.buttonText}>+</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={<Text>No items found</Text>}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title={t("alreadyOrdered")}
                onPress={() => setiIsAlreadyPayedListVisible(true)}
                color="#388e3c"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title={t("validateMenu")}
                onPress={() => setIsModalVisible(true)}
                color="#388e3c"
              />
            </View>
          </View>

          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{t("itemsSelected")}</Text>
                <FlatList
                  data={cart.cartItems.filter((i) => i.preSelected > 0)}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>
                          <Text style={styles.itemPayedText}>
                            {" "}
                            - {item.preSelected}{" "}
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
                    <Text style={styles.emptyText}>{t("noItemsSelected")}</Text>
                  }
                  refreshing={refreshing}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.validateButton]}
                    onPress={() => {
                      validateCart();
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      {t("validateItems")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>{t("cancel")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={isAlreadyPayedListVisible}
            onRequestClose={() => setiIsAlreadyPayedListVisible(false)}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Items Ordered</Text>
                <FlatList
                  data={cart.cartItems.filter((i) => i.payed > 0 || i.confirmed > 0 || i.ready > 0 )}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>
                          <Text style={styles.itemPayedText}>
                            {" "}
                            - {item.payed + item.confirmed + item.ready}{" "}
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
                    Total Payed:{" "}
                    <Text style={styles.totalAmountText}>
                      {getTotalOrdered()} €
                    </Text>
                  </Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.validateButton]}
                    onPress={() => {
                      setiIsAlreadyPayedListVisible(false);
                    }}
                  >
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      {t("close")}
                    </Text>
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
    padding: 16,
    backgroundColor: "#f4f4f9",
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#555",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#fce4e4",
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    backgroundColor: "#f0f0f5",
    padding: 8,
    borderRadius: 5,
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
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  itemText: {
    fontSize: 18,
    color: "#333",
    textAlign: "left",
  },
  itemPayedText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  itemMultiplicationSign: {
    color: "#666",
    fontWeight: "normal",
    marginHorizontal: 5,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Menu;

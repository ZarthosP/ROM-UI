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
} from "react-native";
import MenuItem from "./Components/MenuItem";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useTranslation } from "react-i18next";

function Menu({ route }) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tableId, setTableId] = useState(route.params.tableId);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);

  const { t } = useTranslation();

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
      Alert.alert("Connection Error", "WebSocket is not connected.");
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
        "http://192.168.1.43:8080/table/callWaiter/" + tableId
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

          <Button
            title={t("validateChanges")}
            onPress={validateCart}
            color="#388e3c"
          />
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
});

export default Menu;

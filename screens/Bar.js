import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import OrderItem from "./Components/OrderItem";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "text-encoding-polyfill";

function Kitchen(props) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

      // Subscribe to the topic to receive messages
      stompClient.subscribe("/topic/kitchen", (response) => {
        const parsedResponse = JSON.parse(response.body);
        setCartList(parsedResponse);
        setIsLoading(false);
        setError("");
      });

      // Send an initial message to request data as soon as the connection is established
      stompClient.publish({
        destination: "/app/cartWS/kitchenOrders",
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
      <FlatList
        data={cartList}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => {
          const drinkItems = item.cart.cartItems.filter(
            (i) => i.menuItem.menuItemType === "DRINK" && i.confirmed != 0
          );

          if (drinkItems.length !== 0) {
            return (
              <View style={styles.tableListContainer}>
                <Text style={styles.tableTitle}>Table {item.number}</Text>
                <View style={styles.itemListContainer}>
                  <FlatList
                    horizontal={true}
                    data={drinkItems}
                    keyExtractor={(cartItem) => cartItem.id.toString()}
                    renderItem={({ item: cartItem }) => (
                      <OrderItem
                        itemName={cartItem.menuItem.title}
                        quantity={cartItem.confirmed}
                        table={item.number}
                        id={cartItem.id}
                      />
                    )}
                  />
                </View>
              </View>
            );
          }
        }}
        ListEmptyComponent={<Text>No orders found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f9",
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
  tableListContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemListContainer: {
    flexDirection: "row",
    gap: 30,
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
});

export default Kitchen;

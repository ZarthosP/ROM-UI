import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  FlatList,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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
      stompClient.subscribe("/topic/kitchen", (response) => {
        const parsedResponse = JSON.parse(response.body);
        console.log(parsedResponse);
        setCartList(parsedResponse);
        setIsLoading(false);
        setError("");
      });

      // Send an initial message to request data as soon as the connection is established
      stompClient.publish({
        destination: "/app/cartWS/kitchenOrders",
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

  return (
    <View style={styles.container}>
      <FlatList
        data={cartList}
        renderItem={({ item }) => {
          if (
            item.cart.cartItems.filter(
              (i) => i.menuItem.menuItemType === "DRINK" && i.confirmed != 0
            ).length != 0
          ) {
            return (
              <View style={styles.tableListContainer}>
                <Text style={styles.tableTitle}>Table {item.number}</Text>
                <View style={styles.itemListContainer}>
                  <FlatList
                    horizontal={true}
                    data={item.cart.cartItems}
                    renderItem={({ item: cartItem }) => {
                      if (
                        cartItem.confirmed != 0 &&
                        cartItem.menuItem.menuItemType === "DRINK"
                      ) {
                        return (
                          <OrderItem
                            itemName={cartItem.menuItem.title}
                            quantity={cartItem.confirmed}
                            table={item.number}
                            id={cartItem.id}
                          />
                        );
                      }
                    }}
                  />
                </View>
              </View>
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    backgroundColor: "white",
  },
  tableListContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    margin: 16,
  },
  itemListContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 30,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 7,
  },
  tableTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default Kitchen;

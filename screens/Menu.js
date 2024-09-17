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
} from "react-native";
import MenuItem from "./Components/MenuItem";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client"; // Import SockJS client
import "text-encoding-polyfill"; // Polyfill for TextEncoder and TextDecoder

function Menu({ route }) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tableId, setTableId] = useState(route.params.tableId);

  const [cart, setCart] = useState([]);
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
      // console.log("Connected to WebSocket");
      setIsConnected(true);

      // Subscribe to the topic to receive messages
      stompClient.subscribe("/topic/cart", (response) => {
        const parsedResponse = JSON.parse(response.body);
        setCart(parsedResponse);
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
    console.log("cart validation");
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
      Alert.alert(
        "Connection Error",
        "WebSocket is not connected. Please wait and try again."
      );
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
    console.log("validatePreSelectedCartItems");
    const updatedCart = cart.cartItems.map((item) => {
      const newConfirmed = item.confirmed + item.preSelected;
      if (item.id === 952) {
        console.log("newConfirmed :" + newConfirmed);
      }
      return { ...item, confirmed: newConfirmed, preSelected: 0 };
    });
    setCart({ ...cart, cartItems: updatedCart });
    return { ...cart, cartItems: updatedCart };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff"></ActivityIndicator>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Button title="Log cart" onPress={() => console.log(cart)}></Button> */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.cartItems}
            renderItem={({ item }) => {
              return (
                <View style={styles.box}>
                  <Pressable
                    style={styles.removeOrAdd}
                    onPress={() =>
                      changeItemQuantity(item.id, item.preSelected - 1)
                    }
                  >
                    <Text style={styles.textRemoveOrAdd}>-</Text>
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
                    style={styles.removeOrAdd}
                    onPress={() =>
                      changeItemQuantity(item.id, item.preSelected + 1)
                    }
                  >
                    <Text style={styles.textRemoveOrAdd}>+</Text>
                  </Pressable>
                </View>
              );
            }}
            ListEmptyComponent={<Text>No items found</Text>}
            refreshing={refreshing}
            // onRefresh={handleRefresh}
          />
          <Button title="Validate changes" onPress={() => validateCart()} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    backgroundColor: "white",
  },
  box: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    margin: 16,
    borderColor: "rgba(39, 19, 10, 1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
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
  removeOrAdd: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "white",
    fontSize: 24,
    fontWeight: "bold",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textRemoveOrAdd: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default Menu;

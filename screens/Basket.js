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
import BasketItem from "./Components/BasketItem";
import QuantitySelector from "./Components/QuantitySelector";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client"; // Import SockJS client
import "text-encoding-polyfill"; // Polyfill for TextEncoder and TextDecoder

function Menu(props) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [cart, setCart] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ id: 1, completeCartDto: null }),
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
      <Button title="Log cart" onPress={() => console.log(cart)}></Button>
      <Button
        title="Log localCart"
        onPress={() => console.log(localCart)}
      ></Button>
      <Button
        title="Log quantity"
        onPress={() => console.log(numberTest)}
      ></Button>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <Text>To pay</Text>
          <FlatList
            data={localCart.cartItems.filter((i) => i.ready > 0 || i.payed > 0)}
            renderItem={({ item }) => {
              return (
                <View style={styles.itemContainer}>
                  <BasketItem
                    title={item.menuItem.title}
                    price={item.menuItem.price}
                    quantity={item.quantity}
                    confirmed={item.confirmed}
                    preSelected={item.preSelected}
                    ready={getReadyItemsFromCart(item.id)}
                    payed={item.payed}
                  />
                  <QuantitySelector
                    ready={item.ready}
                    payed={item.payed}
                    change={handleNumberSelectedChange}
                    id={item.id}
                    price={item.menuItem.price}
                  />
                </View>
              );
            }}
            ListEmptyComponent={<Text>No items found</Text>}
            refreshing={refreshing}
            // onRefresh={handleRefresh}
          />
          <Text>Items selected</Text>
          <FlatList
            data={localCart.cartItems.filter((i) => i.payed > 0)}
            renderItem={({ item }) => {
              return (
                <View style={styles.itemContainer}>
                  <Text>
                    - {item.payed} x {item.menuItem.title}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={<Text>No items selected</Text>}
            refreshing={refreshing}
            // onRefresh={handleRefresh}
          />
          {/* Add a button under the FlatList */}
          <Button title="Validate changes" onPress={() => validateCart()} />
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
    backgroundColor: "white",
    padding: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderColor: "black",
    borderWidth: 1,
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
});

export default Menu;

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
} from "react-native";
import MenuItem from "./Components/MenuItem";

function MenuNoWebSocket(props) {
  const [menuList, setMenuList] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // const fetchMenuList = async () => {
  //     try {
  //         const response = await fetch(Platform.OS === "android" ? "http://10.0.2.2:8080/menuItem" : "http://localhost:8080/menuItem");
  //         const data = await response.json();
  //         setMenuList(data);
  //         setIsLoading(false);
  //         setError("");
  //     } catch (error) {
  //         console.log("Error fetching data:", error);
  //         setIsLoading(false);
  //         setError("Falied to fetch menu list");
  //     }
  // }

  const fetchCart = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.43:8080/cart/getCompleteCart/" + 1
      );
      const data = await response.json();
      setCart(data.cartItems);
      setIsLoading(false);
      setError("");
    } catch (error) {
      console.log("Error fetching data:", error);
      setIsLoading(false);
      setError("Falied to fetch menu list");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCart();
    setRefreshing(false);
  };

  useEffect(() => {
    // fetchMenuList();
    fetchCart();
  }, []);

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
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          renderItem={({ item }) => {
            return (
              <MenuItem
                title={item.menuItem.title}
                price={item.menuItem.price}
                quantity={item.quantity}
                confirmed={item.confirmed}
                preSelected={item.preSelected}
              />
            );
          }}
          ListEmptyComponent={<Text>No items found</Text>}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    borderWidth: 6,
    borderColor: "red",
    backgroundColor: "white",
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

export default MenuNoWebSocket;

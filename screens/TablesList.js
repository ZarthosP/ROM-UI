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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function TablesList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [tableList, setTableList] = useState([]);

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "http://10.50.104.71:8080/table/findAllOpenTables"
      );
      const data = await response.json();
      console.log(data);
      setTableList(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTables();
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
      <Button
        title="Log tables"
        onPress={() => console.log(tableList)}
      ></Button>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <NavigationContainer>
            <Stack.Navigator>
              <FlatList
                data={tableList}
                renderItem={({ item }) => {
                  return (
                    <Stack.Screen>
                      <View style={styles.itemContainer}>
                        <Text>Table {item.number}</Text>
                      </View>
                    </Stack.Screen>
                  );
                }}
                ListEmptyComponent={<Text>No items found</Text>}
                refreshing={refreshing}
                // onRefresh={handleRefresh}
              />
            </Stack.Navigator>
          </NavigationContainer>
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

export default TablesList;

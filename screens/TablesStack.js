import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Pressable,
} from "react-native";
import Menu from "./Menu";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Define the Stack Navigator for the tables
const Stack = createNativeStackNavigator();

function TablesListScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [error, setError] = useState("");

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.43:8080/table/findAllOpenTables"
      );
      const data = await response.json();
      setTableList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load tables");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={tableList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("TableMenu", {
                  tableId: item.id,
                })
              }
            >
              <View style={styles.itemContainer}>
                <Text>Table {item.number}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No tables found</Text>}
        />
      )}
    </View>
  );
}

function TablesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TablesList"
        component={TablesListScreen}
        options={{ title: "Tables", headerShown: false }}
      />
      <Stack.Screen
        name="TableMenu"
        component={Menu}
        options={{ title: "Table Details" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "black",
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: "#FFC0CB",
    borderWidth: 1,
    alignItems: "center",
  },
  errorText: {
    color: "#D8000C",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TablesStack;

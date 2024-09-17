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

  const addTable = async () => {
    try {
      const response = await fetch("http://192.168.1.43:8080/table/addTable", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: 1,
          numberOfClients: 10,
          tableStatus: "OPEN",
        }),
      });
      const data = await response.json();
      setTableList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load tables");
      setIsLoading(false);
    }
  };

  const closeTable = async (id) => {
    try {
      const response = await fetch(
        "http://192.168.1.43:8080/table/closeTable/" + id
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
            <View style={styles.itemContainer}>
              <Pressable
                style={styles.tableInfo}
                onPress={() =>
                  navigation.navigate("TableMenu", {
                    tableId: item.id,
                  })
                }
              >
                <Text>Table {item.number}</Text>
              </Pressable>

              {/* Button to the right */}
              <Button
                title="Close"
                onPress={() => closeTable(item.id)} // Call closeTable function with the table ID
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No tables found</Text>}
        />
      )}
      <Button title="Add new table" onPress={() => addTable()} />
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
    flexDirection: "row", // Align items in a row (text + button)
    justifyContent: "space-between", // Space out text and button
    alignItems: "center", // Center vertically
  },
  tableInfo: {
    flex: 1, // Let the text take up as much space as it can
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

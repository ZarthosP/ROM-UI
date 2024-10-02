import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Menu from "./Menu";
import Basket from "./Basket";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "text-encoding-polyfill";

const Stack = createNativeStackNavigator();

function TablesListScreen({ navigation }) {
  const WEBSOCKET_URL = "http://10.50.104.71:8080/ws";
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTableNumber, setnewTableNumber] = useState();
  const [newTableNumberOfClients, setnewTableNumberOfClients] = useState();

  const { t } = useTranslation();

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "http://10.50.104.71:8080/table/findAllOpenTables"
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
      const response = await fetch("http://10.50.104.71:8080/table/addTable", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: newTableNumber,
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
        "http://10.50.104.71:8080/table/closeTable/" + id
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

  const removeNotification = async (table) => {
    try {
      const response = await fetch(
        "http://10.50.104.71:8080/table/removeNotification",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(table),
        }
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

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setIsConnected(true);
      stompClient.subscribe("/topic/alerts", (response) => {
        const parsedResponse = JSON.parse(response.body);
        setTableList(parsedResponse);
        setIsLoading(false);
        setError("");
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: ", frame.headers["message"]);
      console.error("Additional details: ", frame.body);
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
      {/* <Button title="Log table list" onPress={() => console.log(tableList)} /> */}
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
                    tableNumber: item.number,
                  })
                }
              >
                <Text style={styles.tableText}>Table {item.number} </Text>
              </Pressable>

              {item.clientNotification ? (
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      clientNotification: false,
                    };
                    setTableList((prev) =>
                      prev.map((table) =>
                        table.id === item.id ? updatedTable : table
                      )
                    );
                    removeNotification(updatedTable);
                  }}
                >
                  <Text style={styles.notificationText}>C</Text>
                </TouchableOpacity>
              ) : null}

              {item.kitchenNotification ? (
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      kitchenNotification: false,
                    };
                    setTableList((prev) =>
                      prev.map((table) =>
                        table.id === item.id ? updatedTable : table
                      )
                    );
                    removeNotification(updatedTable);
                  }}
                >
                  <Text style={styles.notificationText}>K</Text>
                </TouchableOpacity>
              ) : null}

              {item.barNotification ? (
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      barNotification: false,
                    };
                    setTableList((prev) =>
                      prev.map((table) =>
                        table.id === item.id ? updatedTable : table
                      )
                    );
                    removeNotification(updatedTable);
                  }}
                >
                  <Text style={styles.notificationText}>B</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.roundButton}
                onPress={() =>
                  navigation.navigate("TableBasket", {
                    tableId: item.id,
                    tableNumber: item.number,
                  })
                }
              >
                <Text style={styles.buttonText}>{t("basket")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => closeTable(item.id)}
              >
                <Text style={styles.buttonText}>{t("close")}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tables found</Text>
          }
        />
      )}
      <Button
        title={t("addNewTable")}
        onPress={() => setIsModalVisible(true)}
      />
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Table</Text>

            <Text style={styles.label}>Table Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter table number"
              value={newTableNumber}
              onChangeText={setnewTableNumber}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Number of Clients</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of clients"
              value={newTableNumberOfClients}
              onChangeText={setnewTableNumberOfClients}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  addTable();
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Add Table</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TablesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TablesList"
        component={TablesListScreen}
        options={{ title: "Tables" }}
      />
      <Stack.Screen
        name="TableMenu"
        component={Menu}
        options={({ route }) => ({
          title: `Table ${route.params.tableNumber} Details`,
        })}
      />
      <Stack.Screen
        name="TableBasket"
        component={Basket}
        options={({ route }) => ({
          title: `Table ${route.params.tableNumber} Basket`,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "#DDD",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tableInfo: {
    flex: 1,
  },
  tableText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
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
  roundButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  notificationButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  label: {
    width: "100%",
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TablesStack;

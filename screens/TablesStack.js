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
import SockJS from "sockjs-client"; // Import SockJS client
import "text-encoding-polyfill"; // Polyfill for TextEncoder and TextDecoder

const Stack = createNativeStackNavigator();

function TablesListScreen({ navigation }) {
  const WEBSOCKET_URL = "http://192.168.1.43:8080/ws";
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

  const removeNotification = async (table) => {
    try {
      const response = await fetch(
        "http://192.168.1.43:8080/table/removeNotification",
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
      stompClient.subscribe("/topic/alerts", (response) => {
        const parsedResponse = JSON.parse(response.body);
        console.log(parsedResponse);
        setTableList(parsedResponse);
        setIsLoading(false);
        setError("");
      });

      // // Send an initial message to request data as soon as the connection is established
      // stompClient.publish({
      //   destination: "/app/cartWS/completeCart",
      //   body: JSON.stringify({ id: tableId, completeCartDto: null }),
      // });
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
      <Button
        title="Log table list"
        onPress={() => console.log(tableList)}
      ></Button>
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
                <Text>Table {item.number} </Text>
              </Pressable>

              {item.clientNotification ? (
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      clientNotification: false,
                    };

                    const updatedTableList = tableList.map((table) => {
                      if (table.id === item.id) {
                        return updatedTable;
                      }
                      return table;
                    });

                    setTableList(updatedTableList);
                    removeNotification(updatedTable);
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: "red",
                      },
                    ]}
                  >
                    C
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}

              {item.kitchenNotification ? (
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      kitchenNotification: false,
                    };

                    const updatedTableList = tableList.map((table) => {
                      if (table.id === item.id) {
                        return updatedTable;
                      }
                      return table;
                    });

                    setTableList(updatedTableList);
                    removeNotification(updatedTable);
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: "red",
                      },
                    ]}
                  >
                    K
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}

              {item.barNotification ? (
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => {
                    const updatedTable = {
                      ...item,
                      barNotification: false,
                    };

                    const updatedTableList = tableList.map((table) => {
                      if (table.id === item.id) {
                        return updatedTable;
                      }
                      return table;
                    });

                    setTableList(updatedTableList);
                    removeNotification(updatedTable);
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: "red",
                      },
                    ]}
                  >
                    B
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}

              <TouchableOpacity
                style={styles.roundButton}
                onPress={() =>
                  navigation.navigate("TableBasket", {
                    tableId: item.id,
                    tableNumber: item.number,
                  })
                }
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: "black",
                    },
                  ]}
                >
                  {t("basket")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => closeTable(item.id)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: "black",
                    },
                  ]}
                >
                  {t("close")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No tables found</Text>}
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
    backgroundColor: "white",
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
  },
  tableInfo: {
    flex: 1,
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
  roundButton: {
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
    textAlign: "left",
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
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TablesStack;

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";

function OrderItem({ itemName, quantity, table, id }) {
  const fetchCart = async () => {
    try {
      const response = await fetch(
        "http://10.50.104.71:8080/cart/cartItem/setReady/" + id
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.box,
        { backgroundColor: pressed ? "#f0f0f5" : "#fff" },
      ]}
      onPress={fetchCart}
    >
      <Text style={styles.itemText}>
        {t(itemName)} x {quantity}
      </Text>
      <Text style={styles.tableText}>
        {t("table")} {table}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    margin: 10,
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
    flexGrow: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  tableText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default OrderItem;

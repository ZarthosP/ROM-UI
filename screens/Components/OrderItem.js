import React, { useEffect } from "react";
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
        "http://192.168.1.43:8080/cart/cartItem/setReady/" + id
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
    <Pressable style={[styles.box]} onPress={() => fetchCart()}>
      <Text style={styles.text}>
        {t(itemName)} x {quantity}
      </Text>
      <Text style={styles.text}>
        {t("table")} {table}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    minWidth: 200,
    flexGrow: 1,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default OrderItem;

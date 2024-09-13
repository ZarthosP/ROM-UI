import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import OrderItem from "./Components/OrderItem";

function Kitchen(props) {
  return (
    <View style={styles.container}>
      <OrderItem itemName={"normalMenu"} quantity={1} table={"01"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"02"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"03"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
      <OrderItem itemName={"normalMenu"} quantity={5} table={"26"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 6,
    borderColor: "red",
    gap: 10,
    backgroundColor: "rgba(39, 19, 10, 1)",
  },
});

export default Kitchen;

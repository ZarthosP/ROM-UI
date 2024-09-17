import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

function QuantitySelector({
  id,
  title,
  quantity,
  price,
  confirmed,
  preSelected,
  ready,
  payed,
  quantitySelected,
  change,
}) {
  const [error, setError] = useState("");
  const { t } = useTranslation();

  function handleChange(qtyChange) {
    if (ready - qtyChange < 0) {
      setError("Max number selected");
    } else if (payed + qtyChange < 0) {
      setError("Cannot go under 0");
    } else {
      change(id, payed + qtyChange);
      setError("");
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          style={styles.decrementPressable}
          onPress={() => handleChange(-1)}
        >
          <Text>-</Text>
        </Pressable>
        <View
          style={[
            styles.numberContainer,
            { borderColor: error ? "red" : "#ddd" },
          ]}
        >
          <Text style={[styles.numberText, { color: error ? "red" : "#333" }]}>
            {payed}
          </Text>
        </View>
        <Pressable
          style={styles.incrementPressable}
          onPress={() => handleChange(1)}
        >
          <Text>+</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : <></>}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  errorText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "red",
  },
  container: {
    backgroundColor: "white",
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
  },
  totalContainer: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
  },
  decrementPressable: {
    borderColor: "#ddd",
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  incrementPressable: {
    borderColor: "#ddd",
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  numberContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
  },
  numberText: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default QuantitySelector;

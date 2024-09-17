import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

function MenuItem({ title, quantity, price, confirmed, preSelected, ready }) {
  const [quantityLocal, setQuantity] = useState(quantity);
  const { t } = useTranslation();
  return (
    <View style={{ width: "71%" }}>
      <Text style={styles.text}>
        {t(title)} {price} €
      </Text>
      <Text style={[styles.text, { fontSize: 20 }]}>
        Selected: {preSelected}
      </Text>
      {confirmed + ready > 0 ? (
        <Text style={[styles.text, { fontSize: 12, color: "red" }]}>
          Already ordered: {confirmed + ready}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default MenuItem;

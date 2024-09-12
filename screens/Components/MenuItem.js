import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

function MenuItem({ title, quantity, price, confirmed, preSelected }) {
  const [quantityLocal, setQuantity] = useState(quantity);
  const { t } = useTranslation();
  return (
    <View style={{ width: "71%" }}>
      <Text style={styles.text}>{t(title)}</Text>
      <Text style={styles.text}>{price} €</Text>
      <Text style={styles.text}>
        {preSelected} + {confirmed} = {quantity}
      </Text>
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
});

export default MenuItem;

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

function BasketItem({
  title,
  quantity,
  price,
  confirmed,
  preSelected,
  ready,
  payed,
}) {
  const [quantityLocal, setQuantity] = useState(quantity);
  const { t } = useTranslation();
  return (
    <View style={{ width: "71%" }}>
      <Text style={styles.text}>
        {ready} x {t(title)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default BasketItem;

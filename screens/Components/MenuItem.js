import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

function MenuItem({ title, quantity, price, confirmed, preSelected, ready }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t(title)} - {price}€
      </Text>
      <Text style={styles.subText}>Selected: {preSelected}</Text>
      {confirmed + ready > 0 && (
        <Text style={styles.subTextRed}>
          Already ordered: {confirmed + ready}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
  subTextRed: {
    fontSize: 12,
    color: "red",
  },
});

export default MenuItem;

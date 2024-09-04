import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {useTranslation} from 'react-i18next';

function OrderItem( {itemName, quantity, table} ) {
    const {t} = useTranslation();
    return (
        <Pressable style={[styles.box]} onPress={() => console.log("pressed")}>
            <Text style={styles.text}>{t(itemName)} x {quantity}</Text>
            <Text style={styles.text}>{t("table")} {table}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "plum", 
        borderWidth: 7,
        borderColor: "green",
        padding: 10,
        borderRadius: 10,
        minWidth: 0,
        flexGrow: 1,
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        color: "white"
    }
})

export default OrderItem;
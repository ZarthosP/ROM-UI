import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {useTranslation} from 'react-i18next';

function MenuItem( {itemName, itemPrice} ) {
    const {t} = useTranslation();
    return (
        <View style={styles.box}>
            <Pressable style={styles.removeOrAdd} onPress={() => console.log("Minus pressed")}>
                <Text style={styles.textRemoveOrAdd}>-</Text>
            </Pressable>
            <View style={{width: "71%"}}>
                <Text style={styles.text}>{t(itemName)}</Text>
                <Text style={styles.text}>{itemPrice} €</Text>
            </View>
            <Pressable style={styles.removeOrAdd} onPress={() => console.log("Plus pressed")}>
                <Text style={styles.textRemoveOrAdd}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "rgba(39, 19, 10, 1)",  
        borderWidth: 1,
        borderColor: "red",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "white"
    },
    removeOrAdd: {
        flex: 1,
        backgroundColor: "lightblue",
        fontSize: 24,
        fontWeight: "bold",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    textRemoveOrAdd: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "white"
    }
})

export default MenuItem;
import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {useTranslation} from 'react-i18next';

function MenuItem( {itemName, quantity, itemPrice} ) {
    const [quantityLocal, setQuantity] = useState(quantity);
    const {t} = useTranslation();
    return (
        <View style={styles.box}>
            <Pressable style={styles.removeOrAdd} onPress={() => {
                console.log("Minus pressed");
                setQuantity(quantityLocal - 1);

            }}>
                <Text style={styles.textRemoveOrAdd}>-</Text>
            </Pressable>
            <View style={{width: "71%"}}>
                <Text style={styles.text}>{t(itemName)}</Text>
                <Text style={styles.text}>{itemPrice} €</Text>
                <Text style={styles.text}>x {quantityLocal}</Text>
            </View>
            <Pressable style={styles.removeOrAdd} onPress={() => {
                setQuantity(quantityLocal + 1);
            }}>
                <Text style={styles.textRemoveOrAdd}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        margin: 16,
        borderColor: "rgba(39, 19, 10, 1)",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center",
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "black"
    },
    removeOrAdd: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: "white",
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
        color: "black"
    }
})

export default MenuItem;
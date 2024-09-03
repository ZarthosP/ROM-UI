import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
function BoxModel(props) {
    return (
        <View style={styles.container}>
            <View style={[styles.box, styles.lightblueBg]}>
                <Text>Lighblue box</Text>
            </View>
            <View style={[styles.box, styles.lightgreenBg]}>
                <Text>Lighblue box</Text>
            </View>
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "plum",
        padding: 60
    },
    box: {
        width: 100,
        height: 100,
        // padding: 10
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        borderWidth: 2,
        borderBlockColor: "purple",
        borderRadius: 5
    },
    lightblueBg: {
        backgroundColor: "lightblue",
    },
    lightgreenBg: {
        backgroundColor: "lightgreen",
    }
})
 
export default BoxModel;
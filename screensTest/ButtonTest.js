import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

function ButtonTest(props) {
    return (
        <View style={styles.background}>
            <Button 
                title='Press me' 
                onPress={() => console.log("Button pressed")}
                color="red"
                disabled
            />

        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "plum",
        padding: 60
    },
    logo: {
        width: 300,
        height: 300
    }
})

export default ButtonTest;
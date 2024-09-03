import React from 'react';
import { Background, StyleSheet, View, Text, Image } from 'react-native';

function LoginScreen(props) {
    return (
        <View 
            source={require("../assets/pineapple.jpg")}
            style={styles.background}>
            <View style={styles.logoContainer}>                
                <Image style={styles.logo} source={require("../assets/pampasLogo.png")}/>
                <Text style={styles.text1}>Eat what you can</Text>
            </View>
            <View style={styles.loginButton}>
                <Text>Login</Text>
            </View>
            <View style={styles.registerButton}></View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(39, 19, 10, 1)",        
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center"
    },
    text1: {
        color: "white"
    },
    loginButton: {
        width: "100%",
        height: 70,
        backgroundColor: "red",
        alignItems: "center",
        color: "white"
    },
    registerButton: {
        width: "100%",
        height: 70,
        backgroundColor: "black",
    },
    logo: {
        width: 200,
        height: 200,
    }
})

export default LoginScreen;
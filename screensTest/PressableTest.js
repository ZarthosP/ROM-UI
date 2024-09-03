import React from 'react';
import { Button, View, StyleSheet, ScrollView, Image, Text, Pressable } from 'react-native';

function PressableTest(props) {
    return (
        <View style={styles.background}>
            <Button 
                title='Press me' 
                onPress={() => console.log("Button pressed")}
                color="red"
            />
            <Pressable 
                onPress={() => console.log("Image pressed")}
                onLongPress={() => console.log("Image pressed longer")}>
                <Image source={require("../assets/icon.png")} style={styles.logo}></Image>
            </Pressable>
            <Pressable onPress={() => console.log("Text pressed")}>
                <Text>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
            </Pressable>
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


export default PressableTest;
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

function WebSocketTest2(props) {

    var socket = new WebSocket('ws://localhost:8080/websocket');

    socket.onopen = function(event) {
        console.log("WebSocket connection established.");
    };

    socket.onmessage = function(event) {
        const messageData = JSON.parse(event.data);
        // Handle incoming message data
        console.log("Received message:", messageData);
    };
    
    socket.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };
    
    socket.onclose = function(event) {
        console.log("WebSocket connection closed:", event);
    };
    
    function sendMessage(message) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket connection is not open.");
        }
    }

    return (
        <View>
            <Text>WebSocket Example</Text>
            <Button title='sendMessage' onPress={() => {
                    sendMessage("message test")
                }
            }></Button>
        </View>
    );
}

export default WebSocketTest2;
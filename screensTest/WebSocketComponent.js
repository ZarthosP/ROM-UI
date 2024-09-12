import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'text-encoding-polyfill'; // Polyfill for TextEncoder and TextDecoder


const WebSocketComponent = () => {

  const WEBSOCKET_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/ws' : 'http://localhost:8080/ws';
  const [message, setMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize the STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Handle successful connection
    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      // Subscribe to the topic to receive messages
      stompClient.subscribe('/topic/cart', (message) => {
        setMessage(message.body);
      });

      // Send an initial message to request data as soon as the connection is established
      stompClient.publish({ destination: '/app/cartWS/completeCart', body: 1 });
    };

    // Handle errors during connection or session
    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ', frame.headers['message']);
      console.error('Additional details: ', frame.body);
      Alert.alert('WebSocket Error', 'Failed to connect or maintain the WebSocket connection.');
    };

    // Activate the client to start the connection process
    stompClient.activate();
    setClient(stompClient);

    // Clean up the client when the component is unmounted
    return () => {
      stompClient.deactivate();
    };
  }, []);

  // Function to send a message manually from the input
  const sendMessage = () => {
    if (client && isConnected && inputMessage.trim()) {
      client.publish({ destination: '/app/cartWS/completeCart', body: inputMessage });
      setInputMessage('');
    } else {
      Alert.alert('Connection Error', 'WebSocket is not connected. Please wait and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.receivedMessage}>Received Message: {message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  receivedMessage: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default WebSocketComponent;

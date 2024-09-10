import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // Import SockJS client

const WEBSOCKET_URL = 'http://10.0.2.2:8080/ws'; // Ensure this matches your backend endpoint

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  useEffect(() => {
    // Initialize the STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL), // Use SockJS factory
      debug: (str) => console.log(str), // Optional: Log debug information
      reconnectDelay: 5000, // Attempt to reconnect every 5 seconds if the connection is lost
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Handle successful connection
    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true); // Update connection status

      // Subscribe to the topic
      stompClient.subscribe('/topic/greeting', (message) => {
        setMessage(message.body); // Set the received message
      });
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

  // Function to send a message
  const sendMessage = () => {
    if (client && isConnected && inputMessage.trim()) {
      // Check that the client is connected before sending
      client.publish({ destination: '/app/hello', body: inputMessage });
      setInputMessage(''); // Clear the input field
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

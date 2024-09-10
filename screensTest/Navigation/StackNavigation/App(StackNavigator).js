import { Button, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Pressable, Alert } from 'react-native';
import Menu from './screens/Menu';
import Kitchen from './screens/Kitchen';
import LanguageModal from './screens/Components/LanguageModal';
import WebSocketComponent from './screensTest/WebSocketComponent';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screensTest/Navigation/HomeScreen';
import AboutScreen from './screensTest/Navigation/AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} options={{
          title: "Welcome Home",
          headerStyle: {
            backgroundColor: "purple",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <Pressable onPress={() => alert("Menu button pressed!")}>
              <Text style={{ color: "#fff", fontSize: 16 }}>Menu</Text>
            </Pressable>
          ),
        }} />
        <Stack.Screen 
          name='About' 
          component={AboutScreen} 
          initialParams={{
            name: "Guest",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "plum",
    paddingTop: StatusBar.currentHeight
  },
  container: {
    flex: 1,
    backgroundColor: "white",  
  },
});

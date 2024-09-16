import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Pressable,
  Alert,
} from "react-native";
import Menu from "./screens/Menu";
import Bar from "./screens/Bar";
import Basket from "./screens/Basket";
import Login from "./screens/LoginForm";
import MenuNoWebSocket from "./screens/MenuNoWebSocket";
import Kitchen from "./screens/Kitchen";
import LanguageModal from "./screens/Components/LanguageModal";
import WebSocketComponent from "./screensTest/WebSocketComponent";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={{
          tabBarActiveTintColor: "purple",
        }}
      >
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="book" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
          }}
        />
        <Tab.Screen
          name="Kitchen"
          component={Kitchen}
          options={{
            tabBarLabel: t("kitchen"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="bonfire" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
          }}
        />
        <Tab.Screen
          name="Bar"
          component={Bar}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="beer" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
          }}
        />
        <Tab.Screen
          name="Basket"
          component={Basket}
          options={{
            tabBarLabel: t("basket"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="bag" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarLabel: t("Login"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
            tabBarBadge: 3,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

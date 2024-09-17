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
import Logout from "./screens/Logout";
import TablesList from "./screens/TablesList";
import TablesStack from "./screens/TablesStack";
import MenuNoWebSocket from "./screens/MenuNoWebSocket";
import Kitchen from "./screens/Kitchen";
import LanguageModal from "./screens/Components/LanguageModal";
import WebSocketComponent from "./screensTest/WebSocketComponent";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const [loggedUser, setLoggedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getLoggedUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("logged-user");
      setLoggedUser(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.error("Error reading user data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLoggedUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Kitchen"
        screenOptions={{
          tabBarActiveTintColor: "purple",
        }}
      >
        {loggedUser &&
        (loggedUser.userType === "SERVER" ||
          loggedUser.userType === "ADMIN") ? (
          <Tab.Screen
            name="Tables"
            component={TablesStack}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="list" size={20} color={color} />
              ),
              headerRight: () => <LanguageModal />,
            }}
          />
        ) : (
          <></>
        )}
        {!loggedUser ||
        (loggedUser &&
          loggedUser.userType !== "KITCHEN" &&
          loggedUser.userType !== "BAR") ? (
          <Tab.Screen
            name="Menu"
            component={Menu}
            initialParams={{ tableId: 104 }}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="book" size={20} color={color} />
              ),
              headerRight: () => <LanguageModal />,
            }}
          />
        ) : (
          <></>
        )}
        {loggedUser &&
        (loggedUser.userType === "KITCHEN" ||
          loggedUser.userType === "ADMIN") ? (
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
        ) : (
          <></>
        )}
        {loggedUser &&
        (loggedUser.userType === "BAR" || loggedUser.userType === "ADMIN") ? (
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
        ) : (
          <></>
        )}
        <Tab.Screen
          name="Basket"
          component={Basket}
          initialParams={{ tableId: 104 }}
          options={{
            tabBarLabel: t("basket"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="bag" size={20} color={color} />
            ),
            headerRight: () => <LanguageModal />,
            tabBarBadge: 3,
          }}
        />
        {!loggedUser ? (
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
        ) : (
          <></>
        )}
        {loggedUser ? (
          <Tab.Screen
            name="Logout"
            component={Logout}
            options={{
              tabBarLabel:
                loggedUser && loggedUser.username
                  ? loggedUser.username
                  : t("Logout"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="person" size={20} color={color} />
              ),
              headerRight: () => <LanguageModal />,
              tabBarBadge: 3,
            }}
          />
        ) : (
          <></>
        )}
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

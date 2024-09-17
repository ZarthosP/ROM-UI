import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Image,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = () => {
  const logout = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.removeItem("logged-user", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
});

export default Logout;

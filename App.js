import { StatusBar } from 'expo-status-bar';
import { Button, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Menu from './screens/Menu';
import LanguageModal from './screens/Components/LanguageModal';

export default function App() {
  return (
    <View style={styles.container}>
      <LanguageModal/>
      <Menu/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    backgroundColor: "rgba(39, 19, 10, 1)",  
  },
});

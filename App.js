import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Menu from './screens/Menu';

export default function App() {
  return (
    <View style={styles.container}>
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

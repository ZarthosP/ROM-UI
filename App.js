import { Button, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Menu from './screens/Menu';
import Kitchen from './screens/Kitchen';
import LanguageModal from './screens/Components/LanguageModal';

export default function App() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <LanguageModal/>
        <Menu/>
      </View>
    </SafeAreaView>
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
    backgroundColor: "rgba(39, 19, 10, 1)",  
  },
});

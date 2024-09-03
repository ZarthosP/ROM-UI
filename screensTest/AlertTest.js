import React from 'react';
import { Button, View, Alert, Modal, Text } from 'react-native';

function AlertTest(props) {
    return (
        <View style={{ flex: 1, backgroundColor: "plum", padding: 60}}>
            <Button title='Alert' onPress={() => Alert.alert("Invalid data!")}/>
            <Button title='Alert with message' onPress={() => Alert.alert("Invalid data!", "DOB incorrect")}/>
            <Button title='Alert with buttons' onPress={() => Alert.alert("Invalid data!", "DOB incorrect", [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel pressed")
                },
                {
                    text: "Ok",
                    onPress: () => console.log("Ok pressed")
                }
            ])}/>
        </View>
    );
}

export default AlertTest;
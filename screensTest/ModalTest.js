import React, { useState } from 'react';
import { Button, View, StyleSheet, Modal, Text } from 'react-native';

function ModalTest(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={styles.background}>

            <Button 
                title='Open modal' 
                onPress={() => setIsModalVisible(true)}
                color="midnighblue"
            />

            <Modal 
                visible={isModalVisible} 
                onRequestClose={() => setIsModalVisible(false)}
                animationType='slide'
                presentationStyle='formSheet'>
                <View style={styles.background2}>
                    <Text>Modal content</Text>
                    <Button 
                        title='Close modal' 
                        onPress={() => setIsModalVisible(false)}
                        color="red"
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "plum",
        padding: 60
    },
    background2: {
        flex: 1,
        backgroundColor: "lightblue",
        padding: 60
    },
    logo: {
        width: 300,
        height: 300
    }
})

export default ModalTest;
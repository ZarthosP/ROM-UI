import React, { useState } from 'react';
import { Button, View, StatusBar, Modal, Text } from 'react-native';
import Greet from './components/Greet';

function CustomComponentTest(props) {
    return (
        <View style={{ flex: 1, backgroundColor: "plum", padding: 60}}>
            <Greet name={"Bruce Wayne"}></Greet>
            <Greet name={"Clark Kent"}></Greet>
        </View>
    );
}

export default CustomComponentTest;
import React, { useState } from 'react';
import { Button, View, StatusBar, Modal, Text } from 'react-native';

function StatusBarTest(props) {

    const [hidden, setHidden] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: "plum", padding: 60}}>
            <StatusBar backgroundColor="lightgreen" barStyle="dark-content" hidden={hidden}/>

            <Button title='Press' onPress={() => setHidden(!hidden)}/>
        </View>
    );
}

export default StatusBarTest;
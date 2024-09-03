import React, { useState } from 'react';
import { Button, View, ActivityIndicator, Modal, Text } from 'react-native';

function ActivityIndicatorTest(props) {

    const [hidden, setHidden] = useState(true);

    return (
        <View style={{ flex: 1, backgroundColor: "plum", padding: 60}}>
            <ActivityIndicator/>
            <ActivityIndicator size="large"/>
            <ActivityIndicator size="large" color="midnightblue"/>

            <Button title='Press' onPress={() => setHidden(!hidden)}/>
            <ActivityIndicator size="large" color="midnightblue" animating={hidden}/>
        </View>
    );
}

export default ActivityIndicatorTest;
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import MenuItem from './Components/MenuItem';

function Menu(props) {

    const normalMenu = {
        itemName: "normalMenu",
        quantity: 2,
        itemPrice: 26
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
                <MenuItem {...normalMenu}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 30,
        borderWidth: 6,
        borderColor: "red",
        backgroundColor: "white",  
      },
})

export default Menu;
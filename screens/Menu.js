import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import MenuItem from './Components/MenuItem';

function Menu(props) {
    return (
        <View style={styles.container}>
            <ScrollView>
                <MenuItem itemName={"normalMenu"} itemPrice={"26"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
                <MenuItem itemName={"normalMenu"} itemPrice={"25"}/>
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
        backgroundColor: "rgba(39, 19, 10, 1)",  
      },
})

export default Menu;
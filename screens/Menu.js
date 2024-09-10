import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, FlatList, Platform, ActivityIndicator } from 'react-native';
import MenuItem from './Components/MenuItem';

function Menu(props) {

    const [menuList, setMenuList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const response = await fetch(Platform.OS === "android" ? "http://10.0.2.2:8080/menuItem" : "http://localhost:8080/menuItem");
            const data = await response.json();
            setMenuList(data);
            setIsLoading(false);
            setError("");
        } catch (error) {
            console.log("Error fetching data:", error);
            setIsLoading(false);
            setError("Falied to fetch menu list");
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if(isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="0000ff"></ActivityIndicator>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
            <FlatList 
                data={menuList}
                renderItem={({ item }) => {
                    return (
                        <MenuItem {...item}/>
                    )
                }}
                ListEmptyComponent={<Text>No items found</Text>}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />)}
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
    loadingContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },
    errorContainer: {
        backgroundColor: "#FFC0CB",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        margin: 16,
        alignItems: "center",
      },
      errorText: {
        color: "#D8000C",
        fontSize: 16,
        textAlign: "center",
      },
})

export default Menu;
import React from 'react';
import { Button, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, Switch } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import {useTranslation} from 'react-i18next';
import { useState } from 'react';
import languageList from '../../services/languageList.json'

function LanguageModal(props) {

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [visible, setVisible] = useState(false);
    const {t} = useTranslation();

    const changeLng = (lng) => {
        i18next.changeLanguage(lng);
        setVisible(false);
    }
    return (
        <View style={styles.container}>
            <Modal visible={visible} onRequestClose={() => setVisible(false)}>
                <View style={styles.languageList}>
                <FlatList data={Object.keys(languageResources)} renderItem={({item}) => (
                    <TouchableOpacity 
                    style={styles.languageButton} 
                    onPress={() => changeLng(item)}>
                    <Text style={styles.lngName}>{languageList[item].nativeName}</Text>
                    </TouchableOpacity>
                )}/>
                <Button 
                    title='Close modal' 
                    onPress={() => setVisible(false)}
                    color="red"
                />
                </View>
            </Modal>
            <Button title={t('changeLanguage')} onPress={() => setVisible(true)}/>
            <Text style={ {color: isDarkMode ? "white" : "red"} }>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={() => setIsDarkMode((previousState) => !previousState)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    languageList: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#6258e8"
    },

    languageButton: {
        padding: 10,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
    },
    lngName: {
        fontSize: 16,
        color: 'white',
    },
})

export default LanguageModal;
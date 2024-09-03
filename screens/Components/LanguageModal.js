import React from 'react';
import { Button, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import {useTranslation} from 'react-i18next';
import { useState } from 'react';
import languageList from '../../services/languageList.json'

function LanguageModal(props) {

    const [visible, setVisible] = useState(false);
    const {t} = useTranslation();

    const changeLng = (lng) => {
        i18next.changeLanguage(lng);
        setVisible(false);
    }
    return (
        <View>
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
        <Text style={{ color: "white"}}>{t('test')}</Text>
        <Button title={t('changeLanguage')} onPress={() => setVisible(true)}/>
        </View>
    );
}

const styles = StyleSheet.create({
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
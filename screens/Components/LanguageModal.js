import React, { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import i18next, { languageResources } from "../../services/i18next";
import { useTranslation } from "react-i18next";
import languageList from "../../services/languageList.json";

function LanguageModal(props) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("chooseLanguage")}</Text>
            <FlatList
              data={Object.keys(languageResources)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageButton}
                  onPress={() => changeLng(item)}
                >
                  <Text style={styles.lngName}>
                    {languageList[item].nativeName}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.openButtonText}>{t("currentLanguage")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  languageButton: {
    backgroundColor: "#6258e8",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  lngName: {
    fontSize: 18,
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  openButton: {
    marginRight: 10, // Add margin for header alignment
  },
  openButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 14, // Reduce font size for better alignment in the header
  },
});

export default LanguageModal;

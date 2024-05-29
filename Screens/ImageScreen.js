// ImageScreen.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const ImageScreen = ({ route, navigation }) => {
    const { imageUrl, posterName } = route.params;

    // Function to download the image
    const downloadImage = async () => {
        try {
            const downloadResult = await FileSystem.downloadAsync(
                imageUrl,
                FileSystem.documentDirectory + 'downloadedImage.jpg'
            );
            await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
            alert('Image téléchargée');
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <AntDesign name="closecircle" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.posterName}>{posterName}</Text>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
                <FontAwesome name="download" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    posterName: {
        position: 'absolute',
        top: 40,
        left: 20,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 1,
    },
    downloadButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        zIndex: 1,
    },
});

export default ImageScreen;

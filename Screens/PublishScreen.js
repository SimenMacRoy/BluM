import React, { useState, useContext } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UserContext from './UserContext'; // Adjust the path if necessary
import { Video } from 'expo-av';
import config from '../config';

const PublishScreen = () => {
    const [media, setMedia] = useState(null);
    const [description, setDescription] = useState('');
    const { currentUser } = useContext(UserContext);

    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setMedia(result);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('media', {
            uri: media.uri,
            type: media.type === 'video' ? 'video/mp4' : 'image/jpeg', // Adjust based on your needs
            name: media.type === 'video' ? 'upload.mp4' : 'upload.jpg',
        });
        formData.append('userID', currentUser.userID);
        formData.append('description', description);

        try {
            const response = await fetch(`${config.apiBaseUrl}/posts/publish`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "Your post has been published!");
                setDescription(''); // Clear the description after successful upload
                setMedia(null); // Clear the media after successful upload
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to publish post: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image or video" onPress={pickMedia} />
            {media && (media.type === 'image' ? (
                <Image source={{ uri: media.uri }} style={styles.preview} />
            ) : (
                <Video
                    source={{ uri: media.uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay={false}
                    isLooping={false}
                    style={styles.preview}
                    useNativeControls
                />
            ))}
            <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                placeholder="Write a description..."
                multiline
            />
            <Button title="Upload" onPress={handleUpload} disabled={!media || !description} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    preview: {
        width: 300,
        height: 300,
        marginBottom: 20,
        resizeMode: 'contain'
    },
    input: {
        height: 100,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        padding: 10,
        backgroundColor: 'white'
    }
});

export default PublishScreen;

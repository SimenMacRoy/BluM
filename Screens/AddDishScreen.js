import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-community/picker'; // Update the package import
import * as ImagePicker from 'expo-image-picker';
import Header from './Header'; 
import config from '../config';

const AddDishScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Africans');
    const [description, setDescription] = useState('');
    const [preparation, setPreparation] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [portions, setPortions] = useState('');
    const [difficulty, setDifficulty] = useState('Facile');
    const [image, setImage] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [price, setPrice] = useState('');
    const [dishBlums, setDishBlums] = useState('');
    const [countryFlag, setCountryFlag] = useState('');
    const [nutritiveFacts, setNutritiveFacts] = useState('');
    const [dishDisblums, setDishDisblums] = useState('');


    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleAddDish = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/dish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    preparation,
                    recommendations,
                    portions,
                    difficulty,
                    image,
                    videoUrl,
                    price,
                    dishBlums,
                    countryFlag,
                    nutritiveFacts,
                    dishDisblums,
                }),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert('Success', 'Dish added successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add dish');
            console.error(error);
        }
    };

    return (
        <ScrollView>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Ajouter un Repas</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Picker
                    selectedValue={category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    <Picker.Item label="Africans" value="Africans" />
                    <Picker.Item label="Americans" value="Americans" />
                    <Picker.Item label="Asians" value="Asians" />
                    <Picker.Item label="Europeans" value="Europeans" />
                </Picker>

                <TextInput
                    style={styles.textArea}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                />

                <TextInput
                    style={styles.textArea}
                    placeholder="Preparation"
                    value={preparation}
                    onChangeText={setPreparation}
                    multiline={true}
                />

                <TextInput
                    style={styles.textArea}
                    placeholder="Recommendations"
                    value={recommendations}
                    onChangeText={setRecommendations}
                    multiline={true}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Portions"
                    value={portions}
                    onChangeText={setPortions}
                    keyboardType="numeric"
                />

                <Picker
                    selectedValue={difficulty}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDifficulty(itemValue)}
                >
                    <Picker.Item label="Facile" value="Facile" />
                    <Picker.Item label="Medium" value="Medium" />
                    <Picker.Item label="Difficile" value="Difficile" />
                </Picker>

                <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePickerText}>Choose Image</Text>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Video URL"
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Likes"
                    value={dishBlums}
                    onChangeText={setDishBlums}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Country Flag"
                    value={countryFlag}
                    onChangeText={setCountryFlag}
                />

                <TextInput
                    style={styles.textArea}
                    placeholder="Nutritive Facts"
                    value={nutritiveFacts}
                    onChangeText={setNutritiveFacts}
                    multiline={true}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Dislikes"
                    value={dishDisblums}
                    onChangeText={setDishDisblums}
                    keyboardType="numeric"
                />

                <TouchableOpacity onPress={handleAddDish} style={styles.button}>
                    <Text style={styles.buttonText}>Ajouter le repas</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        fontFamily: 'Ebrima',
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#aaa',
        fontFamily: 'Ebrima',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Ebrimabd'
    },
});

export default AddDishScreen;

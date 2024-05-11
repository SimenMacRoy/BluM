// LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/validateEmail';
import UserContext from './UserContext'; // Adjust the path as necessary

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const { loginUser } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                loginUser({
                    userID: data.userID,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone_number: data.phone_number,
                    postal_address: data.postal_address,
                    country_of_origin: data.country_of_origin,
                    profile_picture: data.profile_picture
                });
                navigation.navigate('MainTabs');
            } else {
                Alert.alert('Invalid Credentials', data.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'An error occurred while trying to log in.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                style={styles.logo}
                source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\bluMlogo.png')}
                resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText} numberOfLines={2}>
                    Connectez-vous, et degustez !
                </Text>
            </View>
            <View style={styles.containerWrapper}>
                <ScrollView style={styles.scrollContainer}>
                    <Text style={styles.textField}>Email</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                    />
                    <Text style={styles.textField}>Mot de passe</Text>
                    <TextInput 
                        style={styles.inputText}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <Pressable 
                        style={styles.buttonLogin}
                        onPress={handleLogin}
                    >
                        <Text style={[styles.buttonText, validateEmail(email) ? { backgroundColor : 'green' } : {backgroundColor : 'grey'}]}>
                            Login
                        </Text>
                    </Pressable>
                    <Text style={styles.info}>
                        Pas de compte ?
                    </Text>
                    <Pressable 
                        style={styles.buttonCreate}
                        onPress={() => navigation.navigate('RegistrationScreen')}
                    >
                        <Text style={styles.buttonText}>
                            Creer
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
        </ScrollView>
    );    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    logo: {
        width: 157, 
        height: 157, 
        position: 'absolute', 
        top: 136, 
        left: 110,
        borderRadius: 100,
    },
    welcomeContainer: {
        position: 'absolute',
        top: 320, // Adjust the top position as needed
        left: 45,
        marginTop: 5,
        marginBottom: 10,
        alignContent: 'center',
      },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black',
        alignContent: 'center'
    },
    containerWrapper: {
        paddingHorizontal: 5,
        backgroundColor: '#15FCFC',
        borderRadius: 20,
        marginHorizontal: 25,
        marginTop: 390,
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    textField: { 
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 10,
        paddingTop: 10,
        marginBottom: 5,
    },
    inputText: {
        width: 302,
        height: 50,
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        fontSize: 20,
        marginLeft: 10,
        padding: 10,
    }, 
    buttonLogin: {
        width: 155,
        height: 60,
        marginLeft: 77.5, 
        marginRight: 77.5,
        marginTop: 30

    },
    buttonText: {
        fontSize: 20,
        padding: 15,
        textAlign: 'center',
        borderRadius: 30,
        color: 'white',
    },
    info: {
        paddingTop: 10,
        fontSize: 25,
        textAlign: 'center',
    },
    buttonCreate: {
        width: 155,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'gray',
        marginTop: 20,
        marginLeft: 77.5,
        backgroundColor: 'yellow',
        
    },
})

export default LoginScreen;

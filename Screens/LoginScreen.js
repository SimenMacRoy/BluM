import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { validateEmail } from '../utils/validateEmail';
import UserContext from './UserContext'; // Adjust the path as necessary

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
                Alert.alert('Email ou mot de passe invalide', data.error);
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
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Icon
                                name={isPasswordVisible ? "visibility" : "visibility-off"}
                                size={24}
                                color="gray"
                                style={styles.eyeIcon}
                            />
                        </Pressable>
                    </View>
                    <Pressable 
                        style={styles.buttonLogin}
                        onPress={handleLogin}
                    >
                        <Text style={[styles.buttonText, validateEmail(email) ? { backgroundColor : 'green' } : {backgroundColor : 'grey'}]}>
                            Login
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                        <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
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
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 30,
    },
    welcomeText: {
        fontFamily: 'Ebrimabd',
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
        marginBottom: 20
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    forgotPasswordText: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
        fontFamily: 'Ebrima',
    },
    textField: { 
        fontSize: 18,
        fontFamily: 'Ebrimabd',
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
        fontSize: 16,
        marginLeft: 10,
        padding: 10,
        fontFamily: 'Ebrima',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        paddingRight: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        padding: 10,
        fontFamily: 'Ebrima',
    },
    eyeIcon: {
        marginLeft: 10,
    },
    buttonLogin: {
        width: 155,
        height: 60,
        marginLeft: 77.5, 
        marginRight: 77.5,
        marginTop: 30,

    },
    buttonText: {
        fontSize: 20,
        padding: 15,
        textAlign: 'center',
        borderRadius: 30,
        color: 'white',
        fontFamily: 'Ebrima',
    },
    info: {
        paddingTop: 10,
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'Ebrima',
    },
    buttonCreate: {
        width: 155,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'gray',
        marginTop: 20,
        marginLeft: 77.5,
        backgroundColor: 'black',
    },
})

export default LoginScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import config from '../config';

const AddMemberScreen = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAddMember = async () => {
        if (!name || !surname || !phoneNumber || !email || !role || !postalAddress || !password || !confirmPassword) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match.');
            return;
        }

        const memberData = {
            name,
            surname,
            phoneNumber,
            email,
            role,
            postalAddress,
            password,
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/add-member`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Member added successfully.');
                // Clear the form
                setName('');
                setSurname('');
                setPhoneNumber('');
                setEmail('');
                setRole('');
                setPostalAddress('');
                setPassword('');
                setConfirmPassword('');
            } else {
                Alert.alert('Error', 'Failed to add member. Please try again.');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', 'An error occurred while adding the member.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Add New Member</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <Text style={styles.label}>Surname</Text>
            <TextInput
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                style={styles.input}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />

            <Text style={styles.label}>Role</Text>
            <TextInput
                placeholder="Role"
                value={role}
                onChangeText={setRole}
                style={styles.input}
            />

            <Text style={styles.label}>Postal Address</Text>
            <TextInput
                placeholder="Postal Address"
                value={postalAddress}
                onChangeText={setPostalAddress}
                style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddMember}>
                <Text style={styles.buttonText}>Add Member</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        margin: 10,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Ebrima',
    },
    input: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        fontFamily: 'Ebrima'
    },
    button: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        fontFamily: 'Ebrima',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddMemberScreen;

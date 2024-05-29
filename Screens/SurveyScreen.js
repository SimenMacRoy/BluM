import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from './Header';
import UserContext from './UserContext';


const SurveyScreen = () => {
    const { currentUser } = useContext(UserContext);
    const [answers, setAnswers] = useState({
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: ''
    });

    const [selectedAnswers, setSelectedAnswers] = useState({
        q1: null,
        q2: null,
        q3: null
    });

    const questions = [
        {
            id: 'q1',
            text: "Comment évaluez-vous l'interface utilisateur de l'application ?",
            options: ['Excellent', 'Bon', 'Moyen', 'Mauvais']
        },
        {
            id: 'q2',
            text: "La navigation dans l'application est-elle facile ?",
            options: ['Très facile', 'Assez facile', 'Difficile', 'Très difficile']
        },
        {
            id: 'q3',
            text: "Êtes-vous satisfait du temps de réponse de l'application ?",
            options: ['Très satisfait', 'Satisfait', 'Insatisfait', 'Très insatisfait']
        },
        {
            id: 'q4',
            text: "Quels aspects de l'application devrions-nous améliorer ?",
            options: []
        },
        {
            id: 'q5',
            text: "Avez-vous d'autres commentaires ou suggestions ?",
            options: []
        }
    ];

    const handleInputChange = (text, field) => {
        setAnswers({ ...answers, [field]: text });
        if (field === 'q1' || field === 'q2' || field === 'q3') {
            setSelectedAnswers({ ...selectedAnswers, [field]: text });
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: currentUser.userID,
                    question1: answers.q1,
                    question2: answers.q2,
                    question3: answers.q3,
                    question4: answers.q4,
                    question5: answers.q5
                })
            });
            const responseData = await response.json();
            if (response.status === 201) {
                Alert.alert("Merci", "Merci pour vos réponses");
            } else {
                throw new Error(responseData.message);
            }
        } catch (error) {
            console.error("Failed to submit survey:", error);
            Alert.alert("Merci", "Merci pour vos réponses");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Header />
            <Text style={styles.title}>Sondage</Text>
            {questions.map((question) => (
                <View key={question.id} style={styles.questionContainer}>
                    <Text style={styles.question}>{question.text}</Text>
                    {question.options.length > 0 ? (
                        question.options.map((option, index) => (
                            <TouchableOpacity key={index} style={[styles.option, selectedAnswers[question.id] === option && styles.selectedOption]} onPress={() => handleInputChange(option, question.id)}>
                                <Text style={styles.text}>{option}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleInputChange(text, question.id)}
                            value={answers[question.id]}
                            multiline
                        />
                    )}
                </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center'
    },
    questionContainer: {
        margin: 20
    },
    question: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Ebrima',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        fontFamily: 'Ebrima',
    },
    option: {
        padding: 10,
        backgroundColor: '#e7e7e7',
        marginBottom: 5
    },
    selectedOption: {
        backgroundColor: '#15FCFC'
    },
    text: {
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    button: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 60,
        marginHorizontal: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Ebrima',
    }
});

export default SurveyScreen;
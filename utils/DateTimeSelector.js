import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimeSelector = ({ initialDate, onDateChange, initialTime, onTimeChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [deliveryTimes, setDeliveryTimes] = useState([]);

    useEffect(() => {
        generateDeliveryTimes();
    }, []);

    const generateDeliveryTimes = () => {
        let times = [];
        let currentTime = new Date();
        if (currentTime.getHours() >= 22 || currentTime.getHours() < 7) {
            currentTime.setHours(7, 0, 0, 0);
            currentTime.setDate(currentTime.getDate() + 1);
        } else {
            currentTime.setMinutes(currentTime.getMinutes() + 30 - (currentTime.getMinutes() % 5));
        }
        for (let i = 0; i < 8; i++) { // Generate times for the next 4 hours
            let newTime = new Date(currentTime.getTime() + i * 30 * 60000);
            times.push(newTime.toTimeString().substring(0, 5));
        }
        setDeliveryTimes(times);
        setSelectedTime(times[0]);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || initialDate;
        if (currentDate < new Date()) {
            Alert.alert('Date Invalide', 'Veuillez choisir une date future.');
            setShowDatePicker(false);
            return;
        }
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        onDateChange(currentDate);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onTimeChange(time);
    };

    return (
        <View>
            <Text style={styles.subHeader}>Choisir l'heure de livraison:</Text>
            <View style={styles.timeContainer}>
                {deliveryTimes.map((time, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.timeButton, selectedTime === time && styles.selectedTime]} 
                        onPress={() => handleTimeSelect(time)}
                    >
                        <Text style={styles.timeText}>{time}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.subHeader}>Choisir la date de livraison:</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                    {showDatePicker ? 'Choose Date' : `Date sélectionnée: ${selectedDate.toLocaleDateString()}`}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    subHeader: {
        fontSize: 18,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    timeButton: {
        backgroundColor: '#15FCFC',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        margin: 5,
    },
    selectedTime: {
        backgroundColor: '#15B8B8',
        
    },
    timeText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    dateButton: {
        padding: 10,
        backgroundColor: '#e7e7e7',
        borderRadius: 5,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Ebrima',
    }
});

export default DateTimeSelector;

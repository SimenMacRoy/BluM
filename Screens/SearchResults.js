import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

const SearchResults = ({ results, onResultPress }) => {
    const [selectedId, setSelectedId] = useState(null);

    const handlePress = (result, index) => {
        setSelectedId(index);
        onResultPress(result);

        // Reset selectedId after a short delay
        setTimeout(() => {
            setSelectedId(null);
        }, 500); // Adjust the delay as needed
    };

    return (
        <ScrollView style={styles.container}>
            {results.map((result, index) => (
                <TouchableOpacity 
                    key={index} 
                    onPress={() => handlePress(result, index)} 
                    style={[styles.searchItem, selectedId === index && styles.selectedItem]}
                >
                    <View style={styles.resultContent}>
                        <Image source={{ uri: result.image }} style={styles.image} />
                        <Text style={styles.title}>{result.title}</Text>
                        <Text style={styles.price}>${result.id}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    searchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        marginRight: 5,
    },
    selectedItem: {
        backgroundColor: '#15FCFC',
        borderRadius: 20,
    },
    resultContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    price: {
        flex: 0.25,
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
});

export default SearchResults;

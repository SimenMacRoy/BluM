import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

const SearchBar = ({ searchText, onSearch, onResultPress, placeholder = "Que voulez-vous cuisiner ?", searchType, supplierID }) => {
    const [focused, setFocused] = useState(false);
    const [text, setText] = useState(searchText);
    const [suggestions, setSuggestions] = useState(null);

    const navigation = useNavigation();

    const fetchResults = async (query) => {
        let apiEndpoint = '';
        if (searchType === 'foods') {
            apiEndpoint = `${config.apiBaseUrl}/search/foods?query=${query}`;
        } else if (searchType === 'ingredients') {
            apiEndpoint = `${config.apiBaseUrl}/search/ingredients?query=${query}`;
        } else if (searchType === `supplier_ingredients_${supplierID}` && supplierID) {  // Ensure supplierID is defined
            apiEndpoint = `${config.apiBaseUrl}/search/supplier_ingredients/${supplierID}?query=${query}`;
        } else {
            apiEndpoint = `${config.apiBaseUrl}/search/${searchType}?query=${query}`;
        }
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching search results:', error);
            return [];
        }
    };

    const handleSearchIconPress = () => {
        if (!text) {
            this.textInputRef.focus();
        } else {
            if (suggestions) {
                navigation.navigate('IngredientsDetailScreen', { ingredientId: suggestions.id });
            }
        }
    };

    const handleFocus = () => setFocused(true);

    const handleBlur = () => {
        if (text === '') {
            setFocused(false);
        }
    };

    const handleChangeText = async (value) => {
        setText(value);

        if (value) {
            const filteredData = await fetchResults(value);

            if (filteredData.length > 0) {
                setSuggestions(filteredData[0]);
            } else {
                setSuggestions(null);
            }

            if (onSearch) {
                onSearch(filteredData);
            }
        } else {
            if (onSearch) {
                onSearch([]);
            }
            setSuggestions(null);
        }
    };

    const clearText = () => {
        setText('');
        if (onSearch) {
            onSearch([]);
        }
    };

    return (
        <View>
            <View style={styles.searchContainer}>
                <FontAwesome name="search" onPress={handleSearchIconPress} size={20} color="black" />
                <TextInput
                    ref={(input) => { this.textInputRef = input; }}
                    style={[styles.searchText, focused ? styles.focused : null]}
                    value={text}
                    onChangeText={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                />
                {text ? (
                    <TouchableOpacity onPress={clearText} style={styles.clearIcon}>
                        <FontAwesome name="times-circle" size={25} color="black" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
        margin: 10,
        marginTop: 7,
    },
    searchText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 18,
        padding: 10,
        fontFamily: 'Ebrima',
    },
    focused: {
        backgroundColor: '#D9D9D9', 
        borderColor: '#000', 
    },
    clearIcon: {},
});

export default SearchBar;

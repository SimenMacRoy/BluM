import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchBar = ({ searchText, onSearch, onResultPress, placeholder = "Que voulez-vous cuisiner ?", searchType }) => {
    const [focused, setFocused] = useState(false);
    const [text, setText] = useState(searchText);
    const [suggestedDish, setSuggestedDish] = useState(null);
    const [suggestedIngredient, setSuggestedIngredient] = useState(null);
    const [suggestedSpices, setSuggestedSpices] = useState(null);
    const [suggestedMeats, setSuggestedMeats] = useState(null);
    const [suggestions, setSuggestions] = useState(null);

    const navigation = useNavigation();

    const fetchResults = async (query) => {
        let apiEndpoint = '';
        if (searchType === 'foods') {
            apiEndpoint = `http://192.168.69.205:3006/api/search/foods?query=${query}`;
        } else if (searchType === 'ingredients') {
            apiEndpoint = `http://192.168.69.205:3006/api/search/ingredients?query=${query}`;
        } else {
            apiEndpoint = `http://192.168.69.205:3006/api/search/${searchType}?query=${query}`;
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
            // Focus the text input if no text is entered
            this.textInputRef.focus();
        } else {
            if (searchType === 'foods' && suggestedDish) {
                navigation.navigate('RecipeScreenDetail', { dishId: suggestedDish.id });
            } else if (searchType === 'ingredients' && suggestedIngredient) {
                navigation.navigate('IngredientsDetailScreen', { ingredientId: suggestedIngredient.id });
            } else {
                if (searchType === 'Africans' || searchType === 'Americans' || searchType === 'Asians' || searchType === 'Europeans'){
                    navigation.navigate('RecipeScreenDetail', { dishId: suggestions.id });
                }
                else {
                    navigation.navigate('IngredientsDetailScreen', { ingredientId: suggestions.id });
                }
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

            if (searchType === 'foods') {
                if (filteredData.length > 0) {
                    setSuggestedDish(filteredData[0]);
                } else {
                    setSuggestedDish(null);
                }
            } else if (searchType === 'ingredients') {
                if (filteredData.length > 0) {
                    setSuggestedIngredient(filteredData[0]);
                } else {
                    setSuggestedIngredient(null);
                }
            } else {
                if (filteredData.length > 0) {
                    setSuggestions(filteredData[0]);
                } else {
                    setSuggestions(null);
                }
            }

            if (onSearch) {
                onSearch(filteredData);
            }
        } else {
            if (onSearch) {
                onSearch([]);
            }
            setSuggestedDish(null);
            setSuggestedIngredient(null);
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
        backgroundColor: '#D9D9D9', // Lighter background when focused
        borderColor: '#000', // Darker border when focused
    },
    clearIcon: {},
});

export default SearchBar;

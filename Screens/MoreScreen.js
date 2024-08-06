import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Material icons as an example
import Header from './Header';
import UserContext from './UserContext';
import config from '../config';

const MoreScreen = () => {
    const navigation = useNavigation();
    const { currentUser: user } = useContext(UserContext);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/members`);
                const data = await response.json();
                if (data.success) {
                    const memberEmails = data.members.map(member => member.email);
                    if (memberEmails.includes(user.email)) {
                        setIsMember(true);
                    }
                } else {
                    Alert.alert('Error', 'Failed to fetch members.');
                }
            } catch (error) {
                console.error('Error fetching members:', error);
                Alert.alert('Error', 'An error occurred while fetching members.');
            }
        };

        fetchMembers();
    }, [user]);

    return (
        <ScrollView>
            <Header />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('EditProfileScreen')}>
                <Icon name="person-outline" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Gérer mon profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('ReceiptScreen')}>
                <Icon name="receipt" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Mes Factures</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('PromotionsScreen')}>
                <Icon name="local-offer" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Promotions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('FAQsScreen')}>
                <Icon name="question-answer" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('SurveyScreen')}>
                <Icon name="poll" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Avis/Sondages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                onPress={() => navigation.navigate('SupportScreen')}>
                <Icon name="support-agent" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Aide et Support</Text>
            </TouchableOpacity>

            {isMember && (
                <>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                        onPress={() => navigation.navigate('AddDishScreen')}
                    >
                        <Icon name="add-circle-outline" size={20} />
                        <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Ajouter un Repas</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                        onPress={() => navigation.navigate('AddMemberScreen')}
                    >
                        <Icon name="add-circle-outline" size={20} />
                        <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima' }}>Ajouter un membre</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
}

export default MoreScreen;

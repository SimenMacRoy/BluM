import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Material icons as an example
import Header from './Header';

const MoreScreen = () => {
    const navigation = useNavigation();

    return(
        <ScrollView>
            <Header />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10,  }}
                              onPress={() => navigation.navigate('EditProfileScreen')}>
                <Icon name="person-outline" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima', }}>Gérer mon profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                              onPress={() => navigation.navigate('ReceiptScreen')}>
                <Icon name="receipt" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima', }}>Mes Factures</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                              onPress={() => navigation.navigate('PromotionsScreen')}>
                <Icon name="local-offer" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima', }}>Promotions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                              onPress={() => navigation.navigate('FAQsScreen')}>
                <Icon name="question-answer" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima', }}>FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                              onPress={() => navigation.navigate('SurveyScreen')}>
                <Icon name="poll" size={20} />
                <Text style={{ marginLeft: 10, fontSize: 20, fontFamily: 'Ebrima', }}>Avis/Sondages</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default MoreScreen;

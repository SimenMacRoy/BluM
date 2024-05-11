import React from 'react';
import {View , Text, ScrollView} from 'react-native';
import ProfileScreen from './ProfileScreen';
import Header from './Header';

const MoreScreen = () => {
    return(
        <ScrollView>
            <Header />
            <ProfileScreen />
        </ScrollView>
    )
}
export default MoreScreen;
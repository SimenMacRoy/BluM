import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FollowButton = ({ blumerID, blumeeID }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/follow-status?blumerID=${blumerID}&blumeeID=${blumeeID}`);
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            } catch (error) {
                console.error('Error fetching follow status:', error);
            }
        };
        fetchFollowStatus();
    }, [blumerID, blumeeID]);

    const handleFollow = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blumerID, blumeeID })
            });

            const data = await response.json();
            if (data.success) {
                setIsFollowing(true);
            } else {
                Alert.alert('Error', data.error || 'Failed to follow the user');
            }
        } catch (error) {
            console.error('Error following user:', error);
            Alert.alert('Error', 'An error occurred while trying to follow the user');
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, isFollowing && styles.disabledContainer]}
            onPress={!isFollowing ? handleFollow : null}
            disabled={isFollowing}
        >
            <FontAwesome name="plus" size={16} color="white" />
            <Text style={styles.text}>{isFollowing ? 'Blumee' : 'Blum'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF1493',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    disabledContainer: {
        backgroundColor: 'grey', // Set to grey when disabled
    },
    text: {
        color: 'white',
        marginLeft: 5,
    },
});

export default FollowButton;

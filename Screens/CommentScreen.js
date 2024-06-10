// CommentScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import UserContext from './UserContext'; 
import config from '../config';// Adjust the path as necessary

const CommentScreen = ({ route }) => {
    const { postId } = route.params;
    const { currentUser } = useContext(UserContext); // Get the current user from the context
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://192.168.69.205:3006/api/posts/${postId}/comments`);
            const data = await response.json();
            setComments(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handlePostComment = async () => {
        if (!commentText.trim()) {
            Alert.alert('Error', 'Comment cannot be empty');
            return;
        }

        if (!currentUser || !currentUser.userID) {
            Alert.alert('Error', 'You must be logged in to comment');
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.userID, comment_text: commentText })
            });

            const result = await response.json();
            if (result.success) {
                setCommentText('');
                fetchComments(); // Refresh comments
            } else {
                Alert.alert('Error', 'Failed to post the comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#00f" />
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.commentID.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commentContainer}>
                            <Image source={{ uri: item.profile_picture }} style={styles.profilePicture} />
                            <View style={styles.commentTextContainer}>
                                <Text style={styles.userName}>{item.surname} {item.name}</Text>
                                <Text style={styles.commentText}>{item.comment_text}</Text>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Add Comment Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <Button title="Post" onPress={handlePostComment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
        marginTop: 50
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    commentTextContainer: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333'
    },
    commentText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 10
    }
});

export default CommentScreen;

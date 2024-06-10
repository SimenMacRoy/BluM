import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, Linking, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UserContext from './UserContext';
import config from '../config';

const RecipeTab = ({ route }) => {
    const { dish } = route.params;
    const { currentUser } = useContext(UserContext);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/ingredients`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setIngredients(data);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError(err.message);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/comment`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (err) {
                console.error('Failed to fetch comments:', err);
                setError(err.message);
            }
        };

        const fetchLikesDislikes = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/likes_dislikes?userID=${currentUser.userID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch likes/dislikes');
                }
                const data = await response.json();
                setLikes(data.likes);
                setDislikes(data.dislikes);
                setUserLiked(data.userLiked === 1);
                setUserDisliked(data.userDisliked === 1);
            } catch (err) {
                console.error('Failed to fetch likes/dislikes:', err);
                setError(err.message);
            }
        };

        fetchIngredients();
        fetchComments();
        fetchLikesDislikes();
        setLoading(false);
    }, [dish.id]);

    const handleAddComment = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: currentUser.userID,
                    comment_text: newComment,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const data = await response.json();
            setComments([...comments, data]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to add comment:', err);
            Alert.alert('Error', 'Failed to add comment');
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: currentUser.userID }),
            });
            const data = await response.json();
            if (data.success) {
                setLikes(data.likes);
                setUserLiked(true);
                setUserDisliked(false);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (err) {
            console.error('Failed to like:', err);
            Alert.alert('Error', 'Failed to like');
        }
    };

    const handleDislike = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: currentUser.userID }),
            });
            const data = await response.json();
            if (data.success) {
                setDislikes(data.dislikes);
                setUserLiked(false);
                setUserDisliked(true);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (err) {
            console.error('Failed to dislike:', err);
            Alert.alert('Error', 'Failed to dislike');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#15FCFC" />;
    }

    if (error) {
        return (
            <View>
                <Text style={{ color: 'red' }}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.tabContent}>
                {dish.portions && (
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Nombre de portions</Text>
                        <FontAwesome name="users" size={24} color="gold" />
                    </View>
                )}
                {dish.portions && <Text style={styles.portion}>{dish.portions} personnes</Text>}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Ingrédients</Text>
                    <FontAwesome name="shopping-basket" size={24} color="gold" />
                </View>
                {ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientRow}>
                        <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                        <View>
                            <Text style={styles.portion}>
                                {ingredient.title}
                            </Text>
                            <Text style={styles.portion}>
                                ({ingredient.quantity})
                            </Text>
                        </View>
                    </View>
                ))}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Recommandations</Text>
                    <FontAwesome name="pencil" size={24} color="gold" />
                </View>
                {dish.recommendations && <Text style={styles.portion}>{dish.recommendations}</Text>}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Vidéo</Text>
                    <FontAwesome name="video-camera" size={24} color="gold" />
                </View>
                {dish.video_url && (
                    <TouchableOpacity onPress={() => Linking.openURL(dish.video_url)}>
                        <Text style={[styles.portion, styles.videoUrl]}>{dish.video_url}</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.rowContainer}>
                    <Text style={styles.preparation}>Préparation</Text>
                    <FontAwesome name="clock-o" size={24} color="gold" />
                </View>
                {dish.preparation && <Text style={styles.portion}>{dish.preparation}</Text>}

                <View style={styles.commentSection}>
                    <Text style={styles.commentTitle}>Commentaires</Text>
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <Image source={{ uri: comment.profile_picture }} style={styles.commentProfilePicture} />
                            <View>
                                <Text style={styles.commentUser}>{comment.name} {comment.surname}</Text>
                                <Text style={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</Text>
                                <Text style={styles.commentText}>{comment.comment_text}</Text>
                            </View>
                        </View>
                    ))}
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Ajoutez un commentaire..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
                        <Text style={styles.addCommentButtonText}>Ajouter Commentaire</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.likeDislikeContainer}>
                    <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                        <FontAwesome name="thumbs-up" size={24} color={userLiked ? "green" : "gray"} />
                        <Text style={{ fontFamily: 'Ebrima', fontSize: 16, paddingLeft: 5}}>{likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDislike} style={styles.dislikeButton}>
                        <FontAwesome name="thumbs-down" size={24} color={userDisliked ? "red" : "gray"} />
                        <Text style={{ fontFamily: 'Ebrima', fontSize: 16, paddingLeft: 5}}>{dislikes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: "#15FCFC",
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
    },
    label: {
        marginRight: 10,
        fontSize: 20,
        fontFamily: 'Ebrimabd'
    },
    portion: {
        marginLeft: 10,
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Ebrima'
    },
    videoUrl: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    preparation: {
        marginRight: 10,
        fontSize: 20,
        fontFamily: 'Ebrimabd',
    },
    tabContent: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    ingredientImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    commentSection: {
        marginTop: 20,
    },
    commentTitle: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        marginBottom: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    commentProfilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentUser: {
        fontSize: 16,
        fontFamily: 'Ebrimabd',
    },
    commentDate: {
        fontSize: 12,
        fontFamily: 'Ebrima',
        color: 'gray',
    },
    commentText: {
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    commentInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        fontFamily: 'Ebrima',
    },
    addCommentButton: {
        backgroundColor: '#15FCFC',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    addCommentButtonText: {
        fontSize: 16,
        fontFamily: 'Ebrimabd',
        color: 'black',
    },
    likeDislikeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dislikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default RecipeTab;

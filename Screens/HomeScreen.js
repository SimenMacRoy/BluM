// HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import SearchBar from './SearchBar';
import FollowButton from './FollowButton';
import ShareButton from './ShareButton';
import { Video, ResizeMode } from 'expo-av';
import SearchResults from './SearchResults';
import UserContext from './UserContext';
import config from '../config';

const HomeScreen = ({ navigation }) => {
    const video = React.useRef(null);
    const [status, setStatus] = useState({});
    const { currentUser } = useContext(UserContext);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [starredPosts, setStarredPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/posts`); // Update with your backend URL
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLikePress = async (post) => {
        const liked = !likedPosts[post.postID];
        setLikedPosts((prev) => ({ ...prev, [post.postID]: liked }));

        try {
            const response = await fetch(`${config.apiBaseUrl}/posts/${post.postID}/toggle-like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ liked })
            });
            const data = await response.json();

            if (data.success) {
                setPosts((prevPosts) =>
                    prevPosts.map((p) => (p.postID === post.postID ? { ...p, blums: data.blums } : p))
                );
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleStarPress = async (post) => {
        const starred = !starredPosts[post.postID];
        setStarredPosts((prev) => ({ ...prev, [post.postID]: starred }));

        try {
            const response = await fetch(`${config.apiBaseUrl}/posts/${post.postID}/toggle-star`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ starred })
            });
            const data = await response.json();

            if (data.success) {
                setPosts((prevPosts) =>
                    prevPosts.map((p) => (p.postID === post.postID ? { ...p, stars: data.stars } : p))
                );
            }
        } catch (error) {
            console.error('Error toggling star:', error);
        }
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    const handleResultPress = (food) => {
        navigation.navigate('RecipeScreenDetail', { dishId: food.id });
    };

    const handleProfilePress = (post) => {
        if (currentUser && post.userID === currentUser.userID) {
            navigation.navigate('ProfileScreen'); // Navigate to own profile
        } else {
            // Directly pass the necessary user data
            navigation.navigate('UserScreen', { userData: {
                name: post.name,
                surname: post.surname,
                profile_picture: post.profile_picture,
                email: post.email,
                phone_number: post.phone_number,
                country_of_origin: post.country_of_origin,
                postal_address: post.postal_address,
                userID: post.userID 
            }});
        }
        
    };
    
    const handleCommentPress = (postId) => {
        navigation.navigate('CommentScreen', { postId });
    };

    const handleImagePress = (post) => {
        navigation.navigate('ImageScreen', { imageUrl: post.post_content, posterName: `${post.surname} ${post.name}` });
    };

    return (
        <View style={styles.container}>
            <Header />
            <SearchBar onSearch={handleSearch} onResultPress={handleResultPress} searchType={'foods'} />
            {loading ? (
                <ActivityIndicator size="large" color="#15FCFC" />
            ) : error ? (
                <Text style={{ color: 'red' }}>{error}</Text>
            ) : !isSearching ? (
                <ScrollView style={styles.scrollContent}>
                    {posts.map((post) => (
                        <View key={post.postID} style={styles.card}>
                            <TouchableOpacity
                                style={styles.cardHeader}
                                onPress={() => handleProfilePress(post)}>
                                <Image source={{ uri: post.profile_picture }} style={styles.profilePicture} />
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{post.surname} {post.name}</Text>
                                    <Text style={styles.time}>{new Date(post.date_created).toLocaleString()}</Text>
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <FollowButton blumerID={currentUser.userID} blumeeID={post.userID}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <ShareButton />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <Text style={styles.post}>{post.description}</Text>
                            <View style={styles.divider} />
                            {post.content_type === 'image' ? (
                                <TouchableOpacity onPress={() => handleImagePress(post)}>
                                    <Image source={{ uri: post.post_content || null }} style={styles.postImage} />
                                </TouchableOpacity>
                            ) : (
                                <Video
                                    ref={video}
                                    source={{ uri: post.post_content || null }}
                                    style={styles.postVideo}
                                    useNativeControls
                                    resizeMode={ResizeMode.COVER}
                                    isLooping
                                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                                />
                            )}
                            <View style={styles.iconsRow}>
                                <View style={styles.iconBox}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleLikePress(post)}>
                                        <FontAwesome name="thumbs-up" size={20} color={likedPosts[post.postID] ? 'red' : 'black'} />
                                    </TouchableOpacity>
                                    <Text style={styles.iconCount}>{post.blums}</Text>
                                </View>
                                <View style={styles.iconBox}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleStarPress(post)}>
                                        <FontAwesome name="star" size={20} color={starredPosts[post.postID] ? 'red' : 'black'} />
                                    </TouchableOpacity>
                                    <Text style={styles.iconCount}>{post.stars}</Text>
                                </View>
                                <View style={styles.iconBox}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleCommentPress(post.postID)}>
                                        <FontAwesome name="comment" size={20} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.iconCount}>{post.commentsCount}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: 'white'
    },
    scrollContent: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#15FCFC',
        borderTopStartRadius: 50,
        borderBottomRightRadius: 50,
        margin: 10,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    time: {
        color: 'gray',
    },
    button: {
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    postVideo: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    iconsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    iconBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'lightgray',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingRight: 10,
      },
    iconCount: {
        marginTop: 5,
        fontSize: 12,
        color: 'black',
    },
});

export default HomeScreen;

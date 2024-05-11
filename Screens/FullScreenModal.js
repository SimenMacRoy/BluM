// Importing necessary modules from React and React Native.
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Icons from Expo.
import { Video, ResizeMode } from 'expo-av'; // Video component and resize mode from expo-av.

// FullscreenModal component, used to display a post in fullscreen.
const FullscreenModal = ({ post, isVisible, onClose }) => {
    // Return null if no post data is provided.
    if (!post) return null;

    // State to manage whether the video is in fullscreen mode.
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

    // Function to toggle the video fullscreen state.
    const handleVideoPress = () => {
        setIsVideoFullscreen(!isVideoFullscreen);
    };

    // Choose the style based on whether the video is fullscreen.
    const videoStyle = isVideoFullscreen 
        ? styles.fullscreenVideo 
        : styles.fullscreenPostVideo;

    return (
        // Modal component to show the content in a modal view.
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.fullscreenContainer}>
                {/* Header section showing user information */}
                {post.user && (
                    <View style={styles.fullscreenHeader}>
                        <Text style={styles.userName2}>{post.user.name || 'Unknown User'}</Text>
                        <Text style={styles.postTime}>{post.time || 'Unknown Time'}</Text>
                    </View>
                )}

                {/* Close icon to exit fullscreen mode */}
                <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                    <AntDesign name="closecircle" size={24} color="white" />
                </TouchableOpacity>

                {/* Download icon (functionality not implemented in this snippet) */}
                <TouchableOpacity style={styles.downloadIcon}>
                    <FontAwesome name="download" size={24} color="white" />
                </TouchableOpacity>

                {/* Displaying the post content: image or video */}
                {post.postType === 'image' ? (
                    <Image source={post.postContent || null} style={styles.fullscreenPostImage} />
                ) : (
                    <TouchableOpacity onPress={handleVideoPress}>
                        <Video  
                            source={post.postContent || null}
                            style={videoStyle}
                            useNativeControls={true}
                            resizeMode={isVideoFullscreen ? ResizeMode.STRETCH : ResizeMode.CONTAIN}
                            isLooping
                        />
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
};

// StyleSheet to define the component styles.
const styles = StyleSheet.create({
    fullscreenHeader: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    userName2: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    postTime: {
        color: 'white',
        fontSize: 14,
    },
    closeIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    downloadIcon: {
        position: 'absolute',
        bottom: 40,
        right: 20,
    },
    fullscreenPostImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    fullscreenPostVideo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fullscreenVideo: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    }
});

export default FullscreenModal;

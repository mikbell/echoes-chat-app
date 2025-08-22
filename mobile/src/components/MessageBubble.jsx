import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageBubble = ({ 
  message, 
  isMyMessage, 
  showAvatar, 
  onImagePress,
  formatTimestamp 
}) => {
  const handleImagePress = () => {
    if (message.type === 'image' && message.content) {
      if (onImagePress) {
        onImagePress(message.content);
      } else {
        // Default: mostra anteprima immagine
        Alert.alert(
          'Immagine',
          'Anteprima immagine in sviluppo',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const renderImageContent = () => {
    const imageUri = message.content || message.imageData?.uri;
    const isUploading = message.imageData?.uploading;
    const uploadProgress = message.imageData?.progress || 0;

    return (
      <TouchableOpacity 
        onPress={handleImagePress}
        style={styles.imageContainer}
        disabled={isUploading}
      >
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.messageImage,
            isUploading && styles.imageUploading
          ]}
          resizeMode="cover"
        />
        
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.uploadProgress}>{uploadProgress}%</Text>
          </View>
        )}
        
        {!isUploading && (
          <View style={styles.imageOverlay}>
            <Ionicons name="expand" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTextContent = () => (
    <Text style={[
      styles.messageText,
      isMyMessage ? styles.myMessageText : styles.otherMessageText
    ]}>
      {message.content}
    </Text>
  );

  return (
    <View style={[
      styles.messageContainer,
      isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      {showAvatar && (
        <Image 
          source={{ uri: message.sender.avatar }} 
          style={styles.messageAvatar} 
        />
      )}
      
      <View style={[
        styles.messageBubble,
        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        !showAvatar && !isMyMessage && styles.messageWithoutAvatar,
        message.type === 'image' && styles.imageBubble
      ]}>
        {message.type === 'image' ? renderImageContent() : renderTextContent()}
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTimestamp(message.timestamp)}
          </Text>
          
          {isMyMessage && (
            <View style={styles.messageStatus}>
              {message.read ? (
                <Ionicons name="checkmark-done" size={14} color="#3b82f6" />
              ) : message.delivered ? (
                <Ionicons name="checkmark-done" size={14} color="#6b7280" />
              ) : (
                <Ionicons name="checkmark" size={14} color="#6b7280" />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
    paddingLeft: 50,
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
    paddingRight: 50,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  messageWithoutAvatar: {
    marginLeft: 40,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageBubble: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  myMessageBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#111827',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    width: 200,
    height: 150,
  },
  messageImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageUploading: {
    opacity: 0.7,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  uploadProgress: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
    paddingHorizontal: message => message?.type === 'image' ? 8 : 0,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#6b7280',
  },
  messageStatus: {
    marginLeft: 4,
  },
});

export default MessageBubble;

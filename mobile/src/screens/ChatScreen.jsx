import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import socketService from '../services/socketService';
import imageService from '../services/imageService';
import { showToast } from '../utils/toast';

const ChatScreen = ({ route, navigation }) => {
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthStore();
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Messaggi mock per lo sviluppo
  const mockMessages = [
    {
      _id: '1',
      content: 'Ciao! Come stai? 👋',
      sender: {
        _id: 'other_user',
        fullName: 'Marco Rossi',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      delivered: true,
      read: true,
    },
    {
      _id: '2',
      content: 'Tutto bene, grazie! Tu come stai?',
      sender: {
        _id: authUser?._id || 'current_user',
        fullName: authUser?.fullName || 'Tu',
        avatar: authUser?.avatar || 'https://i.pravatar.cc/150?img=5',
      },
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      delivered: true,
      read: true,
    },
    {
      _id: '3',
      content: 'Benissimo! Hai visto il nuovo aggiornamento dell\'app? 🚀',
      sender: {
        _id: 'other_user',
        fullName: 'Marco Rossi',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      delivered: true,
      read: false,
    },
  ];

  useEffect(() => {
    loadMessages();
    setupSocketListeners();
    socketService.joinChat(chatId);

    return () => {
      socketService.leaveChat(chatId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Simuliamo caricamento messaggi
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
        scrollToBottom();
      }, 500);
      
      // TODO: Implementare chiamata API reale
      // const response = await api.get(`/chats/${chatId}/messages`);
      // setMessages(response.data.messages);
    } catch (error) {
      console.error('Errore caricamento messaggi:', error);
      showToast('Errore nel caricamento dei messaggi');
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listener per nuovi messaggi
    const removeMessageListener = socketService.addListener('messageReceived', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listener per typing indicators
    const removeTypingListener = socketService.addListener('userTyping', (data) => {
      if (data.chatId === chatId && data.userId !== authUser?._id) {
        setTypingUsers(prev => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      }
    });

    const removeStopTypingListener = socketService.addListener('userStoppedTyping', (data) => {
      if (data.chatId === chatId) {
        setTypingUsers(prev => prev.filter(userId => userId !== data.userId));
      }
    });

    // Cleanup listeners on unmount
    return () => {
      removeMessageListener();
      removeTypingListener();
      removeStopTypingListener();
    };
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const messageData = {
      _id: Date.now().toString(),
      content: inputText.trim(),
      sender: authUser,
      timestamp: new Date().toISOString(),
      delivered: false,
      read: false,
    };

    // Aggiungi immediatamente il messaggio alla UI
    setMessages(prev => [...prev, messageData]);
    setInputText('');
    scrollToBottom();

    // Invia tramite Socket.io
    socketService.sendMessage(chatId, inputText.trim());

    // Stop typing
    if (isTyping) {
      socketService.stopTyping(chatId);
      setIsTyping(false);
    }
  };

  const handleInputChange = (text) => {
    setInputText(text);

    // Gestione typing indicators
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socketService.startTyping(chatId);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketService.stopTyping(chatId);
      }
    }, 2000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Gestione selezione e invio immagini
  const handleImagePicker = async () => {
    try {
      const imageData = await imageService.pickImage();
      if (imageData) {
        await sendImageMessage(imageData);
      }
    } catch (error) {
      console.error('Errore selezione immagine:', error);
      showToast('Errore nella selezione dell\'immagine');
    }
  };

  // Invia messaggio immagine
  const sendImageMessage = async (imageData) => {
    try {
      // Crea messaggio temporaneo con anteprima
      const tempMessage = {
        _id: `temp_${Date.now()}`,
        content: '',
        type: 'image',
        imageData: {
          uri: imageData.uri,
          uploading: true,
          progress: 0,
        },
        sender: authUser,
        timestamp: new Date().toISOString(),
        delivered: false,
        read: false,
      };

      // Aggiungi messaggio temporaneo alla UI
      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();

      // Upload immagine
      const uploadResult = await imageService.uploadImage(imageData, (progress) => {
        // Aggiorna progress nell'UI
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempMessage._id 
              ? { ...msg, imageData: { ...msg.imageData, progress } }
              : msg
          )
        );
      });

      if (uploadResult.success) {
        // Aggiorna messaggio con URL finale
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempMessage._id
              ? {
                  ...msg,
                  content: uploadResult.imageUrl,
                  imageData: {
                    uri: uploadResult.imageUrl,
                    uploading: false,
                    progress: 100,
                  },
                  delivered: true,
                }
              : msg
          )
        );

        // Invia tramite Socket.io
        socketService.sendMessage(chatId, uploadResult.imageUrl, 'image');
      } else {
        // Rimuovi messaggio se upload fallisce
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        showToast(uploadResult.error || 'Errore nell\'invio dell\'immagine');
      }
    } catch (error) {
      console.error('Errore invio immagine:', error);
      showToast('Errore nell\'invio dell\'immagine');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMyMessage = item.sender._id === authUser?._id;
    const isLastMessage = index === messages.length - 1;
    const showAvatar = !isMyMessage && (index === 0 || messages[index - 1]?.sender._id !== item.sender._id);

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {showAvatar && (
          <Image source={{ uri: item.sender.avatar }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          !showAvatar && !isMyMessage && styles.messageWithoutAvatar
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {formatTimestamp(item.timestamp)}
            </Text>
            
            {isMyMessage && (
              <View style={styles.messageStatus}>
                {item.read ? (
                  <Ionicons name="checkmark-done" size={14} color="#3b82f6" />
                ) : item.delivered ? (
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

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>sta scrivendo...</Text>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      {/* Header */}
      <LinearGradient colors={['#1f2937', '#374151']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {socketService.isConnected() ? 'Online' : 'Connessione...'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Messaggi */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
        />
        {renderTypingIndicator()}
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleImagePicker}
          >
            <Ionicons name="image" size={20} color="#6b7280" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length > 0 ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim().length > 0 ? '#fff' : '#9ca3af'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#d1d5db',
    marginTop: 2,
  },
  headerAction: {
    padding: 4,
    marginLeft: 12,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
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
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
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
  typingContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginLeft: 40,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typingText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6b7280',
    marginHorizontal: 1,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 4 : 0,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sendButtonInactive: {
    backgroundColor: '#f3f4f6',
  },
});

export default ChatScreen;

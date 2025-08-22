import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../utils/toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Connessione al server Socket.io
  async connect(userId) {
    if (this.socket?.connected) {
      console.log('Socket già connesso');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token non trovato');
        return;
      }

      // URL del server - modifica secondo il tuo setup
      const SERVER_URL = __DEV__ 
        ? 'http://192.168.1.95:5000' 
        : 'https://your-production-url.com';

      console.log('Connessione al server Socket.io...', SERVER_URL);

      this.socket = io(SERVER_URL, {
        auth: {
          token: token.replace('Bearer ', ''),
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
      this.setupReconnection();
      
    } catch (error) {
      console.error('Errore connessione Socket.io:', error);
      showToast('Errore di connessione al server');
    }
  }

  // Configurazione eventi base
  setupEventListeners() {
    if (!this.socket) return;

    // Eventi di connessione
    this.socket.on('connect', () => {
      console.log('✅ Connesso al server Socket.io:', this.socket.id);
      this.emit('userOnline');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnesso da Socket.io:', reason);
      if (reason === 'io server disconnect') {
        // Il server ha chiuso la connessione, riconnettersi manualmente
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Errore connessione Socket.io:', error);
      showToast('Errore di connessione');
    });

    // Eventi personalizzati dell'app
    this.socket.on('messageReceived', (message) => {
      console.log('💬 Nuovo messaggio ricevuto:', message);
      this.notifyListeners('messageReceived', message);
    });

    this.socket.on('userTyping', (data) => {
      console.log('⌨️ Utente sta scrivendo:', data);
      this.notifyListeners('userTyping', data);
    });

    this.socket.on('userStoppedTyping', (data) => {
      console.log('⏹️ Utente ha smesso di scrivere:', data);
      this.notifyListeners('userStoppedTyping', data);
    });

    this.socket.on('userOnline', (userId) => {
      console.log('🟢 Utente online:', userId);
      this.notifyListeners('userOnline', userId);
    });

    this.socket.on('userOffline', (userId) => {
      console.log('⚫ Utente offline:', userId);
      this.notifyListeners('userOffline', userId);
    });

    this.socket.on('messageDelivered', (messageId) => {
      console.log('✅ Messaggio consegnato:', messageId);
      this.notifyListeners('messageDelivered', messageId);
    });

    this.socket.on('messageRead', (messageId) => {
      console.log('👁️ Messaggio letto:', messageId);
      this.notifyListeners('messageRead', messageId);
    });
  }

  // Gestione riconnessione automatica
  setupReconnection() {
    if (!this.socket) return;

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Riconnesso dopo', attemptNumber, 'tentativi');
      showToast('Connessione ripristinata');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Tentativo di riconnessione', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Errore riconnessione:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Riconnessione fallita');
      showToast('Impossibile riconnettersi al server');
    });
  }

  // Invio eventi al server
  emit(event, data = {}) {
    if (this.socket?.connected) {
      console.log('📤 Invio evento:', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket non connesso, evento non inviato:', event);
    }
  }

  // Invio messaggio
  sendMessage(chatId, message, messageType = 'text') {
    const messageData = {
      chatId,
      content: message,
      type: messageType,
      timestamp: new Date().toISOString(),
    };
    
    this.emit('sendMessage', messageData);
    return messageData;
  }

  // Inizio scrittura
  startTyping(chatId) {
    this.emit('typing', { chatId });
  }

  // Fine scrittura
  stopTyping(chatId) {
    this.emit('stopTyping', { chatId });
  }

  // Partecipa a una chat
  joinChat(chatId) {
    this.emit('joinChat', { chatId });
  }

  // Lascia una chat
  leaveChat(chatId) {
    this.emit('leaveChat', { chatId });
  }

  // Segna messaggio come letto
  markAsRead(messageId) {
    this.emit('markAsRead', { messageId });
  }

  // Sistema di listeners per componenti React
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Ritorna una funzione per rimuovere il listener
    return () => {
      this.removeListener(event, callback);
    };
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Errore nel listener:', error);
        }
      });
    }
  }

  // Verifica stato connessione
  isConnected() {
    return this.socket?.connected || false;
  }

  // Disconnessione
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnessione Socket.io...');
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Cleanup per cambio utente
  cleanup() {
    this.disconnect();
  }
}

// Istanza singleton
const socketService = new SocketService();

export default socketService;

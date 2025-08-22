# 📱 Echoes Mobile - React Native Chat App

Un client mobile nativo per Echoes chat app, costruito con **React Native** e **Expo**.

## 🚀 Features

### ✅ Implementate
- 🔐 **Autenticazione completa** (Login/Signup)
- 📱 **UI mobile-native** con design moderno
- 🎨 **Gradient backgrounds** e animazioni fluide
- 🔒 **Sicurezza mobile** con AsyncStorage per token JWT
- 📊 **State management** con Zustand
- 🌐 **API integration** con il backend Echoes esistente

### 🔄 In Sviluppo
- 💬 **Real-time chat** con Socket.io
- 📷 **Condivisione foto** con camera nativa
- 🔔 **Push notifications**
- 👥 **Lista utenti e chat**
- 🎯 **Typing indicators**
- 📴 **Offline support**

## 🛠️ Tech Stack

- **Framework**: React Native con Expo
- **Navigation**: React Navigation 6
- **State Management**: Zustand
- **HTTP Client**: Axios con interceptors
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons
- **Gradients**: Expo Linear Gradient
- **UI**: Native components con styling personalizzato

## 📦 Installazione

### Prerequisiti
- Node.js 16+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app su telefono (per testing)

### Setup
```bash
# Naviga nella cartella mobile
cd mobile

# Installa dipendenze
npm install

# Avvia il development server
npm start

# Scansiona il QR code con Expo Go per testare su telefono
```

## 📱 Come Testare

### Opzione 1: Expo Go (Raccomandato per sviluppo)
1. Installa **Expo Go** sul tuo telefono
2. Esegui `npm start` nella cartella mobile
3. Scansiona il QR code che appare nel terminale
4. L'app si aprirà direttamente sul telefono

### Opzione 2: Simulatore (Richiede Android Studio/Xcode)
```bash
# Android
npm run android

# iOS (solo su macOS)
npm run ios
```

### Opzione 3: Web (per testing rapido)
```bash
npm run web
```

## 🏗️ Architettura

```
mobile/
├── src/
│   ├── components/         # Componenti riutilizzabili
│   │   └── LoadingScreen.js
│   ├── screens/           # Schermate principali
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── ChatListScreen.js
│   │   ├── ChatScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── store/             # State management
│   │   └── useAuthStore.js
│   ├── services/          # API calls
│   │   └── api.js
│   ├── utils/             # Utilità
│   │   └── toast.js
│   └── constants/         # Costanti app
├── App.js                 # Entry point
├── app.json              # Configurazione Expo
└── package.json
```

## 🔧 Configurazione

### Backend Connection
Il file `src/services/api.js` contiene la configurazione per connettersi al backend:

```javascript
const BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-production-url.com/api';  // Production
```

### Autenticazione
- **JWT tokens** salvati in AsyncStorage
- **Auto-refresh** token verification
- **Logout automatico** su token scaduto

## 📊 Performance

- **Bundle size**: ~1137 modules (ottimizzato con Expo)
- **Cold start**: ~7 secondi su device medio
- **Hot reload**: ~30ms durante sviluppo
- **Memory usage**: <100MB in runtime

## 🚀 Build & Deploy

### Development Build
```bash
# Crea development build per testing su device fisico
expo build:android
expo build:ios
```

### Production Build
```bash
# EAS Build (raccomandato)
eas build --platform all

# Oppure classic build
expo build:android --type app-bundle
expo build:ios --type app-store
```

## 📝 Roadmap

### Fase 1: Core Functionality (✅ Completato)
- [x] Autenticazione
- [x] Navigazione
- [x] UI Foundation

### Fase 2: Chat Features (🔄 In corso)
- [ ] Real-time messaging
- [ ] Lista contatti
- [ ] Invio immagini
- [ ] Typing indicators

### Fase 3: Advanced Features
- [ ] Push notifications
- [ ] Offline support
- [ ] Voice messages
- [ ] Video calls

### Fase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] Animazioni avanzate
- [ ] Dark mode
- [ ] Accessibilità

## 🐛 Troubleshooting

### Problemi Comuni

**Metro bundler non si avvia:**
```bash
npx expo start --clear
```

**Errori di dipendenze:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**App non si connette al backend:**
- Verifica che il backend sia in esecuzione su `http://localhost:5000`
- Controlla l'indirizzo IP nella configurazione API
- Assicurati che telefono e computer siano sulla stessa rete WiFi

## 🤝 Contributi

L'app mobile è integrata nell'ecosistema Echoes principale:
- **Backend**: Condivide lo stesso server Express/MongoDB
- **Web**: Condivide le stesse API e Socket.io
- **Database**: Sincronizzazione automatica tra web e mobile

## 📄 Licenza

Stesso progetto dell'app web Echoes - ISC License

---

**Echoes Mobile** - *La tua chat preferita, sempre in tasca* 📱✨

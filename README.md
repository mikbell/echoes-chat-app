# 💬 Echoes - Real-Time Chat Application

Una moderna applicazione di chat in tempo reale costruita con lo stack MERN (MongoDB, Express.js, React, Node.js) e Socket.io.

## ✨ Caratteristiche

### 🔐 Sicurezza & Autenticazione
- **JWT sicuro** con cookie httpOnly e sameSite
- **Password crittografate** con bcrypt (salt rounds 12)
- **Rate limiting** avanzato per prevenire abusi
- **Validazione input** rigorosa con Joi schema

### 💬 Chat Features  
- **Messaggi in tempo reale** con Socket.io
- **Indicatori di typing** e stato online
- **Condivisione immagini** ottimizzate con Cloudinary
- **Cronologia messaggi** persistente

### 🎨 UI/UX Moderna
- **Design responsive** mobile-first
- **Animazioni fluide** con Framer Motion
- **Temi multipli** (Light, Dark, Coffee, Emerald, Synthwave)
- **Internazionalizzazione** (🇺🇸 🇮🇹 🇪🇸 🇫🇷)
- **Loading states** animati
- **Micro-interazioni** coinvolgenti

### 📱 Mobile Experience
- **Menu mobile** con drawer animato
- **Touch-friendly** controls
- **Gesture support** per navigazione
- **PWA-ready** (Progressive Web App)

## 🔒 Sicurezza e Performance

### Miglioramenti di Sicurezza
- ✅ **Validazione input** con Joi schema validation
- ✅ **Rate limiting** per prevenire abusi:
  - Auth endpoints: 5 richieste per 15 minuti
  - Upload file: 10 upload per ora  
  - Messaggi: 50 messaggi per minuto
  - API generali: 100 richieste per 15 minuti
- ✅ **Password sicure** con salt rounds aumentati
- ✅ **Gestione errori** centralizzata e sicura
- ✅ **Logging sicuro** senza informazioni sensibili in produzione

### Miglioramenti delle Performance  
- ✅ **Ottimizzazione immagini** con trasformazioni Cloudinary
- ✅ **Logging condizionale** solo in development
- ✅ **Gestione memoria** migliorata per socket connections
- ✅ **Costanti centralizzate** per migliore manutenibilità

## 🚀 Setup

### Prerequisiti
- Node.js (v16 o superiore)
- MongoDB
- Account Cloudinary (per upload immagini)

### Installazione

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd echoes
   ```

2. **Installa le dipendenze**
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies  
   npm install --prefix backend
   
   # Frontend dependencies
   npm install --prefix frontend
   ```

3. **Configura le variabili d'ambiente**

   Crea un file `.env` nella cartella `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Avvia l'applicazione**
   ```bash
   # Development (entrambi frontend e backend)
   npm run build && npm start
   
   # Solo backend
   npm run start --prefix backend
   
   # Solo frontend  
   npm run dev --prefix frontend
   ```

## 📁 Struttura del Progetto

```
echoes/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logica business
│   │   ├── middleware/      # Rate limiting, auth, validation
│   │   ├── models/          # Schema MongoDB
│   │   ├── routes/          # API endpoints
│   │   ├── lib/            # Utilità (DB, Socket, Cloudinary)
│   │   ├── utils/          # Validazione, logging
│   │   ├── constants/      # Costanti applicazione
│   │   └── index.js        # Entry point server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componenti React riutilizzabili
│   │   ├── pages/         # Pagine principali
│   │   ├── store/         # State management (Zustand)
│   │   ├── lib/          # Utilità frontend
│   │   └── main.jsx      # Entry point React
│   └── package.json
└── package.json
```

## 🔧 Scripts Disponibili

### Root Level
- `npm run build` - Build dell'intera applicazione
- `npm start` - Avvia il server di produzione

### Backend  
- `npm run dev --prefix backend` - Server di sviluppo con nodemon
- `npm run start --prefix backend` - Server di produzione

### Frontend
- `npm run dev --prefix frontend` - Server di sviluppo Vite
- `npm run build --prefix frontend` - Build di produzione
- `npm run preview --prefix frontend` - Preview build di produzione

## 🛡️ Validazione API

L'app include validazione robusta per tutti gli input:

### Registrazione
- **Nome completo**: 2-50 caratteri, trim automatico
- **Email**: formato email valido, case-insensitive
- **Password**: minimo 6 caratteri, deve contenere maiuscola, minuscola e numero

### Login  
- **Email**: formato email valido
- **Password**: obbligatoria

### Messaggi
- **Testo**: massimo 1000 caratteri  
- **Immagine**: formato valido (almeno uno tra testo e immagine richiesto)

## 📊 Rate Limiting

| Endpoint | Limite | Finestra temporale |
|----------|--------|-------------------|
| Auth (login/signup) | 5 richieste | 15 minuti |
| Upload file | 10 richieste | 1 ora |  
| Invio messaggi | 50 richieste | 1 minuto |
| API generali | 100 richieste | 15 minuti |

*I rate limit sono disabilitati in modalità development*

## 🔧 Tecnologie Utilizzate

### Backend
- **Node.js** & **Express.js** - Server e API
- **MongoDB** & **Mongoose** - Database
- **Socket.io** - Comunicazione real-time
- **JWT** - Autenticazione
- **bcryptjs** - Hashing password  
- **Joi** - Validazione input
- **express-rate-limit** - Rate limiting
- **Cloudinary** - Gestione immagini

### Frontend  
- **React 18** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** & **DaisyUI** - Styling
- **Zustand** - State management
- **Socket.io-client** - Real-time client
- **React Hot Toast** - Notifiche
- **Axios** - HTTP client
- **React Router** - Routing

## 🚀 Deploy

### Deploy su Render.com (Consigliato)

Questo progetto è configurato per un deploy automatico su Render usando il file `render.yaml`.

#### Setup automatico:
1. **Connetti il repository** a Render.com
2. **Seleziona "Blueprint"** e Render leggerà automaticamente `render.yaml`
3. **Configura le variabili d'ambiente** nel dashboard Render:

   **Variabili obbligatorie:**
   - `MONGODB_URI` - La tua connection string MongoDB
   - `CLOUDINARY_CLOUD_NAME` - Nome del tuo cloud Cloudinary
   - `CLOUDINARY_API_KEY` - API key Cloudinary
   - `CLOUDINARY_API_SECRET` - API secret Cloudinary
   
   **Variabili generate automaticamente:**
   - `JWT_SECRET` - Generato automaticamente da Render
   - `FRONTEND_URL` - URL del frontend collegato automaticamente

4. **Deploy automatico** - Render builderà e deploierà entrambi i servizi

#### Setup manuale:
Se preferisci il setup manuale:

**1. Backend (Web Service):**
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Node.js
- Plan: Free

**2. Frontend (Static Site):**
- Build Command: `npm run build`
- Publish Directory: `./frontend/dist`
- Environment: Static Site

#### Database MongoDB:
Utilizza MongoDB Atlas (gratuito) o un'altra istanza MongoDB cloud:
1. Crea un cluster su [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Ottieni la connection string
3. Aggiungila come `MONGODB_URI` nelle variabili d'ambiente Render

#### Configurazione Cloudinary:
1. Crea un account gratuito su [Cloudinary](https://cloudinary.com/)
2. Vai nel Dashboard per ottenere:
   - Cloud Name
   - API Key  
   - API Secret
3. Aggiungili nelle variabili d'ambiente Render

#### Verifica Deploy:
Dopo il deploy, verifica che:
- ✅ Backend risponda su `/api/auth/me`
- ✅ Frontend sia servito correttamente
- ✅ Socket.io funzioni per messaggi real-time
- ✅ Upload immagini funzioni con Cloudinary

### Preparazione per produzione (generale)
1. Imposta `NODE_ENV=production`
2. Configura le variabili d'ambiente di produzione  
3. Build del frontend: `npm run build --prefix frontend`
4. Il server Express serve automaticamente i file statici del frontend

### Considerazioni di sicurezza per produzione
- ✅ Rate limiting attivo
- ✅ Cookie sicuri (HTTPS)
- ✅ Logging ridotto senza dati sensibili
- ✅ Validazione input rigorosa
- ✅ Headers di sicurezza CORS configurati
- ✅ CORS configurato per domini di produzione
- ✅ Variabili d'ambiente sicure

## 🤝 Contributi

I contributi sono benvenuti! Per favore:
1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)  
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto la licenza ISC. Vedi il file `LICENSE` per i dettagli.

## 📧 Supporto

Per supporto o domande, apri un issue su GitHub o contatta il maintainer.

---

**Echoes** - *Dove ogni messaggio trova la sua eco* 💬✨

# 🚀 Guida al Deploy su Vercel - Echoes Chat App

Questa guida ti accompagna step-by-step nel deploy della tua applicazione MERN Stack su Vercel.

## 📋 Prerequisiti

- Account Vercel (gratuito)
- MongoDB Atlas database (gratuito)
- Account Cloudinary (per upload immagini)
- Repository GitHub con il codice dell'app

## 🔧 Preparazione

### 1. Setup Database MongoDB Atlas

1. Vai su [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Configura l'accesso (whitelist IP: 0.0.0.0/0 per Vercel)
4. Ottieni la connection string

### 2. Setup Cloudinary

1. Registrati su [Cloudinary](https://cloudinary.com/)
2. Vai nel Dashboard e ottieni:
   - Cloud Name
   - API Key
   - API Secret

### 3. Genera JWT Secret

```bash
# Usa OpenSSL per generare una chiave sicura
openssl rand -base64 32
```

## 🌐 Deploy su Vercel

### Passo 1: Connetti Repository

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Clicca "New Project"
3. Importa il tuo repository GitHub
4. Seleziona la cartella root del progetto

### Passo 2: Configurazione Build

Vercel dovrebbe rilevare automaticamente la configurazione dal file `vercel.json`. 

**Configurazioni Build:**
- **Framework**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Passo 3: Variabili d'Ambiente

Nel Vercel Dashboard, vai su **Settings** → **Environment Variables** e aggiungi:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echoes?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-generated-secret-from-openssl

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Configuration
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app

# Socket.IO Configuration
SOCKET_IO_TRANSPORTS=websocket,polling
SOCKET_IO_CORS_ORIGIN=https://your-app-name.vercel.app
```

### Passo 4: Deploy

1. Clicca **Deploy**
2. Attendi il completamento del build
3. Testa l'applicazione usando l'URL fornito da Vercel

## 🔧 Post-Deploy Configuration

### 1. Aggiorna le URL nel codice

Sostituisci `your-app-name.vercel.app` con il tuo URL effettivo in:

- `.env.production.example`
- `frontend/vite.config.js` (nelle configurazioni proxy)

### 2. Test delle Funzionalità

Verifica che funzionino:
- ✅ Login/Registrazione
- ✅ Invio messaggi
- ✅ Ricezione messaggi in tempo reale (Socket.IO)
- ✅ Upload immagini
- ✅ Cambio lingua
- ✅ Tema scuro/chiaro

## 🐛 Troubleshooting

### Problema: Socket.IO non funziona

**Soluzione:**
```javascript
// Nel frontend, assicurati che la connessione Socket.IO punti al dominio corretto
const socket = io(window.location.origin, {
  transports: ['websocket', 'polling']
});
```

### Problema: CORS Errors

**Verifica:**
1. Le variabili d'ambiente `FRONTEND_URL` e `VERCEL_URL` sono configurate
2. Gli URL sono corretti (con https://)
3. Non ci sono caratteri extra o spazi negli URL

### Problema: 500 Internal Server Error

**Verifica:**
1. Tutte le variabili d'ambiente sono settate
2. La connection string MongoDB è corretta
3. I secrets Cloudinary sono validi
4. Controlla i logs Vercel per dettagli

### Problema: Build Fails

**Possibili cause:**
1. Dipendenze mancanti
2. Errori di sintassi
3. Path non corretti nel vercel.json

## 📊 Monitoraggio

### Vercel Analytics

1. Abilita Analytics nel dashboard Vercel
2. Monitora performance e errori

### Logs

```bash
# Visualizza logs in tempo reale
vercel logs your-app-name
```

## 🔄 Aggiornamenti

Per aggiornare l'app:

1. Push le modifiche su GitHub
2. Vercel rebuilda automaticamente
3. Verifica che tutto funzioni correttamente

## 📚 Risorse Utili

- [Vercel Documentation](https://vercel.com/docs)
- [Socket.IO with Vercel](https://socket.io/docs/v4/how-to/deploy-on-vercel/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## ⚠️ Note Importanti

1. **Limiti Vercel Free:**
   - 100GB bandwidth/mese
   - Timeout funzioni: 10s
   - 12 deploy/giorno

2. **Socket.IO Considerations:**
   - Vercel Serverless può avere limitazioni con WebSockets
   - Usa sempre fallback su polling
   - Considera alternative come Vercel Edge Functions per performance migliori

3. **Database:**
   - Usa sempre MongoDB Atlas per produzione
   - Configura backup automatici
   - Monitora l'utilizzo per evitare costi imprevisti

## 🎉 Congratulazioni!

La tua app Echoes è ora live su Vercel! 

**URL App:** `https://your-app-name.vercel.app`

---

*Per supporto, consulta i logs Vercel o apri una issue su GitHub.*

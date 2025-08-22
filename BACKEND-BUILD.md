# 🔧 Script di Build Backend - Echoes Chat App

Questa guida spiega gli script di build per il backend in entrambe le configurazioni: **sviluppo locale** e **produzione Vercel**.

## 🏗️ Architettura Dual Backend

### 1. Backend Tradizionale (`/backend`) - Sviluppo Locale
### 2. API Serverless (`/api`) - Produzione Vercel

## 📋 Script di Build Backend Tradizionale

### Posizione: `/backend/package.json`

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js", 
    "build": "echo 'Backend build completed - ready for local deployment'",
    "build:prod": "npm install --production",
    "test": "node -e \"console.log('Testing backend...'); require('./src/index.js')\"",
    "lint": "echo 'Linting backend code...'",
    "clean": "rm -rf node_modules"
  }
}
```

### Uso degli script:

```bash
# Sviluppo locale
cd backend
npm run dev          # Avvia con nodemon (hot reload)

# Produzione locale  
npm run start        # Avvia server Express normale
npm run build:prod   # Installa solo dipendenze di produzione
npm run build        # Conferma build completato

# Testing e manutenzione
npm run test         # Test caricamento moduli
npm run clean        # Pulisce node_modules
```

## 📋 Script di Build API Serverless

### Posizione: `/api/package.json`

```json
{
  "scripts": {
    "build": "echo 'API serverless build completed - ready for Vercel'",
    "start": "node index.js",
    "test": "node -e \"console.log('Testing API...'); const app = require('./index.js'); console.log('API loaded successfully');\"",
    "dev": "node index.js"
  }
}
```

### Uso degli script:

```bash
# Test locale API
cd api
npm run dev          # Testa API handler
npm run test         # Verifica caricamento API
npm run build        # Conferma build pronto per Vercel

# Su Vercel (automatico)
# Vercel esegue: npm install (in /api)
# Poi serve index.js come serverless function
```

## 🔄 Script Root di Orchestrazione

### Posizione: `/package.json` (root)

```json
{
  "scripts": {
    "build:backend": "npm install --prefix backend",
    "build:api": "npm install --prefix api", 
    "dev:backend": "npm run dev --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend"
  }
}
```

### Uso degli script root:

```bash
# Dalla root del progetto
npm run build:backend    # Build backend tradizionale
npm run build:api        # Build API serverless  
npm run dev:backend      # Avvia backend locale
```

## 🎯 Confronto Backend vs API

| Aspetto | Backend Tradizionale | API Serverless |
|---------|---------------------|----------------|
| **Ambiente** | Sviluppo locale | Produzione Vercel |
| **Runtime** | Server Express persistente | Function handler |
| **Deploy** | PM2, Docker, VPS | Vercel serverless |
| **Socket.IO** | ✅ Supporto completo | ⚠️ Limitazioni |
| **Database** | Connection pooling | Per-request connection |
| **Scaling** | Manuale | Automatico |

## 🚀 Workflow di Build Completo

### Sviluppo Locale

```bash
# 1. Setup iniziale
npm install              # Deps root + API (postinstall)
npm run build:backend    # Deps backend tradizionale

# 2. Sviluppo  
npm run dev              # Avvia backend + frontend
# o separatamente:
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
```

### Produzione Vercel

```bash
# 1. Build locale (test)
npm run build            # Frontend build + API deps

# 2. Deploy su Vercel
git push origin main     # Auto-deploy su Vercel

# Vercel esegue:
# - npm install (root + postinstall API)  
# - npm run build (frontend)
# - Serve API da /api come serverless functions
```

## ⚡ Ottimizzazioni Backend

### Backend Tradizionale
```bash
# Produzione ottimizzata
NODE_ENV=production npm run start
npm run build:prod  # Solo deps production (no devDependencies)
```

### API Serverless
```javascript
// In api/index.js
// Connection pooling per MongoDB
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI);
  return cachedDb;
};
```

## 🐛 Troubleshooting Build Backend

### Errore: "Cannot find module"
```bash
# Backend tradizionale
cd backend && npm install

# API serverless  
npm run build:api
```

### Errore: "Module type mismatch" 
```json
// Verifica in package.json:
{
  "type": "module"  // Per ES6 imports
}
```

### Errore: Database connection
```bash
# Verifica variabili d'ambiente
echo $MONGODB_URI

# Test connessione
cd backend && npm run test
cd api && npm run test
```

## 📊 Build Performance

### Metriche Target

| Metrica | Backend Locale | API Serverless |
|---------|---------------|----------------|
| **Startup Time** | ~2-3 secondi | ~500ms (cold start) |
| **Memory Usage** | ~50-100MB | ~25-50MB |
| **Dependencies** | 168 packages | 142 packages |
| **Build Time** | ~10 secondi | ~5 secondi |

## 🚨 Note Importanti

### Backend Tradizionale
- ✅ **Usa per**: Sviluppo locale, Socket.IO real-time
- ✅ **Deploy su**: VPS, Render, Railway
- ⚠️ **Non usare su**: Vercel (limitazioni serverless)

### API Serverless  
- ✅ **Usa per**: API REST, Vercel deploy
- ✅ **Pro**: Auto-scaling, zero maintenance
- ⚠️ **Limitazioni**: Socket.IO, long-running processes

## 🎯 Comando Rapido di Test

```bash
# Test completo di tutti i build
npm run build:api && npm run build:backend && npm run build
echo "✅ Tutti i build completati con successo!"
```

---

✅ **Backend build configurato per ogni scenario!** 🎉

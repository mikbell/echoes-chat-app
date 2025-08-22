# 🔧 Script di Build per Vercel - Echoes Chat App

Questa guida spiega gli script di build configurati per il deployment su Vercel.

## 📋 Script Principali

### Script di Build per Vercel

```json
{
  "build": "npm run build:frontend",
  "build:frontend": "npm install --prefix frontend && npm run build --prefix frontend",
  "build:api": "npm install --prefix api", 
  "build:backend": "npm install --prefix backend",
  "vercel-build": "npm run build:frontend"
}
```

### Script di Sviluppo

```json
{
  "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
  "dev:frontend": "npm run dev --prefix frontend",
  "dev:backend": "npm run dev --prefix backend"
}
```

### Script di Utility

```json
{
  "install:all": "npm install && npm run build:api && npm run build:backend && npm run build:frontend",
  "postinstall": "npm run build:api",
  "test:build": "npm run build && echo Build completed successfully"
}
```

## 🚀 Come Vercel Usa Questi Script

### Durante il Deploy

1. **Install Command**: `npm install`
   - Installa dipendenze root
   - Esegue `postinstall` → `npm run build:api`
   - Installa dipendenze API per serverless functions

2. **Build Command**: `npm run build` (definito in vercel.json)
   - Esegue `npm run build:frontend`
   - Installa dipendenze frontend
   - Builda il frontend React con Vite
   - Genera `frontend/dist/`

3. **Output Directory**: `frontend/dist` 
   - Vercel serve i file statici da questa directory

### Serverless Functions

- **Directory**: `/api`
- **Runtime**: Node.js 18.x
- **Dependencies**: Installate automaticamente da `api/package.json`

## 🎯 Struttura Build

```
echoes/
├── package.json (root - orchestrazione)
├── api/
│   ├── package.json (dipendenze serverless)
│   └── index.js (handler API)
├── frontend/
│   ├── package.json (dipendenze React)
│   ├── dist/ (output build)
│   └── vite.config.js
├── backend/
│   └── package.json (per sviluppo locale)
└── vercel.json (configurazione deploy)
```

## 🔄 Workflow di Build

### Locale (Sviluppo)
```bash
npm install          # Installa deps root + API
npm run dev          # Avvia backend + frontend
```

### Locale (Test Build)
```bash
npm run test:build   # Testa il build completo
```

### Vercel (Produzione)
```bash
npm install          # Root deps + postinstall (API deps)
npm run build        # Frontend build
# Vercel automaticamente rileva e serve:
# - Frontend da frontend/dist/
# - API da api/*.js come serverless functions
```

## ⚡ Ottimizzazioni

### Frontend Build
- **Code Splitting**: Separazione vendor/app chunks
- **Minification**: CSS e JS minificati
- **Gzip**: Compressione automatica assets
- **Tree Shaking**: Rimozione codice non usato

### API Functions
- **Cold Start Optimization**: Dipendenze minimali
- **Caching**: Database connection pooling
- **Runtime**: Node.js 18.x per performance

## 🐛 Troubleshooting Build

### Errore: "Cannot find module"
```bash
npm run build:api  # Installa dipendenze API
```

### Errore: Frontend build fails
```bash
npm run build:frontend  # Build isolato frontend
```

### Errore: Build completo fails
```bash
npm run install:all  # Reinstalla tutto
npm run test:build    # Testa build
```

### Debug Build su Vercel
1. Controlla **Build Logs** nel dashboard Vercel
2. Verifica **Environment Variables**
3. Testa build locale con `npm run test:build`

## 📊 Performance Build

### Metriche Target
- **Build Time**: < 3 minuti
- **Bundle Size**: < 1MB gzipped
- **Cold Start**: < 1 secondo (API)

### Bundle Analysis
```bash
cd frontend
npm run build
npx vite-bundle-analyzer dist/
```

## 🚨 Note Importanti

1. **Non modificare** `vercel.json` senza testare
2. **Sempre testare** build locale prima del deploy
3. **Dipendenze API** devono essere in `api/package.json`
4. **Frontend env vars** devono iniziare con `VITE_`

---

✅ **Build configurato e testato per Vercel!** 🎉

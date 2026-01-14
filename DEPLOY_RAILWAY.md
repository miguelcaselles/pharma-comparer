# 🚂 Despliegue en Railway - PharmaComparer

## Por qué Railway es Mejor para tu Aplicación

✅ **Sin límite de timeout** - PDFs pueden procesarse por minutos
✅ **Archivos grandes** - Soporta PDFs de 50MB+
✅ **Servidor persistente** - No serverless, servidor real
✅ **Variables de entorno** - API keys seguras
✅ **Plan gratuito** - $5 de crédito mensual gratis
✅ **PostgreSQL incluido** - Si lo necesitas más adelante
✅ **Auto-deploy** - Desde GitHub

## 🚀 Despliegue Rápido (10 minutos)

### Opción 1: Desde la Web (Más Fácil)

1. **Ir a [Railway.app](https://railway.app)**
   - Click en "Start a New Project"
   - Login con GitHub

2. **Conectar tu Repositorio**
   - "Deploy from GitHub repo"
   - Selecciona tu repositorio `pharma-comparer`

3. **Configurar Variables de Entorno**
   - En el dashboard de Railway, ve a "Variables"
   - Añade:
     ```
     GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
     NODE_ENV=production
     PORT=8547
     FRONTEND_URL=https://tu-frontend-url.com
     ```

4. **Desplegar**
   - Railway detectará automáticamente tu app Node.js
   - Click "Deploy"
   - ¡Listo en ~3 minutos!

**Tu URL será:** `https://pharma-comparer-production.up.railway.app`

---

### Opción 2: Desde CLI (Para Desarrolladores)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navegar al proyecto
cd "/Users/miguelcaselles/Desktop/PROYECTOS PROGRAMACIÓN /Innovación HSCS/Comparación EECC/pharma-comparer"

# 4. Inicializar proyecto
railway init

# Nombre del proyecto: pharma-comparer
# Selecciona: Empty project

# 5. Vincular con tu código
railway link

# 6. Configurar variables de entorno
railway variables set GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
railway variables set NODE_ENV=production
railway variables set PORT=8547

# 7. Desplegar backend
cd backend
railway up

# 8. Ver logs
railway logs
```

---

## 📦 Configuración del Proyecto

### 1. Crear `package.json` en la raíz (si no existe)

```json
{
  "name": "pharma-comparer",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "cd backend && npm start",
    "build": "cd frontend && npm install && npm run build",
    "install-all": "cd backend && npm install && cd ../frontend && npm install"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Verificar `backend/package.json`

Asegúrate de que tenga:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🔧 Arquitectura Recomendada

### Backend en Railway + Frontend en Vercel/Netlify

**Esta es la mejor configuración para tu app:**

```
┌─────────────────────────────────────┐
│   Frontend (Vercel/Netlify)        │
│   - React + Vite                    │
│   - Interfaz de usuario             │
│   - Archivos estáticos              │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
┌──────────────▼──────────────────────┐
│   Backend (Railway)                 │
│   - Express + Node.js               │
│   - Gemini AI (PDFs)                │
│   - Análisis estadístico            │
│   - Procesamiento pesado            │
└─────────────────────────────────────┘
```

**Ventajas:**
- ✅ Frontend ultra rápido (CDN global)
- ✅ Backend sin límites de tiempo
- ✅ Procesamiento de PDFs grandes
- ✅ Escalable

---

## 🌐 Desplegar Frontend en Netlify

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Navegar al frontend
cd frontend

# 3. Build
npm run build

# 4. Deploy
netlify deploy --prod

# Configurar:
# - Build command: npm run build
# - Publish directory: dist
# - Añadir variable: VITE_API_URL=https://tu-backend.up.railway.app
```

O desde la web:
1. [netlify.com](https://netlify.com) → "Add new site"
2. Conectar GitHub
3. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment variable: `VITE_API_URL` = URL de Railway

---

## 🔐 Variables de Entorno

### Backend (Railway)
```env
GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
NODE_ENV=production
PORT=8547
FRONTEND_URL=https://tu-frontend.netlify.app
```

### Frontend (Netlify/Vercel)
```env
VITE_API_URL=https://pharma-comparer-production.up.railway.app
```

---

## 📊 Monitoreo

Railway proporciona:
- 📈 Uso de CPU/Memoria en tiempo real
- 📜 Logs completos
- 🔔 Alertas de errores
- 📊 Métricas de requests

Dashboard: `https://railway.app/project/[tu-proyecto]`

---

## 💰 Costos

**Railway Hobby Plan (Gratis):**
- $5 USD de crédito mensual
- ~500 horas de ejecución
- Suficiente para desarrollo y pruebas

**Uso estimado de tu app:**
- Servidor activo 24/7: ~$5/mes
- Con uso bajo: Gratis con el crédito mensual
- Escala automáticamente

---

## 🚀 Comandos Útiles

```bash
# Ver logs en tiempo real
railway logs --follow

# Ver estado del servicio
railway status

# Abrir en el navegador
railway open

# Variables de entorno
railway variables

# Conectar a base de datos (si usas)
railway connect

# Reiniciar servicio
railway restart
```

---

## 🔧 Solución de Problemas

### "Port already in use"
Railway asigna el puerto automáticamente. Asegúrate de usar:
```javascript
const PORT = process.env.PORT || 8547;
```

### "Module not found"
Verifica que todas las dependencias estén en `package.json`:
```bash
cd backend
npm install
```

### "Gemini API not working"
Verifica la variable de entorno:
```bash
railway variables
# Debe mostrar GEMINI_API_KEY
```

### PDFs no se suben
Aumenta el límite en Railway:
- Settings → Resource Limits
- Request Timeout: 300 segundos
- Body Size Limit: 100MB

---

## ✅ Checklist de Despliegue

- [ ] Código en GitHub
- [ ] Backend funcionando localmente
- [ ] Frontend funcionando localmente
- [ ] Variables de entorno configuradas
- [ ] Railway project creado
- [ ] Variables en Railway configuradas
- [ ] Backend desplegado en Railway
- [ ] URL del backend obtenida
- [ ] Frontend desplegado en Netlify/Vercel
- [ ] VITE_API_URL configurada en frontend
- [ ] CORS configurado para el dominio del frontend
- [ ] Pruebas de extracción con PDF

---

## 🎯 URLs Finales

Después del despliegue tendrás:

- **Frontend**: `https://pharma-comparer.netlify.app`
- **Backend API**: `https://pharma-comparer-production.up.railway.app`
- **Health Check**: `https://pharma-comparer-production.up.railway.app/api/analysis/health`

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Templates](https://railway.app/templates)

---

**¿Listo para desplegar? Ejecuta:**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

🚂 **Tu app estará en vivo en ~5 minutos!**

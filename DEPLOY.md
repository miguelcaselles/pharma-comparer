# 🚀 Guía de Despliegue - PharmaComparer

## Opciones de Despliegue

### ⚡ Opción 1: Vercel (Recomendada)

**Ventajas:**
- ✅ Despliegue automático desde GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Variables de entorno seguras
- ✅ Serverless functions para el backend

**Pasos:**

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Login en Vercel**
```bash
vercel login
```

3. **Desplegar desde la raíz del proyecto**
```bash
cd "/Users/miguelcaselles/Desktop/PROYECTOS PROGRAMACIÓN /Innovación HSCS/Comparación EECC/pharma-comparer"
vercel
```

4. **Configurar Variables de Entorno en Vercel Dashboard**
   - Ve a tu proyecto en vercel.com
   - Settings → Environment Variables
   - Añade:
     - `GEMINI_API_KEY`: `AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE`
     - `NODE_ENV`: `production`

5. **Redesplegar**
```bash
vercel --prod
```

**URL resultante:** `https://pharma-comparer-tuusuario.vercel.app`

---

### 🐳 Opción 2: Railway

**Ventajas:**
- ✅ Soporta Docker y apps full-stack
- ✅ Base de datos incluida si la necesitas
- ✅ $5 gratis al mes

**Pasos:**

1. **Crear cuenta en [Railway.app](https://railway.app)**

2. **Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login**
```bash
railway login
```

4. **Inicializar proyecto**
```bash
railway init
```

5. **Configurar variables de entorno**
```bash
railway variables set GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
railway variables set NODE_ENV=production
```

6. **Desplegar**
```bash
railway up
```

**URL resultante:** `https://pharma-comparer-production.up.railway.app`

---

### 🔷 Opción 3: Render

**Ventajas:**
- ✅ Plan gratuito disponible
- ✅ Muy fácil de usar
- ✅ Auto-deploy desde GitHub

**Pasos:**

1. **Crear cuenta en [Render.com](https://render.com)**

2. **Crear dos servicios:**
   - **Frontend (Static Site)**
     - Build Command: `cd frontend && npm install && npm run build`
     - Publish Directory: `frontend/dist`

   - **Backend (Web Service)**
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Environment Variables:
       - `GEMINI_API_KEY`: `AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE`

**URL resultante:**
- Frontend: `https://pharma-comparer.onrender.com`
- Backend: `https://pharma-comparer-api.onrender.com`

---

### 🐙 Opción 4: GitHub Pages + Heroku

**Frontend en GitHub Pages + Backend en Heroku**

**Backend en Heroku:**

1. **Instalar Heroku CLI**
```bash
brew install heroku/brew/heroku  # macOS
```

2. **Login**
```bash
heroku login
```

3. **Crear app**
```bash
cd backend
heroku create pharma-comparer-api
```

4. **Configurar variables**
```bash
heroku config:set GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
```

5. **Desplegar**
```bash
git push heroku main
```

**Frontend en GitHub Pages:**
```bash
cd frontend
npm run build
npx gh-pages -d dist
```

---

## 🎯 Recomendación Final

**Para tu caso específico, recomiendo Vercel porque:**

1. ✅ Maneja frontend y backend juntos
2. ✅ Soporte nativo para archivos grandes (PDFs)
3. ✅ Variables de entorno seguras
4. ✅ Despliegue instantáneo
5. ✅ Gratis para proyectos personales

---

## 🔧 Preparación Pre-Despliegue

Antes de desplegar, asegúrate de:

### 1. Añadir archivo `.gitignore` en la raíz
```gitignore
# Dependencies
node_modules/
*/node_modules/

# Environment
.env
.env.local
.env.production

# Build outputs
dist/
build/
*/dist/
*/build/

# Uploads
uploads/
*/uploads/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

### 2. Actualizar `package.json` en la raíz
```json
{
  "name": "pharma-comparer",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "install": "npm install --prefix backend && npm install --prefix frontend",
    "dev:backend": "npm run dev --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend",
    "build": "npm run build --prefix frontend",
    "start": "npm start --prefix backend"
  }
}
```

### 3. Actualizar URLs en producción

En `frontend/src/services/api.js`, cambiar:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://tu-api-url.vercel.app' : 'http://localhost:8547');
```

---

## 📦 Despliegue Rápido con Vercel (5 minutos)

```bash
# 1. Instalar Vercel
npm install -g vercel

# 2. Navegar al proyecto
cd "/Users/miguelcaselles/Desktop/PROYECTOS PROGRAMACIÓN /Innovación HSCS/Comparación EECC/pharma-comparer"

# 3. Desplegar
vercel

# 4. Seguir las instrucciones en pantalla
# - Link to existing project? No
# - Project name: pharma-comparer
# - Which directory? ./
# - Build Command: npm run build
# - Output Directory: frontend/dist
# - Development Command: npm run dev

# 5. Configurar variables de entorno en dashboard
# https://vercel.com/[tu-usuario]/pharma-comparer/settings/environment-variables

# 6. Redesplegar en producción
vercel --prod
```

**¡Tu app estará en vivo en ~3 minutos!**

URL: `https://pharma-comparer.vercel.app` (o similar)

---

## 🔒 Seguridad en Producción

**IMPORTANTE:** Antes de desplegar:

1. ✅ Nunca commitear el archivo `.env` con tu API key
2. ✅ Usar variables de entorno de la plataforma
3. ✅ Configurar CORS solo para tu dominio
4. ✅ Limitar tamaño de uploads (ya configurado: 50MB)
5. ✅ Validar todas las entradas de usuario

---

## 📊 Monitoreo Post-Despliegue

Después de desplegar, revisa:

- ✅ Logs de errores en el dashboard
- ✅ Uso de la API de Gemini
- ✅ Velocidad de respuesta
- ✅ Límites de rate de Gemini API

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en el dashboard de tu plataforma
2. Verifica que `GEMINI_API_KEY` esté configurada
3. Confirma que el backend responde en `/api/analysis/health`
4. Comprueba que los PDFs se suben correctamente

---

**¿Quieres que despliegue la app ahora mismo usando Vercel?** 🚀

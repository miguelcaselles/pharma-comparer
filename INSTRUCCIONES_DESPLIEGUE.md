# 🚀 INSTRUCCIONES DE DESPLIEGUE - PharmaComparer

## ⚡ Opción Rápida (5 minutos)

Sigue estos pasos **en orden**:

---

### 📝 PASO 1: Subir código a GitHub

```bash
cd "/Users/miguelcaselles/Desktop/PROYECTOS PROGRAMACIÓN /Innovación HSCS/Comparación EECC/pharma-comparer"

# Inicializar Git
git init
git add .
git commit -m "Initial commit - PharmaComparer with AI extraction"

# Crear repositorio en GitHub
# 1. Ve a: https://github.com/new
# 2. Nombre: pharma-comparer
# 3. Privado: ✓
# 4. Click "Create repository"

# Conectar y subir (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/pharma-comparer.git
git branch -M main
git push -u origin main
```

---

### 🚂 PASO 2: Desplegar Backend en Railway

#### Opción A: Desde la Web (Recomendada)

1. **Ir a [Railway.app](https://railway.app)**
   - Click "Start a New Project"
   - Login con GitHub

2. **Desplegar desde GitHub**
   - "Deploy from GitHub repo"
   - Selecciona `pharma-comparer`
   - Railway detectará Node.js automáticamente

3. **Configurar Variables de Entorno**
   - Ve a tu proyecto → Settings → Variables
   - Click "+ New Variable"
   - Añade estas variables:

   ```
   GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
   NODE_ENV=production
   PORT=8547
   ```

4. **Obtener URL del Backend**
   - Ve a Settings → Domains
   - Copia la URL (ej: `https://pharma-comparer-production.up.railway.app`)
   - **GUARDA ESTA URL** - La necesitarás en el siguiente paso

#### Opción B: Desde CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init
# Nombre: pharma-comparer
# Selecciona: Empty project

# Configurar variables
railway variables set GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
railway variables set NODE_ENV=production
railway variables set PORT=8547

# Desplegar
railway up

# Ver URL
railway open
```

**✅ GUARDA LA URL DEL BACKEND** (la necesitas para el siguiente paso)

---

### 🌐 PASO 3: Desplegar Frontend en Netlify

1. **Ir a [Netlify](https://app.netlify.com/start)**
   - Login con GitHub
   - Click "Import from Git"
   - Conecta tu repositorio `pharma-comparer`

2. **Configurar Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Añadir Variable de Entorno**
   - Antes de deploy, click "Show advanced"
   - "New variable":
     ```
     Key: VITE_API_URL
     Value: TU_URL_DE_RAILWAY (del paso 2)
     ```
   - Ejemplo: `https://pharma-comparer-production.up.railway.app`

4. **Deploy**
   - Click "Deploy site"
   - Espera ~2 minutos

5. **Obtener URL del Frontend**
   - Copia la URL (ej: `https://pharma-comparer.netlify.app`)
   - **GUARDA ESTA URL**

---

### 🔐 PASO 4: Configurar CORS

Vuelve a Railway y añade la URL del frontend:

1. Ve a tu proyecto en Railway
2. Settings → Variables
3. Añade nueva variable:
   ```
   FRONTEND_URL=TU_URL_DE_NETLIFY
   ```
   Ejemplo: `https://pharma-comparer.netlify.app`

4. Railway redesplegará automáticamente

---

## ✨ ¡LISTO!

Tu aplicación está desplegada en:

- **Frontend**: `https://tu-app.netlify.app`
- **Backend**: `https://tu-app.up.railway.app`

### 🧪 Probar la Aplicación

1. Abre la URL del frontend
2. Click en "AI Extractor"
3. Selecciona "Subir PDF"
4. Sube los PDFs de tus ensayos clínicos
5. Click "Extraer con IA"
6. Revisa la propuesta y aprueba
7. Repite para el segundo ensayo
8. Click "Run Analysis"
9. ¡Disfruta de tu análisis ITC profesional!

---

## 🆘 Si algo falla

### Backend no responde
```bash
# Ver logs en Railway
railway logs --follow
```

### Frontend no conecta con Backend
1. Verifica que `VITE_API_URL` en Netlify sea correcta
2. Verifica que `FRONTEND_URL` en Railway sea correcta
3. Redeploy ambos servicios

### Gemini API no funciona
1. Verifica que `GEMINI_API_KEY` esté configurada en Railway
2. Verifica que la API key sea válida en https://makersuite.google.com/app/apikey

### Ver estado de la API
Abre: `https://tu-backend.up.railway.app/api/analysis/health`

Deberías ver:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-14T...",
  "version": "1.0.0"
}
```

---

## 💰 Costos

- **Railway**: $5 USD gratis/mes (suficiente para desarrollo)
- **Netlify**: Gratis para siempre
- **Gemini API**: Gratis hasta cierto límite

**Total: GRATIS** para uso normal

---

## 📊 Monitoreo

### Railway Dashboard
- URL: https://railway.app/project/[tu-proyecto]
- Ver logs en tiempo real
- Métricas de CPU/RAM
- Reiniciar servicio si es necesario

### Netlify Dashboard
- URL: https://app.netlify.com/sites/[tu-sitio]
- Ver deploys
- Ver logs de build
- Redeploy si es necesario

---

## 🎉 ¡Disfruta tu aplicación!

Ahora tienes una aplicación profesional de análisis de ensayos clínicos con IA, totalmente funcional y desplegada en la nube.

**URL del Frontend**: _[Escribe aquí tu URL de Netlify]_
**URL del Backend**: _[Escribe aquí tu URL de Railway]_

---

**Creado con ❤️ para innovación en ciencias de la salud**

# 🚀 DESPLIEGUE FINAL - 3 Pasos Simples

Tu código ya está en GitHub: https://github.com/miguelcaselles/pharma-comparer

Ahora solo necesitas completar 3 pasos simples en tu navegador:

---

## 📋 PASO 1: Desplegar Backend en Railway (5 minutos)

1. **Abre**: https://railway.app
2. **Login** con tu cuenta de GitHub
3. Click **"Start a New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Busca y selecciona: **pharma-comparer**
6. Railway detectará Node.js automáticamente ✅

### Configurar Variables de Entorno:
- Click en el proyecto → **Settings** → **Variables**
- Añade estas 3 variables:

```
GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE
NODE_ENV=production
PORT=8547
```

### Obtener URL del Backend:
- Ve a **Settings** → **Domains**
- Click **"Generate Domain"**
- Copia la URL (ejemplo: `https://pharma-comparer-production.up.railway.app`)
- **✅ GUARDA ESTA URL** - La necesitas para el siguiente paso

---

## 📋 PASO 2: Desplegar Frontend en Netlify (3 minutos)

1. **Abre**: https://app.netlify.com/start
2. **Login** con GitHub
3. Click **"Import from Git"** → **GitHub**
4. Selecciona: **pharma-comparer**

### Configuración del Build:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### Variables de Entorno:
- Antes de hacer deploy, click **"Show advanced"**
- Click **"New variable"**
- Añade:
  ```
  Key: VITE_API_URL
  Value: [LA_URL_DE_RAILWAY_DEL_PASO_1]
  ```
  Ejemplo: `https://pharma-comparer-production.up.railway.app`

5. Click **"Deploy site"**
6. Espera 2-3 minutos ⏳
7. **Copia la URL** del frontend (ejemplo: `https://pharma-comparer.netlify.app`)

---

## 📋 PASO 3: Configurar CORS (1 minuto)

Vuelve a Railway y añade la URL del frontend:

1. Railway Dashboard → Tu proyecto
2. **Settings** → **Variables**
3. Añade nueva variable:
   ```
   FRONTEND_URL=[LA_URL_DE_NETLIFY_DEL_PASO_2]
   ```
   Ejemplo: `https://pharma-comparer.netlify.app`

4. Railway redesplegará automáticamente (30 segundos)

---

## ✨ ¡LISTO!

Tu aplicación está en producción:

- **Frontend**: https://tu-app.netlify.app
- **Backend**: https://tu-app.up.railway.app

### 🧪 Prueba la Aplicación:

1. Abre la URL del frontend
2. Click en **"AI Extractor"** en la barra lateral
3. El modo **"Subir PDF"** está activo por defecto
4. Selecciona tus PDFs de ensayos clínicos
5. Click **"Extraer con IA"**
6. Revisa la propuesta de extracción
7. Click **"Aprobar y Usar Datos"**
8. Repite para el segundo ensayo
9. Click **"Run Analysis"**
10. **¡Disfruta tu análisis ITC profesional con IA!** 🎉

---

## 🆘 Solución de Problemas

### El backend no responde:
```bash
# Verifica el health endpoint:
https://tu-backend.up.railway.app/api/analysis/health

# Debería responder:
{
  "success": true,
  "status": "healthy",
  "geminiConnected": true
}
```

### El frontend no conecta:
1. Verifica `VITE_API_URL` en Netlify
2. Verifica `FRONTEND_URL` en Railway
3. Redeploy ambos servicios

### Ver logs:
- **Railway**: Dashboard → Deployments → View logs
- **Netlify**: Site overview → Deploys → View logs

---

## 💰 Costos

- **Railway**: $5 USD gratis/mes
- **Netlify**: 100% gratis
- **Gemini API**: Gratis hasta 1,500 requests/día

**Total: GRATIS** ✅

---

## 📝 Información Técnica

### Repositorio GitHub:
https://github.com/miguelcaselles/pharma-comparer

### Stack Tecnológico:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **IA**: Google Gemini 1.5 Pro
- **Análisis**: Bucher Method para ITC

### Características:
✅ Extracción automática de datos de PDFs con IA
✅ Soporte para múltiples PDFs (paper + apéndices)
✅ Workflow de propuesta/aprobación
✅ Análisis estadístico riguroso (Bucher Method)
✅ Gráficos interactivos (forest plots)
✅ Generación de reportes PDF
✅ Interfaz multiidioma (EN/ES)

---

**¿Necesitas ayuda?** Revisa el archivo [INSTRUCCIONES_DESPLIEGUE.md](./INSTRUCCIONES_DESPLIEGUE.md) para más detalles.

**Creado con ❤️ para innovación en ciencias de la salud**

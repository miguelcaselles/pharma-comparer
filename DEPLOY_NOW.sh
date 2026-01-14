#!/bin/bash

echo "🚀 Desplegando PharmaComparer..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/Users/miguelcaselles/Desktop/PROYECTOS PROGRAMACIÓN /Innovación HSCS/Comparación EECC/pharma-comparer"

cd "$PROJECT_DIR"

echo -e "${BLUE}📦 Paso 1: Inicializando Git...${NC}"
git init
git add .
git commit -m "Initial commit - PharmaComparer with AI extraction"

echo ""
echo -e "${GREEN}✅ Git inicializado${NC}"
echo ""

echo -e "${YELLOW}📝 Paso 2: Crear repositorio en GitHub${NC}"
echo "Ve a: https://github.com/new"
echo "Nombre: pharma-comparer"
echo "Descripción: Clinical Trial Indirect Comparison Analysis with AI"
echo "Privado: ✓ (recomendado)"
echo ""
read -p "Presiona Enter cuando hayas creado el repositorio..."

echo ""
echo -e "${BLUE}🔗 Paso 3: Conectar con GitHub${NC}"
read -p "Pega la URL de tu repositorio (git@github.com:usuario/pharma-comparer.git): " REPO_URL

git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo -e "${GREEN}✅ Código subido a GitHub${NC}"
echo ""

echo -e "${BLUE}🚂 Paso 4: Desplegar Backend en Railway${NC}"
echo ""
echo "Opción A - Desde la Web (Más Fácil):"
echo "1. Ve a: https://railway.app"
echo "2. Click 'Start a New Project'"
echo "3. Selecciona 'Deploy from GitHub repo'"
echo "4. Conecta tu cuenta de GitHub"
echo "5. Selecciona 'pharma-comparer'"
echo "6. Railway detectará automáticamente Node.js"
echo "7. Añade estas variables de entorno en Settings → Variables:"
echo "   GEMINI_API_KEY=AIzaSyBml4QqJDNafHpPJ8-AKQ4u300MRhgX0OE"
echo "   NODE_ENV=production"
echo "   PORT=8547"
echo ""
echo "Opción B - Desde CLI:"
echo "   npm install -g @railway/cli"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
read -p "Presiona Enter cuando el backend esté desplegado..."
read -p "Pega la URL del backend (ej: https://pharma-comparer-production.up.railway.app): " BACKEND_URL

echo ""
echo -e "${GREEN}✅ Backend desplegado: $BACKEND_URL${NC}"
echo ""

# Actualizar la URL del API en el frontend
echo -e "${BLUE}🔧 Actualizando URL del API en el frontend...${NC}"
cat > "$PROJECT_DIR/frontend/.env.production" << EOL
VITE_API_URL=$BACKEND_URL
EOL

git add frontend/.env.production
git commit -m "Add production API URL"
git push

echo ""
echo -e "${GREEN}✅ Configuración actualizada${NC}"
echo ""

echo -e "${BLUE}🌐 Paso 5: Desplegar Frontend en Netlify${NC}"
echo ""
echo "1. Ve a: https://app.netlify.com/start"
echo "2. Click 'Import from Git' → GitHub"
echo "3. Selecciona 'pharma-comparer'"
echo "4. Configuración:"
echo "   Base directory: frontend"
echo "   Build command: npm run build"
echo "   Publish directory: frontend/dist"
echo "5. Variables de entorno:"
echo "   VITE_API_URL=$BACKEND_URL"
echo "6. Click 'Deploy site'"
echo ""
read -p "Presiona Enter cuando el frontend esté desplegado..."
read -p "Pega la URL del frontend (ej: https://pharma-comparer.netlify.app): " FRONTEND_URL

echo ""
echo -e "${GREEN}✅ Frontend desplegado: $FRONTEND_URL${NC}"
echo ""

echo -e "${BLUE}🔐 Paso 6: Configurar CORS en Railway${NC}"
echo "1. Ve al dashboard de Railway"
echo "2. Settings → Variables"
echo "3. Añade: FRONTEND_URL=$FRONTEND_URL"
echo "4. Redeploy el servicio"
echo ""
read -p "Presiona Enter cuando hayas actualizado FRONTEND_URL en Railway..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ ¡DESPLIEGUE COMPLETADO! ✨${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🌐 Tu aplicación está disponible en:${NC}"
echo ""
echo -e "  ${GREEN}Frontend:${NC} $FRONTEND_URL"
echo -e "  ${GREEN}Backend:${NC} $BACKEND_URL"
echo -e "  ${GREEN}Health Check:${NC} $BACKEND_URL/api/analysis/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "1. Abre $FRONTEND_URL"
echo "2. Click en 'AI Extractor'"
echo "3. Sube los PDFs de tus ensayos clínicos"
echo "4. ¡Disfruta del análisis automático!"
echo ""
echo -e "${GREEN}🎉 ¡Todo listo para usar!${NC}"
echo ""

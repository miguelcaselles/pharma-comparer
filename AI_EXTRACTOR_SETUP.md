# Configuración del Extractor de IA con Gemini

## Descripción

La aplicación ahora incluye un **Extractor de IA** que utiliza Google Gemini para extraer automáticamente datos estructurados de ensayos clínicos.

## Características

- ✨ Extracción automática de datos usando IA (Gemini 1.5 Pro)
- 📄 **Soporte para archivos PDF** (paper principal + apéndices)
- 📝 También soporta entrada de texto manual
- 📊 Puntuaciones de confianza para cada sección extraída
- ⚠️ Detección automática de datos faltantes o problemáticos
- ✅ Sistema de propuesta y aprobación antes de usar los datos
- 🌍 Soporte multiidioma (Español e Inglés)
- 📎 Múltiples archivos por ensayo (hasta 10 PDFs)

## Configuración

### 1. Obtener una API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### 2. Configurar el Backend

1. Crea un archivo `.env` en la carpeta `backend/`:

```bash
cd backend
cp .env.example .env
```

2. Edita el archivo `.env` y añade tu API key:

```env
# Backend Server Configuration
PORT=8547
NODE_ENV=development
FRONTEND_URL=http://localhost:5928

# Google Gemini API Configuration
GEMINI_API_KEY=tu_api_key_aqui
```

3. Guarda el archivo

### 3. Reiniciar el Backend

```bash
cd backend
npm run dev
```

## Uso

### Modo Extractor de IA

1. En la aplicación, haz clic en el botón **"AI Extractor"** en la sección de instrucciones
2. Verás dos extractores (uno para cada ensayo)

### Para cada ensayo:

#### Opción 1: Subir PDFs (Recomendado)

1. **Selecciona "Subir PDF"** en el toggle (activado por defecto)

2. **Haz clic en el área de carga** o arrastra archivos
   - Puedes subir múltiples PDFs (hasta 10 por ensayo)
   - Formato: paper principal + apéndices/supplementary materials
   - Tamaño máximo: 50MB por archivo

3. **Revisa los archivos seleccionados**
   - Verás la lista con nombres y tamaños
   - Puedes eliminar archivos individuales si es necesario

4. **Haz clic en "Extraer con IA"**
   - La IA procesará todos los PDFs (toma ~30-120 segundos)
   - Gemini analizará el contenido completo de todos los documentos
   - Extraerá tablas, figuras y texto de todos los archivos

#### Opción 2: Pegar Texto

1. **Selecciona "Texto"** en el toggle

2. **Pega el texto** del ensayo clínico en el área de texto
   - Puede ser un abstract completo
   - Un fragmento de un paper
   - Una descripción del ensayo con datos clave

3. **Haz clic en "Extraer con IA"**
   - La IA procesará el texto (toma ~10-30 segundos)
   - Gemini identificará y extraerá los datos estructurados

### Revisar y Aprobar

3. **Revisa la propuesta**
   - Verás un resumen del ensayo extraído
   - Puntuaciones de confianza para cada sección
   - Advertencias sobre datos faltantes o problemáticos
   - Vista previa de los datos clave
   - Lista de archivos procesados (si usaste PDFs)
   - Opción de ver el JSON completo

4. **Aprobar o Rechazar**
   - ✅ **Aprobar**: Los datos se cargan automáticamente para el análisis
   - ❌ **Rechazar**: Puedes subir otros archivos/texto y volver a extraer

5. **Repetir para el segundo ensayo**

6. **Ejecutar el análisis** cuando ambos ensayos estén cargados

## Ejemplo de Texto de Entrada

```
El estudio KEYNOTE-189 fue un ensayo clínico de fase III, aleatorizado, doble ciego,
controlado con placebo que evaluó la eficacia y seguridad de pembrolizumab en combinación
con quimioterapia basada en platino (pemetrexed y carboplatino o cisplatino) versus
placebo más quimioterapia como tratamiento de primera línea para pacientes con cáncer
de pulmón de células no pequeñas (NSCLC) metastásico no escamoso.

Se incluyeron 616 pacientes: 410 en el brazo de pembrolizumab + quimioterapia y 206 en
el brazo de placebo + quimioterapia. La mediana de edad fue de 64 años en ambos grupos,
con aproximadamente 60% de varones. El 35% de los pacientes tenían ECOG 0.

El endpoint primario fue la supervivencia global (OS). El hazard ratio para OS fue de
0.49 (IC 95%: 0.38-0.64, p < 0.00001), con una mediana de supervivencia de 22.0 meses
en el brazo experimental versus 10.7 meses en el brazo control.

En cuanto a seguridad, eventos adversos de grado 3-5 ocurrieron en el 67.2% de pacientes
en el brazo de pembrolizumab + quimioterapia versus 65.8% en el brazo control. La tasa
de discontinuación del tratamiento fue del 13.4% en el brazo experimental y 10.2% en
el control.
```

## Esquema de Datos Extraídos

La IA extrae datos en el siguiente formato:

```json
{
  "trial_name": "KEYNOTE-189",
  "experimental_treatment": "Pembrolizumab + Chemotherapy",
  "comparator_treatment": "Placebo + Chemotherapy",
  "study_type": "Phase III RCT",
  "sample_size_exp": 410,
  "sample_size_comp": 206,
  "baseline_characteristics": {
    "median_age_exp": 64,
    "median_age_comp": 63,
    "male_percentage_exp": 60,
    "male_percentage_comp": 62,
    "ecog_0_1_exp": 35,
    "ecog_0_1_comp": 33
  },
  "efficacy_outcomes": {
    "primary_endpoint": "Overall Survival",
    "primary_endpoint_data": {
      "hazard_ratio": 0.49,
      "ci_lower_95": 0.38,
      "ci_upper_95": 0.64,
      "p_value": 0.00001
    },
    "median_followup_months": 12
  },
  "safety_toxicity": {
    "any_grade_3_5_ae_rate_exp": 67.2,
    "any_grade_3_5_ae_rate_comp": 65.8,
    "discontinuation_rate_exp": 13.4,
    "discontinuation_rate_comp": 10.2
  }
}
```

## Puntuaciones de Confianza

El sistema calcula automáticamente la confianza en los datos extraídos:

- **General**: Promedio de todas las secciones
- **Info Básica**: Nombre del ensayo, tratamientos, tipo de estudio
- **Basal**: Características demográficas de los pacientes
- **Eficacia**: Hazard ratio, intervalos de confianza, p-values
- **Seguridad**: Eventos adversos, tasas de discontinuación

**Interpretación:**
- 🟢 **80-100%**: Alta confianza, datos completos
- 🟡 **50-79%**: Confianza media, algunos datos faltantes
- 🔴 **0-49%**: Baja confianza, muchos datos faltantes

## Advertencias Comunes

El sistema detecta automáticamente:

- ❌ Datos críticos faltantes (Hazard Ratio, IC)
- ⚠️ Valores inconsistentes (IC que no contiene el HR)
- 📊 Datos incompletos en secciones importantes
- 🔍 Valores fuera de rangos esperados

## Modo Manual vs IA

Puedes alternar entre:

- **Modo Manual**: Pega JSON estructurado directamente
- **Modo IA Extractor**: Pega texto libre y la IA extrae los datos

Ambos modos son compatibles y puedes usar uno para un ensayo y otro para el segundo.

## Limitaciones

- La extracción depende de la calidad y completitud del texto original
- Textos muy cortos o ambiguos pueden generar extracciones incompletas
- Siempre revisa la propuesta antes de aprobar
- Los datos de seguridad son los más difíciles de extraer automáticamente

## Solución de Problemas

### Error: "GEMINI_API_KEY not configured"
- Verifica que el archivo `.env` existe en la carpeta `backend/`
- Confirma que la API key está correctamente configurada
- Reinicia el servidor backend

### La extracción tarda mucho
- Normal: Gemini puede tardar 10-60 segundos
- Verifica tu conexión a internet
- La API de Gemini puede tener límites de rate

### Datos incorrectos o incompletos
- Proporciona texto más detallado con más contexto
- Incluye números específicos (hazard ratio, IC, p-values)
- Rechaza la propuesta y prueba con texto más completo

## Endpoints API

### POST `/api/analysis/extract`
Extrae datos de un solo ensayo

**Request:**
```json
{
  "trial_text": "texto del ensayo...",
  "trial_identifier": "A"
}
```

**Response:**
```json
{
  "success": true,
  "proposal": {
    "extracted_data": {...},
    "confidence_scores": {...},
    "warnings": [...],
    "summary": {...}
  }
}
```

### POST `/api/analysis/extract-batch`
Extrae datos de múltiples ensayos (máx. 5)

**Request:**
```json
{
  "trials": [
    {"text": "...", "identifier": "A"},
    {"text": "...", "identifier": "B"}
  ]
}
```

## Seguridad

- La API key se mantiene en el servidor (backend)
- Nunca se expone al cliente (frontend)
- Usa variables de entorno para mayor seguridad
- No subas el archivo `.env` al control de versiones

## Soporte

Para problemas o preguntas:
1. Revisa los logs del backend para errores
2. Verifica que la API key de Gemini es válida
3. Confirma que tienes créditos disponibles en Google AI

---

**Desarrollado con ❤️ usando Google Gemini 1.5 Pro**

# PharmaComparer - Clinical Trial ITC Analysis Platform

![PharmaComparer](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-18%2B-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)

> Professional indirect treatment comparison platform for clinical trial analysis using the Bucher method

## Overview

PharmaComparer is a comprehensive web application designed for pharmaceutical researchers, health economists, and clinical trial analysts to perform rigorous indirect treatment comparisons (ITC) when head-to-head trials are unavailable.

### Key Features

- **Rigorous Statistical Analysis**: Implements the Bucher adjusted indirect comparison method with full mathematical rigor
- **Professional Visualizations**: Interactive forest plots, comparative tables, and safety profiles
- **PDF Report Generation**: Automated creation of publication-ready PDF reports with all analysis results
- **Data Validation**: Comprehensive JSON schema validation and data quality assessment
- **Homogeneity Testing**: Automated evaluation of baseline characteristic similarity
- **Sensitivity Analysis**: Robustness testing under different assumptions
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Scientific Background

### Bucher Method

The Bucher method is a frequentist approach for conducting adjusted indirect treatment comparisons. It is appropriate when:

1. No direct head-to-head trial exists between treatments A and B
2. Both treatments have been compared to a common comparator (e.g., placebo)
3. Trials are sufficiently similar in design and patient populations
4. Hazard ratios and confidence intervals are available

**Mathematical Framework**:

```
ln(HR_AB) = ln(HR_AC) - ln(HR_BC)
SE_AB = √(SE_AC² + SE_BC²)
HR_AB = exp(ln(HR_AB))
95% CI = exp(ln(HR_AB) ± 1.96 × SE_AB)
```

## Architecture

```
pharma-comparer/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   └── package.json
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Statistical utilities
│   │   │   ├── statistics.js    # Bucher calculations
│   │   │   ├── validation.js    # Data validation
│   │   │   └── pdfGenerator.js  # PDF reports
│   │   └── server.js       # Express server
│   └── package.json
└── README.md
```

## Installation

### Prerequisites

- **Node.js** 18+ and npm
- 4GB RAM minimum
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository**:
   ```bash
   cd pharma-comparer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Start the application**:
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:8547`
   - Frontend UI on `http://localhost:5928`

6. **Open your browser** and navigate to `http://localhost:5928`

## Usage

### 1. Prepare Your Data

Your clinical trial data must be in JSON format with the following structure:

```json
{
  "trial_metadata": {
    "trial_name": "TRIAL-NAME",
    "nct_id": "NCT########",
    "publication_year": 2023,
    "indication": "Disease indication",
    "phase": "Phase III"
  },
  "arms_description": {
    "experimental_arm": "Treatment Name",
    "control_arm": "Placebo/Standard of Care",
    "n_experimental": 400,
    "n_control": 200
  },
  "baseline_characteristics": {
    "median_age_exp": 65,
    "median_age_ctrl": 64,
    "sex_male_percentage_exp": 60,
    "sex_male_percentage_ctrl": 58,
    "ecog_0_percentage_exp": 35,
    "ecog_0_percentage_ctrl": 33
  },
  "efficacy_outcomes": {
    "primary_endpoint_data": {
      "endpoint_name": "Overall Survival",
      "hazard_ratio": 0.70,
      "ci_lower_95": 0.60,
      "ci_upper_95": 0.85,
      "p_value": 0.0001,
      "median_exp_months": 18.5,
      "median_ctrl_months": 12.0
    }
  },
  "safety_toxicity": {
    "any_grade_3_5_ae_rate_exp": 65.0,
    "any_grade_3_5_ae_rate_ctrl": 58.0,
    "discontinuation_rate_exp": 12.0,
    "discontinuation_rate_ctrl": 8.0
  }
}
```

### 2. Input Data

- Click "Load Example Data" to see the format with real trial examples
- Paste your Trial A JSON in the left panel
- Paste your Trial B JSON in the right panel
- JSON validation happens automatically

### 3. Run Analysis

- Click "Run Analysis" once both JSONs are valid
- The system will perform:
  - Data validation
  - Bucher indirect comparison
  - Homogeneity assessment
  - Sensitivity analysis
  - Safety comparison

### 4. Review Results

The results page displays:

- **Key Finding**: Summary with HR, CI, and p-value
- **Trial Overview**: Comparative table of trial characteristics
- **Forest Plot**: Visual representation with confidence intervals
- **Homogeneity Assessment**: Baseline characteristic comparison
- **Safety Comparison**: Adverse event profiles
- **Sensitivity Analysis**: Robustness testing
- **Data Quality**: Quality scores and warnings

### 5. Generate Report

Click "Download PDF Report" to create a comprehensive, publication-ready PDF containing all analysis results, tables, and visualizations.

## API Reference

### Endpoints

#### `POST /api/analysis/compare`

Perform indirect treatment comparison.

**Request Body**:
```json
{
  "trial_a": { /* Trial A JSON */ },
  "trial_b": { /* Trial B JSON */ }
}
```

**Response**:
```json
{
  "success": true,
  "comparison_result": {
    "hr_indirect": 0.7424,
    "ci_lower_95": 0.5612,
    "ci_upper_95": 0.9815,
    "p_value": 0.0361,
    "is_significant": true,
    "interpretation": "..."
  },
  "homogeneity_assessment": { /* ... */ },
  "sensitivity_analysis": [ /* ... */ ]
}
```

#### `POST /api/analysis/validate`

Validate trial data structure.

#### `POST /api/analysis/report`

Generate PDF report from analysis results.

#### `GET /api/analysis/health`

Health check endpoint.

## Configuration

### Environment Variables

Create `.env` files in backend and frontend directories:

**Backend (.env)**:
```env
PORT=8547
NODE_ENV=development
FRONTEND_URL=http://localhost:5928
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:8547
```

## Development

### Backend Development

```bash
cd backend
npm run dev
```

Uses nodemon for auto-reload on file changes.

### Frontend Development

```bash
cd frontend
npm run dev
```

Vite dev server with HMR (Hot Module Replacement).

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Backend (Node.js runs directly)
cd backend
npm start
```

## Testing

### Example Data

The application includes example data from real trials:
- **KEYNOTE-189**: Pembrolizumab + Chemotherapy vs Placebo + Chemotherapy
- **CheckMate-9LA**: Nivolumab + Ipilimumab + Chemotherapy vs Chemotherapy

### Validation

All input data is validated against:
- JSON schema compliance
- Hazard ratio validity (HR > 0)
- Confidence interval consistency
- Sample size reasonableness
- Common comparator verification

## Limitations

1. **Indirect Evidence**: Results are less certain than direct head-to-head trials
2. **Transitivity Assumption**: Requires similar patient populations and study designs
3. **Aggregate Data**: Individual patient data would provide more robust results
4. **Single Comparison**: Designed for pairwise comparisons (not network meta-analysis)
5. **Safety Analysis**: Safety comparisons are descriptive only

## Best Practices

1. **Ensure Common Comparator**: Both trials must use equivalent control arms
2. **Check Homogeneity**: Review baseline characteristics carefully
3. **Interpret with Caution**: Consider clinical context and limitations
4. **Document Assumptions**: Note any concerns in your interpretation
5. **Validate Results**: Cross-check with published meta-analyses if available

## Scientific References

- Bucher HC, Guyatt GH, Griffith LE, Walter SD. *The results of direct and indirect treatment comparisons in meta-analysis of randomized controlled trials*. J Clin Epidemiol. 1997;50(6):683-691.

- Glenny AM, Altman DG, Song F, et al. *Indirect comparisons of competing interventions*. Health Technol Assess. 2005;9(26):1-134.

- NICE DSU Technical Support Document 1: *Introduction to evidence synthesis for decision making*. 2012.

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Email: support@pharmacomparer.com
- Documentation: [docs.pharmacomparer.com](https://docs.pharmacomparer.com)

## License

MIT License - See LICENSE file for details

## Disclaimer

This software is for research and educational purposes. Clinical decisions should not be based solely on indirect treatment comparisons. Always consult with qualified healthcare professionals and refer to regulatory guidance.

---

**Built with**: React, Node.js, Express, Chart.js, PDFKit, Tailwind CSS

**Developed by**: Clinical Trial Analytics Team

**Version**: 1.0.0

**Last Updated**: January 2025

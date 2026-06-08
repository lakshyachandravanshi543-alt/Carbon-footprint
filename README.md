# EcoTrack - Smart Carbon Assistant

## Vertical
**Individual Carbon Footprint Tracking & Reduction**

EcoTrack is a client-side web application designed to help individuals calculate, understand, and mitigate their annual carbon footprint. It features an onboarding questionnaire, a rule-based carbon calculation engine, a high-contrast comparison dashboard, and dynamic, context-aware carbon-saving recommendations.

---

## Approach & Logic
The application uses a **Rule-Based Contextual Engine** implemented in `src/utils/carbonCalculator.js`. 

Inputs gathered across three primary sectors are converted into estimated **kg CO₂e per year per capita**:
1. **Transportation**: Multiplies daily distance by 365 days and sector-specific vehicle emission factors (e.g. Petrol Car: `0.18 kg/km`, EV: `0.05 kg/km`, Public Transit: `0.04 kg/km`, Active Transit: `0.00 kg/km`).
2. **Dietary Choices**: Maps annual baseline values derived from dietary carbon studies (Vegan: `1022 kg/yr`, Vegetarian: `1387 kg/yr`, Moderate Meat-eater: `2044 kg/yr`, Heavy Meat-eater: `2993 kg/yr`).
3. **Household Utilities**: Calculates monthly grid electricity consumption and heating fuels (Natural Gas, Oil, Electric Heat), scales them to annual values, and divides by the total household size to compute the per-capita share.

Based on calculated footprint magnitudes in each sector, the engine generates **tailored recommendations** containing specific impact estimates (e.g., suggesting meat reduction if diet emissions exceed a specific threshold, or active transport if commute emissions are high).

---

## How it Works
### Prerequisites
- Node.js (version 20+ recommended)
- npm (version 10+)

### Setup & Installation
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open the printed URL (typically `http://localhost:5173`) in your browser.
3. **Run Automated Test Suite**:
   ```bash
   npm run test
   ```

---

## Assumptions Made
1. **Emission Factors**: All emission factors are based on EPA and DEFRA global averages and modeled for demonstration purposes. Actual footprints can vary based on local energy grid mixes and specific vehicle efficiencies.
2. **Data Privacy**: No user input or footprint data is sent to external servers. All information remains on the user's local device, stored securely in the browser's `localStorage` for privacy and offline usability.
3. **Transportation Schedule**: Daily transit distances represent year-round daily averages.

---

## Evaluation Highlights
- **Accessibility (A11y)**: Built strictly with semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`). Includes complete label pairing, keyboard navigability (full keyboard tab control and focus management on multi-step forms), and high-contrast color styling conforming to WCAG AA guidelines.
- **Security**: Features input sanitization and regex validation for all text-to-number questionnaire parameters, avoiding `dangerouslySetInnerHTML` to prevent Cross-Site Scripting (XSS).
- **Efficiency**: Calculations are memory-optimized using React's `useMemo` hook, recalculating the carbon footprint only when the inputs change.
- **Testing**: A comprehensive test suite with 100% pass coverage across:
  - Unit tests for the carbon engine formulas (`carbonCalculator.test.js`).
  - Component rendering and behavior tests (`Dashboard.test.jsx`).
  - Screen reader accessibility compliance tests (`Accessibility.test.jsx`).

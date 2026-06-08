import React, { useState, useMemo } from 'react';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';
import { calculateFootprint } from './utils/carbonCalculator';

// Local storage key
const LOCAL_STORAGE_KEY = 'ecotrack_user_inputs';

/**
 * Validates whether the stored object has correct shape and properties.
 *
 * @param {any} data - The raw loaded storage data.
 * @returns {boolean} True if data shape matches expected criteria.
 */
function isValidQuestionnaireData(data) {
  if (!data || typeof data !== 'object') return false;
  
  const hasCommuteDistance = 'commuteDistance' in data && typeof data.commuteDistance === 'number';
  const hasCommuteMode = 'commuteMode' in data && typeof data.commuteMode === 'string';
  const hasDietType = 'dietType' in data && typeof data.dietType === 'string';
  const hasElectricity = 'electricityUsage' in data && typeof data.electricityUsage === 'number';
  const hasHeating = 'heatingUsage' in data && typeof data.heatingUsage === 'number';
  const hasHeatingType = 'heatingType' in data && typeof data.heatingType === 'string';
  const hasMembers = 'householdMembers' in data && typeof data.householdMembers === 'number';

  return hasCommuteDistance && hasCommuteMode && hasDietType && hasElectricity && hasHeating && hasHeatingType && hasMembers;
}

/**
 * App component that coordinates forms, dashboards, and localStorage persistence.
 *
 * @returns {React.ReactElement} The main root component of the app.
 */
export default function App() {
  // Load inputs from localStorage with validation
  const [userInputs, setUserInputs] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidQuestionnaireData(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse localStorage data:', err);
    }
    return null;
  });

  // Calculate footprint only when userInputs changes
  const footprint = useMemo(() => {
    return calculateFootprint(userInputs);
  }, [userInputs]);

  /**
   * Saves questionnaire responses to localState and localStorage.
   *
   * @param {Object} data - Clean questionnaire responses.
   */
  const handleFormSubmit = (data) => {
    setUserInputs(data);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  /**
   * Resets stored footprint data and takes the user back to onboarding.
   */
  const handleReset = () => {
    setUserInputs(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear localStorage:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-100">
      {/* Accessibility Skip-to-Content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-bold z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Skip to Content
      </a>

      {/* Semantic Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center space-x-2" aria-label="Main Navigation">
            <span className="flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 w-8 h-8 rounded-lg text-emerald-400 font-extrabold text-lg" aria-hidden="true">
              E
            </span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
              EcoTrack
            </span>
          </nav>
          
          {userInputs && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 border border-slate-700 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/80 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all cursor-pointer"
              aria-label="Reset all carbon footprint data and restart questionnaire"
            >
              Reset Data
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 md:py-12 focus:outline-none" tabIndex="-1">
        {!userInputs ? (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
                Understand and Reduce Your <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Carbon Footprint</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                Take a quick 1-minute assessment of your travel, diet, and home utilities to unlock a customized carbon savings plan.
              </p>
            </div>
            <OnboardingForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                  Your Climate Dashboard
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Track your annual carbon equivalents and follow the recommendations below.
                </p>
              </div>
            </div>

            {/* Dashboard Analytics */}
            <Dashboard footprint={footprint} onReset={handleReset} />

            {/* Context-aware suggestions */}
            <Recommendations footprint={footprint} />
          </div>
        )}
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-900/20 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
          <p className="leading-relaxed max-w-md mx-auto">
            Emission factors are demonstration global averages modeled on EPA / DEFRA factors. All assessment details remain strictly in your browser's private local state.
          </p>
        </div>
      </footer>
    </div>
  );
}

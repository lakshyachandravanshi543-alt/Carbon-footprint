import React from 'react';
import { BASELINES } from '../utils/carbonCalculator';

/**
 * Dashboard component displaying carbon footprint statistics, sectoral breakdowns, and benchmarks.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.footprint - Calculated footprint.
 * @param {number} props.footprint.transport - Commute emissions in kg CO2e/year.
 * @param {number} props.footprint.diet - Diet emissions in kg CO2e/year.
 * @param {number} props.footprint.household - Household energy emissions in kg CO2e/year.
 * @param {number} props.footprint.total - Total emissions in kg CO2e/year.
 * @param {Function} props.onReset - Callback function to retake questionnaire.
 * @returns {React.ReactElement} The rendered Dashboard component.
 */
export default function Dashboard({ footprint, onReset }) {
  const { transport, diet, household, total } = footprint;

  // Format to tonnes (1 tonne = 1000 kg)
  const totalTonnes = (total / 1000).toFixed(2);
  const transportTonnes = (transport / 1000).toFixed(2);
  const dietTonnes = (diet / 1000).toFixed(2);
  const householdTonnes = (household / 1000).toFixed(2);

  // Sector percentages
  const transportPercent = total > 0 ? Math.round((transport / total) * 100) : 0;
  const dietPercent = total > 0 ? Math.round((diet / total) * 100) : 0;
  const householdPercent = total > 0 ? Math.round((household / total) * 100) : 0;

  // Global baselines in tonnes
  const baselinesTonnes = {
    target2030: (BASELINES.target2030 / 1000).toFixed(1),
    globalAverage: (BASELINES.globalAverage / 1000).toFixed(1),
    usAverage: (BASELINES.usAverage / 1000).toFixed(1),
  };

  // Determine standard rating
  let ratingText = 'Excellent';
  let ratingColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  
  if (total > BASELINES.globalAverage) {
    ratingText = 'High';
    ratingColor = 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  } else if (total > BASELINES.target2030) {
    ratingText = 'Moderate';
    ratingColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
  }

  return (
    <section className="space-y-8" aria-label="EcoTrack carbon emission analytics dashboard">
      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Your Annual Carbon Footprint
            </h2>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight">
                {totalTonnes}
              </span>
              <span className="text-xl font-bold text-slate-400">tonnes CO₂e / year</span>
            </div>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              This represents your total annual contribution to global warming across transportation, dietary habits, and residential electricity/heating.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Footprint Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ratingColor}`} aria-live="polite">
                {ratingText}
              </span>
            </div>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all cursor-pointer"
              aria-label="Retake the carbon questionnaire and reset current answers"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Sector Breakdown Panel */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
              Sector Breakdown
            </h3>
            <div className="space-y-4" role="list">
              {/* Transport */}
              <div role="listitem">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>🚗 Transportation</span>
                  <span>{transportTonnes} t ({transportPercent}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5" aria-label={`Transportation emissions: ${transportPercent} percent`}>
                  <div
                    className="bg-sky-400 h-2.5 rounded-full"
                    style={{ width: `${transportPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Diet */}
              <div role="listitem">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>🍔 Diet & Food</span>
                  <span>{dietTonnes} t ({dietPercent}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5" aria-label={`Diet emissions: ${dietPercent} percent`}>
                  <div
                    className="bg-amber-400 h-2.5 rounded-full"
                    style={{ width: `${dietPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Household */}
              <div role="listitem">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>🏠 Home Energy</span>
                  <span>{householdTonnes} t ({householdPercent}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5" aria-label={`Household energy emissions: ${householdPercent} percent`}>
                  <div
                    className="bg-purple-400 h-2.5 rounded-full"
                    style={{ width: `${householdPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Visual SVG Donut Chart for accessibility & aesthetics */}
          <div className="mt-6 flex justify-center items-center" aria-hidden="true">
            <svg width="100" height="100" viewBox="0 0 36 36" className="w-20 h-20">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#334155" strokeWidth="4" />
              {total > 0 ? (
                <>
                  {/* Transport Segment */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeDasharray={`${transportPercent} ${100 - transportPercent}`}
                    strokeDashoffset="100"
                  />
                  {/* Diet Segment */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="4"
                    strokeDasharray={`${dietPercent} ${100 - dietPercent}`}
                    strokeDashoffset={`${100 - transportPercent}`}
                  />
                  {/* Household Segment */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="4"
                    strokeDasharray={`${householdPercent} ${100 - householdPercent}`}
                    strokeDashoffset={`${100 - transportPercent - dietPercent}`}
                  />
                </>
              ) : null}
            </svg>
          </div>
        </div>
      </div>

      {/* Global Benchmarks comparison */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6">
          Global Benchmarks Comparison
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          See how your footprint compares to international benchmarks. Keeping emissions below 2.0 tonnes per person is critical to aligning with international Paris Agreement climate goals.
        </p>

        <div className="space-y-6">
          {/* User Footprint */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-200 mb-1">
              <span>Your Annual Emissions</span>
              <span className="font-extrabold text-emerald-400">{totalTonnes} tonnes</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (total / BASELINES.usAverage) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* 1.5C Target */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-300 mb-1">
              <span>🎯 1.5°C Paris Goal (Max Per Capita)</span>
              <span>{baselinesTonnes.target2030} tonnes</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full"
                style={{ width: `${(BASELINES.target2030 / BASELINES.usAverage) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Global Average */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-300 mb-1">
              <span>🌍 Global Per Capita Average</span>
              <span>{baselinesTonnes.globalAverage} tonnes</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full"
                style={{ width: `${(BASELINES.globalAverage / BASELINES.usAverage) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* US Average */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-300 mb-1">
              <span>🇺🇸 US Per Capita Average</span>
              <span>{baselinesTonnes.usAverage} tonnes</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-slate-500 h-3 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

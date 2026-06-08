import React from 'react';

/**
 * Recommendations component that generates contextual footprint reduction tips.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.footprint - Calculated footprint details in kg CO2e/year.
 * @param {number} props.footprint.transport - Commute emissions.
 * @param {number} props.footprint.diet - Diet emissions.
 * @param {number} props.footprint.household - Household emissions.
 * @returns {React.ReactElement} The rendered Recommendations component.
 */
export default function Recommendations({ footprint }) {
  const { transport, diet, household } = footprint;

  // Build context-aware recommendations list based on sector footprint severity
  const getRecommendations = () => {
    const list = [];

    // Commute Rules
    if (transport > 1500) {
      list.push({
        id: 'rec-commute-high',
        category: 'Transportation',
        title: 'Adopt Active or Public Transit',
        description: 'Your commute emissions are currently high. Transitioning just 2 days a week to public transit or cycling can reduce your transport footprint by up to 40%.',
        impact: 'High Impact (~800 - 1,200 kg CO₂e saved / yr)',
        color: 'border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        ),
      });
      list.push({
        id: 'rec-commute-carpool',
        category: 'Transportation',
        title: 'Initiate Carpooling',
        description: 'If transit isn\'t feasible, matching rides with coworkers or neighbors cuts fuel consumption and emissions in half for every shared commute.',
        impact: 'Medium Impact (~400 - 600 kg CO₂e saved / yr)',
        color: 'border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      });
    } else if (transport > 0) {
      list.push({
        id: 'rec-commute-eco',
        category: 'Transportation',
        title: 'Optimize Eco-Driving Habits',
        description: 'Maintain proper tire inflation, remove excess trunk weight, and avoid rapid acceleration. These simple adjustments enhance fuel efficiency by up to 15%.',
        impact: 'Low Impact (~100 - 200 kg CO₂e saved / yr)',
        color: 'border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      });
    }

    // Diet Rules
    if (diet > 1800) {
      list.push({
        id: 'rec-diet-meatless',
        category: 'Diet & Food',
        title: 'Implement "Meatless Mondays"',
        description: 'Going vegetarian or vegan just one day a week significantly mitigates high agriculture greenhouse emissions. Over a year, this saves hundreds of kg CO2e.',
        impact: 'High Impact (~300 - 450 kg CO₂e saved / yr)',
        color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      });
      list.push({
        id: 'rec-diet-protein',
        category: 'Diet & Food',
        title: 'Substitute Beef with Low-Carbon Proteins',
        description: 'Red meat is highly resource-intensive. Swapping beef or lamb for chicken, eggs, or legumes cuts your food carbon footprint in half.',
        impact: 'High Impact (~500 - 800 kg CO₂e saved / yr)',
        color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        ),
      });
    } else if (diet > 1000) {
      list.push({
        id: 'rec-diet-waste',
        category: 'Diet & Food',
        title: 'Reduce Food Waste',
        description: 'Roughly 30% of global food goes wasted. Plan meals ahead, store items properly, and utilize leftovers to reduce methane emissions from landfills.',
        impact: 'Medium Impact (~150 - 300 kg CO₂e saved / yr)',
        color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      });
    }

    // Household Rules
    if (household > 1500) {
      list.push({
        id: 'rec-house-led',
        category: 'Home Energy',
        title: 'Switch to Smart LED Bulbs',
        description: 'Residential LED bulbs consume up to 80% less energy than standard incandescents and last 25 times longer, instantly lowering grid dependency.',
        impact: 'Medium Impact (~150 - 250 kg CO₂e saved / yr)',
        color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      });
      list.push({
        id: 'rec-house-thermostat',
        category: 'Home Energy',
        title: 'Optimize Thermostat Adjustments',
        description: 'Lowering your thermostat by just 1-2°C during winter (or raising it in summer) reduces HVAC load considerably. Heat pumps are also excellent investments.',
        impact: 'High Impact (~300 - 600 kg CO₂e saved / yr)',
        color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      });
    } else if (household > 0) {
      list.push({
        id: 'rec-house-vampire',
        category: 'Home Energy',
        title: 'Eliminate "Vampire Loads"',
        description: 'Many electronics pull electricity even when turned off. Utilizing smart power strips or unplugging devices when not in use trims baseline power draw.',
        impact: 'Low Impact (~50 - 100 kg CO₂e saved / yr)',
        color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      });
    }

    // Default recommendation if overall profile is already very low
    if (list.length === 0) {
      list.push({
        id: 'rec-default-offset',
        category: 'Community',
        title: 'Support Verified Carbon Offsets',
        description: 'Your footprint is already remarkably low! To reach zero, look into certified carbon offset portfolios that finance reforestation or clean tech globally.',
        impact: 'Neutralizer (~100% net carbon neutrality)',
        color: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400',
        icon: (
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
      });
    }

    return list;
  };

  const recommendations = getRecommendations();

  return (
    <section className="space-y-6" aria-label="Actionable recommendations to reduce footprint">
      <div>
        <h3 className="text-xl font-bold text-slate-100">
          Tailored Reduction Action Plan
        </h3>
        <p className="text-slate-300 text-sm mt-1">
          Based on your carbon data patterns, our system recommends these high-impact steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`border rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-md hover:shadow-lg flex flex-col justify-between ${rec.color}`}
            role="listitem"
          >
            <div>
              <div className="flex items-center mb-3">
                {rec.icon}
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">
                  {rec.category}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">
                {rec.title}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {rec.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
              <span className="text-xs font-bold tracking-wide">
                {rec.impact}
              </span>
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-900"
                  aria-label={`Mark as committed to: ${rec.title}`}
                />
                <span className="text-xs font-semibold text-slate-300 ml-2">Commit</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

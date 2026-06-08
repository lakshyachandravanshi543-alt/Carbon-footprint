import React, { useState, useEffect, useRef } from 'react';

/**
 * OnboardingForm component for capturing individual lifestyle data.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onSubmit - Callback function when questionnaire completes.
 * @param {Object} props.initialData - Initial questionnaire data (optional).
 * @returns {React.ReactElement} The rendered OnboardingForm component.
 */
export default function OnboardingForm({ onSubmit, initialData }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    commuteDistance: initialData?.commuteDistance ?? '',
    commuteMode: initialData?.commuteMode ?? 'petrol',
    dietType: initialData?.dietType ?? 'moderate-meat',
    electricityUsage: initialData?.electricityUsage ?? '',
    heatingUsage: initialData?.heatingUsage ?? '',
    heatingType: initialData?.heatingType ?? 'natural-gas',
    householdMembers: initialData?.householdMembers ?? '1',
  });

  const [errors, setErrors] = useState({});
  const headerRef = useRef(null);

  // Focus the step heading on step change to support screen readers
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.focus();
    }
  }, [step]);

  /**
   * Sanitizes text inputs by removing dangerous HTML tags and characters.
   *
   * @param {string} val - The input string to sanitize.
   * @returns {string} The sanitized string.
   */
  const sanitizeInput = (val) => {
    if (typeof val !== 'string') return '';
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  /**
   * Performs validation for a specific step.
   *
   * @param {number} currentStep - The step number to validate.
   * @returns {boolean} True if validation passes, false otherwise.
   */
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      const distance = parseFloat(formData.commuteDistance);
      if (formData.commuteDistance === '' || isNaN(distance)) {
        newErrors.commuteDistance = 'Please enter your daily commute distance.';
      } else if (distance < 0) {
        newErrors.commuteDistance = 'Distance cannot be negative.';
      } else if (distance > 1000) {
        newErrors.commuteDistance = 'Distance seems unusually high (max 1000 km).';
      }
    }

    if (currentStep === 3) {
      const electricity = parseFloat(formData.electricityUsage);
      if (formData.electricityUsage === '' || isNaN(electricity)) {
        newErrors.electricityUsage = 'Please enter your monthly electricity usage.';
      } else if (electricity < 0) {
        newErrors.electricityUsage = 'Electricity usage cannot be negative.';
      } else if (electricity > 50000) {
        newErrors.electricityUsage = 'Electricity usage is unusually high (max 50,000 kWh).';
      }

      if (formData.heatingType !== 'none') {
        const heating = parseFloat(formData.heatingUsage);
        if (formData.heatingUsage === '' || isNaN(heating)) {
          newErrors.heatingUsage = 'Please enter your monthly heating usage.';
        } else if (heating < 0) {
          newErrors.heatingUsage = 'Heating usage cannot be negative.';
        } else if (heating > 50000) {
          newErrors.heatingUsage = 'Heating usage is unusually high (max 50,000 kWh).';
        }
      }

      const members = parseInt(formData.householdMembers, 10);
      if (formData.householdMembers === '' || isNaN(members)) {
        newErrors.householdMembers = 'Please enter household size.';
      } else if (members < 1) {
        newErrors.householdMembers = 'Household size must be at least 1 person.';
      } else if (members > 100) {
        newErrors.householdMembers = 'Household size is limited to 100 people.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles input value change.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Basic sanitization
    const sanitizedVal = sanitizeInput(value);
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'commuteDistance' || name === 'electricityUsage' || name === 'heatingUsage' || name === 'householdMembers'
        ? value // keep raw string for validation, numbers are validated as floats/ints
        : sanitizedVal,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      // Parse inputs to correct data types
      const cleanData = {
        commuteDistance: parseFloat(formData.commuteDistance) || 0,
        commuteMode: formData.commuteMode,
        dietType: formData.dietType,
        electricityUsage: parseFloat(formData.electricityUsage) || 0,
        heatingUsage: formData.heatingType === 'none' ? 0 : (parseFloat(formData.heatingUsage) || 0),
        heatingType: formData.heatingType,
        householdMembers: parseInt(formData.householdMembers, 10) || 1,
      };
      onSubmit(cleanData);
    }
  };

  return (
    <section className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-xl" aria-label="Carbon footprint calculator form">
      {/* Visual Progress Stepper */}
      <div className="mb-8" aria-hidden="true">
        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
          <span>STEP {step} OF 3</span>
          <span>{step === 1 ? 'Transportation' : step === 2 ? 'Diet & Food' : 'Household Energy'}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext} noValidate>
        {step === 1 && (
          <fieldset className="space-y-6">
            <legend className="sr-only">Transportation Habits</legend>
            <h2
              ref={headerRef}
              tabIndex="-1"
              className="text-2xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md"
            >
              Transportation Habits
            </h2>
            <p className="text-slate-300 text-sm">
              Let's capture your daily transit routines. Your commute is one of the most substantial contributors to your personal footprint.
            </p>

            <div className="space-y-2">
              <label htmlFor="commuteDistance" className="block text-sm font-medium text-slate-200">
                Daily Commute Distance (total km per day)
              </label>
              <input
                type="number"
                id="commuteDistance"
                name="commuteDistance"
                value={formData.commuteDistance}
                onChange={handleChange}
                min="0"
                max="1000"
                step="any"
                className={`w-full px-4 py-2 bg-slate-900 border ${
                  errors.commuteDistance ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                aria-required="true"
                aria-invalid={errors.commuteDistance ? 'true' : 'false'}
                aria-describedby={errors.commuteDistance ? 'commuteDistance-error' : undefined}
                placeholder="e.g. 24"
              />
              {errors.commuteDistance && (
                <p id="commuteDistance-error" className="text-red-400 text-xs mt-1" role="alert">
                  {errors.commuteDistance}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="commuteMode" className="block text-sm font-medium text-slate-200">
                Primary Transport Mode
              </label>
              <select
                id="commuteMode"
                name="commuteMode"
                value={formData.commuteMode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                aria-label="Select your primary mode of commute"
              >
                <option value="petrol">Car (Petrol)</option>
                <option value="diesel">Car (Diesel)</option>
                <option value="hybrid">Car (Hybrid)</option>
                <option value="electric">Electric Vehicle (EV)</option>
                <option value="public">Public Transit (Bus/Train)</option>
                <option value="active">Active Transit (Walking/Biking)</option>
              </select>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-6">
            <legend className="sr-only">Dietary Preferences</legend>
            <h2
              ref={headerRef}
              tabIndex="-1"
              className="text-2xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md"
            >
              Dietary Preferences
            </h2>
            <p className="text-slate-300 text-sm">
              Food production accounts for up to a quarter of global greenhouse gas emissions. Select the option that best reflects your eating habits.
            </p>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                What is your typical diet pattern?
              </label>
              <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Dietary preferences options">
                {[
                  { value: 'vegan', label: 'Vegan', desc: 'No animal products whatsoever.' },
                  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat/fish, but eats dairy and eggs.' },
                  { value: 'moderate-meat', label: 'Moderate Meat-eater', desc: 'Eats chicken, fish, or pork, with occasional red meat.' },
                  { value: 'heavy-meat', label: 'Heavy Meat-eater', desc: 'Eats red meat (beef, lamb) on a regular daily basis.' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.dietType === option.value
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100'
                        : 'bg-slate-900/60 border-slate-700 hover:border-slate-600 text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dietType"
                      value={option.value}
                      checked={formData.dietType === option.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 h-4 w-4 text-emerald-500 border-slate-700 bg-slate-900 focus:ring-emerald-500"
                      aria-label={`${option.label}: ${option.desc}`}
                    />
                    <div>
                      <span className="block font-bold text-sm">{option.label}</span>
                      <span className="block text-xs text-slate-400 mt-1">{option.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-6">
            <legend className="sr-only">Household Energy Usage</legend>
            <h2
              ref={headerRef}
              tabIndex="-1"
              className="text-2xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md"
            >
              Household Energy Usage
            </h2>
            <p className="text-slate-300 text-sm">
              Your home's heating and electrical grid configuration represents a major resource sink. Let's record your usage metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="electricityUsage" className="block text-sm font-medium text-slate-200">
                  Monthly Electricity (kWh)
                </label>
                <input
                  type="number"
                  id="electricityUsage"
                  name="electricityUsage"
                  value={formData.electricityUsage}
                  onChange={handleChange}
                  min="0"
                  max="50000"
                  className={`w-full px-4 py-2 bg-slate-900 border ${
                    errors.electricityUsage ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  aria-required="true"
                  aria-invalid={errors.electricityUsage ? 'true' : 'false'}
                  aria-describedby={errors.electricityUsage ? 'electricityUsage-error' : undefined}
                  placeholder="e.g. 300"
                />
                {errors.electricityUsage && (
                  <p id="electricityUsage-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.electricityUsage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="householdMembers" className="block text-sm font-medium text-slate-200">
                  Household Members
                </label>
                <input
                  type="number"
                  id="householdMembers"
                  name="householdMembers"
                  value={formData.householdMembers}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className={`w-full px-4 py-2 bg-slate-900 border ${
                    errors.householdMembers ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  aria-required="true"
                  aria-invalid={errors.householdMembers ? 'true' : 'false'}
                  aria-describedby={errors.householdMembers ? 'householdMembers-error' : undefined}
                  placeholder="1"
                />
                {errors.householdMembers && (
                  <p id="householdMembers-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.householdMembers}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="heatingType" className="block text-sm font-medium text-slate-200">
                  Heating Fuel Source
                </label>
                <select
                  id="heatingType"
                  name="heatingType"
                  value={formData.heatingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  aria-label="Select your household heating fuel source"
                >
                  <option value="natural-gas">Natural Gas</option>
                  <option value="electricity">Electric Heat / Heat Pump</option>
                  <option value="heating-oil">Heating Oil</option>
                  <option value="none">No Heating (Neutral)</option>
                </select>
              </div>

              {formData.heatingType !== 'none' && (
                <div className="space-y-2">
                  <label htmlFor="heatingUsage" className="block text-sm font-medium text-slate-200">
                    Monthly Heating Energy (kWh)
                  </label>
                  <input
                    type="number"
                    id="heatingUsage"
                    name="heatingUsage"
                    value={formData.heatingUsage}
                    onChange={handleChange}
                    min="0"
                    max="50000"
                    className={`w-full px-4 py-2 bg-slate-900 border ${
                      errors.heatingUsage ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    aria-required="true"
                    aria-invalid={errors.heatingUsage ? 'true' : 'false'}
                    aria-describedby={errors.heatingUsage ? 'heatingUsage-error' : undefined}
                    placeholder="e.g. 250"
                  />
                  {errors.heatingUsage && (
                    <p id="heatingUsage-error" className="text-red-400 text-xs mt-1" role="alert">
                      {errors.heatingUsage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </fieldset>
        )}

        {/* Buttons / Controls */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all cursor-pointer"
              aria-label="Go back to the previous step"
            >
              Back
            </button>
          ) : (
            <div></div> // Spacing placeholder
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
            aria-label={step === 3 ? 'Submit and view your carbon dashboard' : 'Go to the next step'}
          >
            {step === 3 ? 'View Dashboard' : 'Next'}
          </button>
        </div>
      </form>
    </section>
  );
}

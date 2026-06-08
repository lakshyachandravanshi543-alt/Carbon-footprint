/**
 * Emission factors in kg CO2e per km.
 * Source: Derived from EPA and DEFRA global averages.
 * @type {Record<string, number>}
 */
export const COMMUTE_FACTORS = {
  petrol: 0.18,
  diesel: 0.17,
  hybrid: 0.11,
  electric: 0.05,
  public: 0.04,
  active: 0.0,
};

/**
 * Annual diet emission factors in kg CO2e per year.
 * Source: Global average food carbon footprint studies (e.g., Poore & Nemecek).
 * @type {Record<string, number>}
 */
export const DIET_FACTORS = {
  vegan: 1022,        // ~2.8 kg CO2e/day
  vegetarian: 1387,   // ~3.8 kg CO2e/day
  'moderate-meat': 2044, // ~5.6 kg CO2e/day
  'heavy-meat': 2993,    // ~8.2 kg CO2e/day
};

/**
 * Grid electricity factor in kg CO2e per kWh.
 * @type {number}
 */
export const ELECTRICITY_FACTOR = 0.38;

/**
 * Heating fuel factors in kg CO2e per kWh of energy.
 * @type {Record<string, number>}
 */
export const HEATING_FACTORS = {
  'natural-gas': 0.18,
  electricity: 0.38,
  'heating-oil': 0.26,
  none: 0.0,
};

/**
 * Reference baselines in kg CO2e per year per capita.
 * @type {Record<string, number>}
 */
export const BASELINES = {
  globalAverage: 4700,
  usAverage: 16000,
  target2030: 2000,
};

/**
 * Calculates transportation annual emissions in kg CO2e.
 *
 * @param {number} distance - Average daily commute distance in km.
 * @param {string} mode - Commute mode (petrol, diesel, hybrid, electric, public, active).
 * @returns {number} Estimated annual transport emissions in kg CO2e.
 */
export function calculateTransportEmissions(distance, mode) {
  const parsedDistance = Math.max(0, parseFloat(distance) || 0);
  const factor = COMMUTE_FACTORS[mode] ?? COMMUTE_FACTORS.active;
  return Math.round(parsedDistance * 365 * factor);
}

/**
 * Calculates diet annual emissions in kg CO2e.
 *
 * @param {string} type - Diet type (vegan, vegetarian, moderate-meat, heavy-meat).
 * @returns {number} Estimated annual diet emissions in kg CO2e.
 */
export function calculateDietEmissions(type) {
  return DIET_FACTORS[type] ?? DIET_FACTORS['moderate-meat'];
}

/**
 * Calculates household annual emissions in kg CO2e per capita.
 *
 * @param {number} electricity - Monthly electricity usage in kWh.
 * @param {number} heating - Monthly heating energy usage in kWh.
 * @param {string} heatingType - Heating source (natural-gas, electricity, heating-oil, none).
 * @param {number} members - Number of members sharing the household.
 * @returns {number} Estimated annual household emissions per capita in kg CO2e.
 */
export function calculateHouseholdEmissions(electricity, heating, heatingType, members) {
  const parsedElectricity = Math.max(0, parseFloat(electricity) || 0);
  const parsedHeating = Math.max(0, parseFloat(heating) || 0);
  const parsedMembers = Math.max(1, parseInt(members, 10) || 1);

  const electricityAnnual = parsedElectricity * 12 * ELECTRICITY_FACTOR;
  
  const heatingFactor = HEATING_FACTORS[heatingType] ?? HEATING_FACTORS.none;
  const heatingAnnual = parsedHeating * 12 * heatingFactor;

  return Math.round((electricityAnnual + heatingAnnual) / parsedMembers);
}

/**
 * Calculates the complete carbon footprint dataset based on user questionnaire answers.
 *
 * @param {Object} inputs - User questionnaire answers.
 * @param {number} [inputs.commuteDistance] - Distance in km/day.
 * @param {string} [inputs.commuteMode] - Transport mode.
 * @param {string} [inputs.dietType] - Diet pattern.
 * @param {number} [inputs.electricityUsage] - Monthly electricity in kWh.
 * @param {number} [inputs.heatingUsage] - Monthly heating in kWh.
 * @param {string} [inputs.heatingType] - Heating source type.
 * @param {number} [inputs.householdMembers] - Number of members.
 * @returns {{ transport: number, diet: number, household: number, total: number }} Complete footprint dataset in kg CO2e/year.
 */
export function calculateFootprint(inputs) {
  if (!inputs) {
    return { transport: 0, diet: 0, household: 0, total: 0 };
  }

  const transport = calculateTransportEmissions(inputs.commuteDistance, inputs.commuteMode);
  const diet = calculateDietEmissions(inputs.dietType);
  const household = calculateHouseholdEmissions(
    inputs.electricityUsage,
    inputs.heatingUsage,
    inputs.heatingType,
    inputs.householdMembers
  );

  return {
    transport,
    diet,
    household,
    total: transport + diet + household,
  };
}

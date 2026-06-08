import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateHouseholdEmissions,
  calculateFootprint,
} from '../utils/carbonCalculator';

describe('Carbon Engine Unit Tests', () => {
  describe('calculateTransportEmissions', () => {
    it('should calculate zero emissions for active transit (walking/cycling)', () => {
      const result = calculateTransportEmissions(15, 'active');
      expect(result).toBe(0);
    });

    it('should correctly calculate petrol commute emissions', () => {
      // 10 km/day * 365 days * 0.18 kg/km = 657 kg
      const result = calculateTransportEmissions(10, 'petrol');
      expect(result).toBe(657);
    });

    it('should handle invalid or negative distances gracefully', () => {
      const negativeResult = calculateTransportEmissions(-20, 'diesel');
      expect(negativeResult).toBe(0);

      const invalidResult = calculateTransportEmissions('abc', 'electric');
      expect(invalidResult).toBe(0);
    });
  });

  describe('calculateDietEmissions', () => {
    it('should return vegan baseline correctly', () => {
      const result = calculateDietEmissions('vegan');
      expect(result).toBe(1022);
    });

    it('should fall back to moderate-meat diet for invalid selections', () => {
      const result = calculateDietEmissions('invalid-diet');
      expect(result).toBe(2044);
    });
  });

  describe('calculateHouseholdEmissions', () => {
    it('should calculate household energy split correctly per capita', () => {
      // Electricity: 300 kWh * 12 * 0.38 = 1368 kg
      // Gas Heating: 250 kWh * 12 * 0.18 = 540 kg
      // Total: 1908 kg. Sharing among 2 members = 954 kg per capita
      const result = calculateHouseholdEmissions(300, 250, 'natural-gas', 2);
      expect(result).toBe(954);
    });

    it('should handle zero members by falling back to 1 member', () => {
      // Electricity: 100 kWh * 12 * 0.38 = 456 kg. Members: 0 -> fallback to 1
      const result = calculateHouseholdEmissions(100, 0, 'none', 0);
      expect(result).toBe(456);
    });
  });

  describe('calculateFootprint', () => {
    it('should summarize transportation, diet, and household sectors together', () => {
      const inputs = {
        commuteDistance: 10,
        commuteMode: 'electric', // 10 * 365 * 0.05 = 182.5 -> 183 kg
        dietType: 'vegetarian', // 1387 kg
        electricityUsage: 200, // 200 * 12 * 0.38 = 912 kg
        heatingUsage: 100, // 100 * 12 * 0.26 = 312 kg (oil)
        heatingType: 'heating-oil',
        householdMembers: 1, // 912 + 312 = 1224 kg
      };

      const result = calculateFootprint(inputs);
      expect(result.transport).toBe(183);
      expect(result.diet).toBe(1387);
      expect(result.household).toBe(1224);
      expect(result.total).toBe(183 + 1387 + 1224);
    });
  });
});

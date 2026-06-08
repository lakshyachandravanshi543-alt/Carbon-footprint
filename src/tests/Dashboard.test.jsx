import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component Tests', () => {
  const mockFootprint = {
    transport: 1200,   // 1.20 tonnes
    diet: 2044,        // 2.04 tonnes
    household: 1756,   // 1.76 tonnes
    total: 5000,       // 5.00 tonnes
  };

  it('should render carbon calculations in tonnes correctly', () => {
    const handleReset = vi.fn();
    render(<Dashboard footprint={mockFootprint} onReset={handleReset} />);

    // Total should be 5.00 tonnes
    const totalElement = screen.getByText('5.00');
    expect(totalElement).toBeInTheDocument();

    // Verify labels
    expect(screen.getByText('Your Annual Carbon Footprint')).toBeInTheDocument();
    expect(screen.getByText(/tonnes CO₂e \/ year/)).toBeInTheDocument();

    // Sector values
    expect(screen.getByText(/1.20 t/)).toBeInTheDocument(); // Transport
    expect(screen.getByText(/2.04 t/)).toBeInTheDocument(); // Diet
    expect(screen.getByText(/1.76 t/)).toBeInTheDocument(); // Household
  });

  it('should call onReset when the Update Profile button is clicked', () => {
    const handleReset = vi.fn();
    render(<Dashboard footprint={mockFootprint} onReset={handleReset} />);

    const updateButton = screen.getByRole('button', { name: /retake the carbon questionnaire/i });
    expect(updateButton).toBeInTheDocument();

    fireEvent.click(updateButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

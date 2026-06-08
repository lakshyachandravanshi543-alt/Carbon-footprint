import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OnboardingForm from '../components/OnboardingForm';

describe('OnboardingForm Accessibility Tests', () => {
  it('should verify transportation step input fields have accessible labels', () => {
    render(<OnboardingForm onSubmit={vi.fn()} />);

    // Screen reader accessible header
    const stepHeader = screen.getByRole('heading', { level: 2 });
    expect(stepHeader).toHaveTextContent(/Transportation Habits/i);

    // Form inputs should have labels linked by htmlFor/id or aria-labels
    const distanceInput = screen.getByLabelText(/Daily Commute Distance/i);
    expect(distanceInput).toBeInTheDocument();
    expect(distanceInput).toHaveAttribute('type', 'number');

    const modeSelect = screen.getByLabelText(/Primary Transport Mode/i);
    expect(modeSelect).toBeInTheDocument();
    expect(modeSelect.tagName).toBe('SELECT');
  });

  it('should verify submit buttons have descriptive aria-labels', () => {
    render(<OnboardingForm onSubmit={vi.fn()} />);

    // Buttons should have clear labels for screen readers
    const nextButton = screen.getByRole('button', { name: /go to the next step/i });
    expect(nextButton).toBeInTheDocument();
  });
});

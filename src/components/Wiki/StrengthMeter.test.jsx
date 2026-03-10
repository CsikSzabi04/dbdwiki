import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StrengthMeter from './StrengthMeter';

describe('StrengthMeter Component', () => {
    it('should render the correct percentage text', () => {
        render(<StrengthMeter percentage={45} activeTab="killer" />);
        expect(screen.getByTestId('strength-meter-value')).toHaveTextContent('45%');
    });

    it('should clamp percentages over 100 down to 100', () => {
        render(<StrengthMeter percentage={150} activeTab="killer" />);
        expect(screen.getByTestId('strength-meter-value')).toHaveTextContent('100%');
    });

    it('should clamp percentages under 0 up to 0', () => {
        render(<StrengthMeter percentage={-20} activeTab="survivor" />);
        expect(screen.getByTestId('strength-meter-value')).toHaveTextContent('0%');
    });

    it('should show "Weak" category for low percentages', () => {
        render(<StrengthMeter percentage={20} activeTab="killer" />);
        expect(screen.getByTestId('strength-meter-category')).toHaveTextContent('Weak');
    });

    it('should show "Balanced" category for medium percentages', () => {
        render(<StrengthMeter percentage={40} activeTab="killer" />);
        expect(screen.getByTestId('strength-meter-category')).toHaveTextContent('Balanced');
    });

    it('should show "Best" category for high percentages', () => {
        render(<StrengthMeter percentage={95} activeTab="killer" />);
        expect(screen.getByTestId('strength-meter-category')).toHaveTextContent('Best');
    });

    it('should render the blue accent for survivors', () => {
        render(<StrengthMeter percentage={85} activeTab="survivor" />);
        const categoryElement = screen.getByTestId('strength-meter-category');
        // It uses dynamic tailwind classes like text-blue-500
        expect(categoryElement.className).toContain('text-blue-500');
    });

    it('should set the width of the progress bar correctly', () => {
        render(<StrengthMeter percentage={67} activeTab="killer" />);
        const barElement = screen.getByTestId('strength-meter-bar');
        expect(barElement).toHaveStyle({ width: '67%' });
    });
});

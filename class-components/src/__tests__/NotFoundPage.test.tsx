import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../components/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 message', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404 - Page not found')).toBeInTheDocument();
    expect(screen.getByText('Try returning to the main page.')).toBeInTheDocument();
  });

  it('applies correct styles', () => {
    render(<NotFoundPage />);
    const container = screen.getByText('404 - Page not found').parentElement;
    expect(container).toHaveStyle({
      padding: '2rem',
      color: 'rgb(220, 20, 60)',
    });
  });
});

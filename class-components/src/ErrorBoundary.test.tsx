import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('displays a fallback when an error occurs in a child component', () => {
    const Crashing = () => {
      throw new Error('fail');
    };

    render(
      <ErrorBoundary>
        <Crashing />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('call onReset when Try Again is pressed', async () => {
    const onReset = vi.fn();

    const Crashing = () => {
      throw new Error('fail');
    };

    render(
      <ErrorBoundary onReset={onReset}>
        <Crashing />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(button);
    expect(onReset).toHaveBeenCalled();
  });
});

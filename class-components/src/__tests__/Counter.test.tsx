import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Counter from '../components/Counter';

describe('Counter', () => {
  it('renders initial value', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments when clicking +', async () => {
    render(<Counter />);
    await userEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements when clicking −', async () => {
    render(<Counter />);
    await userEvent.click(screen.getByRole('button', { name: '−' }));
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('logs to console on mount, update, and unmount', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { unmount } = render(<Counter />);
    expect(log).toHaveBeenCalledWith('Counter mounted');

    await userEvent.click(screen.getByRole('button', { name: '+' }));
    expect(log).toHaveBeenCalledWith('Counter updated', 0, '→', 1);

    unmount();
    expect(log).toHaveBeenCalledWith('Counter will unmount');

    log.mockRestore();
  });
});

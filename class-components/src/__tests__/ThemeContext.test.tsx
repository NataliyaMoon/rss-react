import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider & useTheme', () => {
  it('по умолчанию тема "light"', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('меняет тему на "dark" при toggleTheme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /toggle/i });
    await userEvent.click(button);
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });

  it('тоггл обратно на "light"', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /toggle/i });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('выбрасывает ошибку при использовании useTheme без ThemeProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const BrokenComponent = () => {
      useTheme();
      return null;
    };
    expect(() => render(<BrokenComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleErrorSpy.mockRestore();
  });
});

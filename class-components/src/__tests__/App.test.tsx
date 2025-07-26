import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import App from '../App';

vi.mock('../components/PeopleSearch', () => ({
  default: () => <div data-testid="people-search">PeopleSearch mock</div>,
}));

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /react app/i })
    ).toBeInTheDocument();
  });

  it('shows the PeopleSearch component by default', () => {
    render(<App />);
    expect(screen.getByTestId('people-search')).toBeInTheDocument();
  });

  it('toggles PeopleSearch when a button is clicked', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /hide/i });

    await userEvent.click(button);
    expect(screen.queryByTestId('people-search')).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show');

    await userEvent.click(button);
    expect(screen.getByTestId('people-search')).toBeInTheDocument();
    expect(button).toHaveTextContent('Hide');
  });
});

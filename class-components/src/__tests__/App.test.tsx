import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import App from '../App';

vi.mock('../components/PeopleSearch', () => ({
  default: () => <div data-testid="people-search">PeopleSearch mock</div>,
}));

vi.mock('../components/AboutUs', () => ({
  default: () => (
    <div>
      <h2>About Us</h2>
      <p>This is the About page</p>
    </div>
  ),
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

  it('navigates to About page when About button is clicked', async () => {
    render(<App />);
    const aboutButton = screen.getByRole('button', { name: /about us/i });
    await userEvent.click(aboutButton);

    expect(await screen.findByRole('heading', { name: /about us/i }))
      .toBeInTheDocument();
    expect(screen.getByText(/this is the about page/i)).toBeInTheDocument();
  });
});

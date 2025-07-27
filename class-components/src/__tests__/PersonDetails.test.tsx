import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PersonDetails from '../components/PersonDetails';

const mockPerson = {
  name: 'Luke Skywalker',
  gender: 'male',
  birth_year: '19BBY',
  height: '172',
  mass: '77',
  eye_color: 'blue',
};

describe('PersonDetails', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPerson),
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('renders loading initially', () => {
    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);
    expect(screen.getByText('Loading details...')).toBeInTheDocument();
  });

  it('fetches and displays person details', async () => {
    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
    expect(screen.getByText('Height: 172 cm')).toBeInTheDocument();
    expect(screen.getByText('Mass: 77 kg')).toBeInTheDocument();
    expect(screen.getByText('Eye color: blue')).toBeInTheDocument();
  });
});

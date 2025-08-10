import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import PersonDetails from '../components/PersonDetails';
import { useGetPersonByUrlQuery } from '../services/swapiApi';

vi.mock('../services/swapiApi', () => ({
  useGetPersonByUrlQuery: vi.fn(),
}));

const mockPerson = {
  name: 'Luke Skywalker',
  gender: 'male',
  birth_year: '19BBY',
  height: '172',
  mass: '77',
  eye_color: 'blue',
};

describe('PersonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading initially', () => {
    (useGetPersonByUrlQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    });

    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);
    expect(screen.getByText('Loading details...')).toBeInTheDocument();
  });

  it('renders error message', () => {
    (useGetPersonByUrlQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 404 },
    });

    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);
    expect(screen.getByText('Error: 404')).toBeInTheDocument();
  });

  it('renders unknown error message', () => {
    (useGetPersonByUrlQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {},
    });

    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);
    expect(screen.getByText('Error: Unknown error')).toBeInTheDocument();
  });

  it('renders person details when data is loaded', () => {
    (useGetPersonByUrlQuery as Mock).mockReturnValue({
      data: mockPerson,
      isLoading: false,
      isError: false,
      error: undefined,
    });

    render(<PersonDetails url="https://swapi.dev/api/people/1/" />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
    expect(screen.getByText('Height: 172 cm')).toBeInTheDocument();
    expect(screen.getByText('Mass: 77 kg')).toBeInTheDocument();
    expect(screen.getByText('Eye color: blue')).toBeInTheDocument();
  });
});

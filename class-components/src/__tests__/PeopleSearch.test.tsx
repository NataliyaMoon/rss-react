import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PeopleSearch from '../components/PeopleSearch';

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockPeople = [
  {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/1/',
    gender: 'male',
    height: '172',
    mass: '77',
    eye_color: 'blue',
  },
  {
    name: 'Leia Organa',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/2/',
    gender: 'female',
    height: '150',
    mass: '49',
    eye_color: 'brown',
  },
];

const createMockResponse = (data: object) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });

const renderWithRouter = (initialEntries: string[] = ['/1']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:page/:detailsId?" element={<PeopleSearch />} />
      </Routes>
    </MemoryRouter>
  );

describe('PeopleSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 2 })));
    localStorage.clear();
  });

  it('displays results after loading', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('Leia Organa')).toBeInTheDocument();
    });
  });

  it('highlights selected row when detailsId matches', async () => {
    renderWithRouter(['/1/1?search=luke']);
    await waitFor(() => {
      const activeRow = screen.getByText('Luke Skywalker').closest('tr');
      expect(activeRow).toHaveClass('active-row');
    });
  });

  it('allows entering and searching a query', async () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText(/search people/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'leia');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=leia'),
        expect.any(Object)
      );
    });
  });

  it('shows an error message on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fail'))));
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/error: fail/i)).toBeInTheDocument();
    });
  });

  it('shows loading message while fetching data', async () => {
    let resolveFetch: () => void;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = () => resolve(createMockResponse({ results: mockPeople, count: 2 }));
          })
      )
    );

    renderWithRouter();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    resolveFetch!();
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('displays correct page info', async () => {
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 25 })));
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });
  });

  it('displays "Page 1 of 1" when no results', async () => {
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: [], count: 0 })));
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
    });
  });

  it('saves query to localStorage and restores it', async () => {
    localStorage.setItem('peopleSearchQuery', 'leia');
    renderWithRouter();
    expect(screen.getByDisplayValue('leia')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 20 })));
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(fetch).toHaveBeenCalledTimes(2);

    await userEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

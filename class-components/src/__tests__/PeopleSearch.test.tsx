import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeopleSearch from '../components/PeopleSearch';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('../components/CrashComponent', () => ({
  default: () => <div data-testid="crash">CrashComponent</div>
}));

const mockPeople = [
  { name: 'Luke Skywalker', birth_year: '19BBY', url: '1' },
  { name: 'Leia Organa', birth_year: '19BBY', url: '2' }
];

const createMockResponse = (data: object) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  });

describe('PeopleSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 2 })));
    localStorage.clear();
  });

  it('displays results after loading', async () => {
    render(<PeopleSearch />);
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('Leia Organa')).toBeInTheDocument();
    });
  });

  it('enters a query and starts the search', async () => {
    render(<PeopleSearch />);
    await userEvent.clear(screen.getByPlaceholderText(/search people/i));
    await userEvent.type(screen.getByPlaceholderText(/search people/i), 'leia');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fail'))));
    render(<PeopleSearch />);
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

    render(<PeopleSearch />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    resolveFetch!();
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('toggles forceError and displays CrashComponent', async () => {
    render(<PeopleSearch />);
    await userEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByTestId('crash')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 20 })));

    render(<PeopleSearch />);
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const next = screen.getByRole('button', { name: /next/i });
    await userEvent.click(next);
    expect(fetch).toHaveBeenCalledTimes(2);

    const prev = screen.getByRole('button', { name: /prev/i });
    await userEvent.click(prev);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('loads saved query from localStorage on mount', () => {
    localStorage.setItem('peopleSearchQuery', 'leia');
    render(<PeopleSearch />);
    expect(screen.getByDisplayValue('leia')).toBeInTheDocument();
  });

  it('initializes query as empty if localStorage is empty', () => {
    localStorage.removeItem('peopleSearchQuery');
    render(<PeopleSearch />);
    expect(screen.getByPlaceholderText(/search people/i)).toHaveValue('');
  });

  it('displays correct page number and total pages', async () => {
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 25 })));
    render(<PeopleSearch />);
    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });
  });

  it('displays "Page 1 of 1" when there are no results', async () => {
  vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: [], count: 0 })));
  render(<PeopleSearch />);
  await waitFor(() => {
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
  });
});
});

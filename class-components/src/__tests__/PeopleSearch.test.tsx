import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../components/slices/peopleSlice';
import PeopleSearch from '../components/PeopleSearch';

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../components/SelectionBar', () => ({
  default: () => <div data-testid="selection-bar">SelectionBar mock</div>,
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

const renderWithProviders = (initialEntries: string[] = ['/1']) => {
  const store = configureStore({
    reducer: { people: peopleReducer },
    preloadedState: {
      people: {
        selected: {},
        searchQuery: '',
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/:page/:detailsId?" element={<PeopleSearch />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PeopleSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn(() => createMockResponse({ results: mockPeople, count: 2 })));
  });

  it('renders fetched people', async () => {
    renderWithProviders();
    expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  it('shows active row based on detailsId', async () => {
    renderWithProviders(['/1/1?search=luke']);
    const activeRow = await screen.findByText('Luke Skywalker');
    expect(activeRow.closest('tr')).toHaveClass('active-row');
  });

  it('updates search query and navigates', async () => {
    renderWithProviders();
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

  it('handles fetch errors gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))));
    renderWithProviders();
    expect(await screen.findByText(/error: network error/i)).toBeInTheDocument();
  });

  it('shows loading indicator while fetching', async () => {
    let resolveFetch: () => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise((res) => {
      resolveFetch = () => res(createMockResponse({ results: mockPeople, count: 2 }));
    })));

    renderWithProviders();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    resolveFetch!();
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('renders correct pagination info', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      createMockResponse({ results: mockPeople, count: 25 })
    ));
    renderWithProviders();
    expect(await screen.findByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it('displays no results with "Page 1 of 1"', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      createMockResponse({ results: [], count: 0 })
    ));
    renderWithProviders();
    expect(await screen.findByText(/page 1 of 1/i)).toBeInTheDocument();
  });

  it('navigates pages via next/prev buttons', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      createMockResponse({ results: mockPeople, count: 20 })
    ));
    renderWithProviders();

    await screen.findByText('Luke Skywalker');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

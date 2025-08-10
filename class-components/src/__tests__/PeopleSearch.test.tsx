import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route, MemoryRouter, useLocation } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../components/slices/peopleSlice';
import PeopleSearch from '../components/PeopleSearch';
import { useGetPeopleQuery, swapiApi } from '../services/swapiApi';

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../components/SelectionBar', () => ({
  default: () => <div data-testid="selection-bar">SelectionBar mock</div>,
}));

vi.mock('../services/swapiApi', () => ({
  useGetPeopleQuery: vi.fn(),
  swapiApi: {
    util: {
      invalidateTags: vi.fn(() => ({ type: 'TEST/INVALIDATE_TAGS' })),
    },
    reducerPath: 'swapiApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

const mockPeople = [
  { name: 'Luke Skywalker', birth_year: '19BBY', url: 'https://swapi.dev/api/people/1/' },
  { name: 'Leia Organa', birth_year: '19BBY', url: 'https://swapi.dev/api/people/2/' },
];

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.search}</div>;
}

const renderWithProviders = (initialEntries: string[] = ['/1']) => {
  const store = configureStore({
    reducer: {
      people: peopleReducer,
      [swapiApi.reducerPath]: swapiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(swapiApi.middleware),
    preloadedState: { people: { selected: {}, searchQuery: '' } },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/:page/:detailsId?"
            element={
              <>
                <PeopleSearch />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PeopleSearch', () => {
  const refetchMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: { results: mockPeople, count: 2 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
  });

  it('renders fetched people', () => {
    renderWithProviders();
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  it('shows active row based on detailsId', () => {
    renderWithProviders(['/1/1?search=luke']);
    const activeRow = screen.getByText('Luke Skywalker').closest('tr');
    expect(activeRow).toHaveClass('active-row');
  });

  it('updates search query and navigates', async () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText(/search people/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'leia');
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(screen.getByTestId('location-display').textContent).toContain('leia');
  });

  it('handles error state', () => {
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 500 },
      refetch: refetchMock,
    });
    renderWithProviders();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
    renderWithProviders();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders correct pagination info', () => {
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: { results: mockPeople, count: 25 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
    renderWithProviders();
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it('displays "Page 1 of 1" for no results', () => {
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: { results: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
    renderWithProviders();
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
  });

  it('calls refetch on Refresh click', async () => {
    renderWithProviders();
    await userEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(refetchMock).toHaveBeenCalled();
  });

  it('calls invalidateTags and refetch on Clear Cache', async () => {
    renderWithProviders();
    await userEvent.click(screen.getByRole('button', { name: /clear cache/i }));
    expect(swapiApi.util.invalidateTags).toHaveBeenCalledWith(['People']);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('navigates pages via next/prev', async () => {
    (useGetPeopleQuery as unknown as Mock).mockReturnValue({
      data: { results: mockPeople, count: 20 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    });
    renderWithProviders();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonDetailsWrapper from '../components/PersonDetailsWrapper';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

vi.mock('../components/PersonDetails', () => ({
  default: ({ url }: { url: string }) => <div>Mocked Details: {url}</div>,
}));

describe('PersonDetailsWrapper', () => {
  const navigateMock = vi.fn();
  const searchParamsMock = new URLSearchParams({ search: 'Luke' });

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>) .mockReturnValue(navigateMock);
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([searchParamsMock]);
  });

  it('renders nothing when detailsId is missing', () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ page: '1' });

    const { container } = render(
      <MemoryRouter>
        <PersonDetailsWrapper />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders details when detailsId is present', () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ page: '1', detailsId: '5' });

    render(
      <MemoryRouter>
        <PersonDetailsWrapper />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Details: https://swapi.py4e.com/api/people/5/')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('navigates back to list when close button is clicked', () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ page: '3', detailsId: '2' });

    render(
      <MemoryRouter>
        <PersonDetailsWrapper />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /close/i });
    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith('/3?search=Luke');
  });
});

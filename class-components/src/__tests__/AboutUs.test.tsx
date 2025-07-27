import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutUs from '../components/AboutUs';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useNavigate } from 'react-router-dom';

describe('AboutUs', () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);
  });

  it('renders about us content correctly', () => {
    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>
    );

    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText(/Hi, my name is Natalia/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /React course at RS School/i })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(screen.getByRole('button', { name: /back home/i })).toBeInTheDocument();
  });

  it('navigates to home on Back Home button click', () => {
    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /back home/i }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});

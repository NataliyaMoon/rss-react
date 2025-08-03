import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SelectionBar from '../components/SelectionBar';
import { useDispatch, useSelector } from 'react-redux';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

const mockDispatch = vi.fn();
const mockPerson = {
  name: 'Leia Organa',
  birth_year: '19BBY',
  gender: 'female',
  height: '150',
  mass: '49',
  eye_color: 'brown',
  url: 'https://swapi.dev/api/people/5/',
};

describe('SelectionBar', () => {
  beforeEach(() => {
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('does not render when nothing is selected', () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({});
    render(<SelectionBar />);
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it('renders correctly when an item is selected', () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      '5': mockPerson,
    });
    render(<SelectionBar />);
    expect(screen.getByText('1 item(-s) are selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('dispatches clearSelection on "Unselect all"', async () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      '5': mockPerson,
    });
    render(<SelectionBar />);
    await userEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('generates and revokes CSV download URL on "Download"', async () => {
    const createObjectURLMock = vi.fn(() => 'blob:mocked-url');
    const revokeObjectURLMock = vi.fn();
    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    });

    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      '5': mockPerson,
    });

    render(<SelectionBar />);
    await userEvent.click(screen.getByRole('button', { name: /download/i }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mocked-url');
  });
});

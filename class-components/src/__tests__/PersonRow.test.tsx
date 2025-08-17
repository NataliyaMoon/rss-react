import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import configureStore from 'redux-mock-store';
import PersonRow from '../../components/PersonRow';
import type { RootState } from '../../store';

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ detailsId: '42' }),
}));

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
let mockState: RootState;

const mockStore = configureStore([]);

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-redux')>();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => selector(mockState),
  };
});

import { Provider } from 'react-redux';

const person = {
  url: 'https://swapi.dev/api/people/42/',
  name: 'Luke Skywalker',
  birth_year: '19BBY',
};

function renderComponent(props = {}) {
  const store = mockStore(mockState);
  return render(
    <Provider store={store}>
      <table>
        <tbody>
          <PersonRow person={person} index={0} page={1} query="test" {...props} />
        </tbody>
      </table>
    </Provider>
  );
}

describe('PersonRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {
      people: {
        selected: {},
      },
    } as unknown as RootState;
  });

  it('рендерит данные человека и номер строки', () => {
    renderComponent();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
  });

  it('присваивает класс active-row, если id совпадает с detailsId', () => {
    renderComponent();
    const tr = screen.getByRole('row');
    expect(tr).toHaveClass('active-row');
  });

  it('вызывает navigate с правильным путем при клике на строку', async () => {
    renderComponent();
    const tr = screen.getByRole('row');
    await userEvent.click(tr);
    expect(mockNavigate).toHaveBeenCalledWith('/1/42?search=test');
  });

  it('вызывает dispatch toggleSelection при клике на чекбокс', async () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0].type).toBe('people/toggleSelection');
  });

  it('чекбокс отмечен, если person.url есть в selected', () => {
    mockState.people.selected = { [person.url]: person };
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});

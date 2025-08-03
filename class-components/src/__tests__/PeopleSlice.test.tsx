import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, {
  toggleSelection,
  clearSelection,
  setSearchQuery,
} from '../components/slices/peopleSlice';

type Person = {
  name: string;
  url: string;
  [key: string]: unknown;
};

describe('peopleSlice', () => {
  const person: Person = { name: 'Luke Skywalker', url: '1' };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('should return the initial state', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({ selected: {}, searchQuery: '' });
  });

  it('should toggle selection on', () => {
    const nextState = reducer(
      { selected: {}, searchQuery: '' },
      toggleSelection(person)
    );
    expect(nextState.selected).toHaveProperty('1');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'selectedPeople',
      JSON.stringify({ '1': person })
    );
  });

  it('should toggle selection off', () => {
    const startState = { selected: { '1': person }, searchQuery: '' };
    const nextState = reducer(startState, toggleSelection(person));
    expect(nextState.selected).toEqual({});
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'selectedPeople',
      JSON.stringify({})
    );
  });

  it('should clear selection', () => {
    const startState = { selected: { '1': person }, searchQuery: '' };
    const nextState = reducer(startState, clearSelection());
    expect(nextState.selected).toEqual({});
    expect(localStorage.removeItem).toHaveBeenCalledWith('selectedPeople');
  });

  it('should set search query', () => {
    const nextState = reducer(
      { selected: {}, searchQuery: '' },
      setSearchQuery('skywalker')
    );
    expect(nextState.searchQuery).toBe('skywalker');
  });
});

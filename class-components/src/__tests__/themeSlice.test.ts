import { describe, it, expect } from 'vitest';
import themeReducer, { toggleTheme } from '../components/slices/themeSlice';

describe('themeSlice', () => {
  it('should return initial state', () => {
    const state = themeReducer(undefined, { type: 'unknown_action' });
    expect(state).toEqual({ value: 'light' });
  });

  it('should toggle from light to dark', () => {
    const initialState = { value: 'light' as const };
    const state = themeReducer(initialState, toggleTheme());
    expect(state.value).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    const initialState = { value: 'dark' as const };
    const state = themeReducer(initialState, toggleTheme());
    expect(state.value).toBe('light');
  });
});

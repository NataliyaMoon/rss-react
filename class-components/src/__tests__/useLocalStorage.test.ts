import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useLocalStorage', () => {
  const key = 'test-key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('должен возвращать значение из localStorage, если оно есть', () => {
    localStorage.setItem(key, 'stored-value');

    const { result } = renderHook(() => useLocalStorage(key, 'default'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('должен использовать initialValue, если localStorage пуст', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'default-value'));

    expect(result.current[0]).toBe('default-value');
  });

  it('должен обновлять localStorage при изменении значения', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem(key)).toBe('new-value');
  });
});

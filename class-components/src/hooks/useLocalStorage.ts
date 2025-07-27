import { useState, useEffect } from 'react';

function useLocalStorage(key: string, initialValue: string): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item !== null ? item : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, storedValue);
  }, [key, storedValue]);

  const setValue = (value: string) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
}

export default useLocalStorage;

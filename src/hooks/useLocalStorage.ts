import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Only attempt to read from localStorage after client-side rendering
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    }
    return initialValue;
  });

  // Ensure localStorage operations only happen on the client
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Only update localStorage on the client
      if (typeof window !== 'undefined') {
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window === 'undefined') return;

    // Sync localStorage with state
    try {
      const item = window.localStorage.getItem(key);
      const currentValue = item ? JSON.parse(item) : initialValue;
      
      // Only update if there's a difference
      if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
        setStoredValue(currentValue);
      }
    } catch (error) {
      console.error(error);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue] as const;
}

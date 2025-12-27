
import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Use a ref or just rely on hydration logic to prevent hydration mismatch.
    // The previous implementation used isInitialized state, but we can simplify by just loading in useEffect.
    // However, we want to avoid returning initialValue if localStorage has something else, 
    // but during SSR it must return initialValue.

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            const item = window.localStorage.getItem(key);
            const value = item ? JSON.parse(item) : initialValue;

            // Only update if value is different to avoid unnecessary re-renders?
            // React usually handles this.
            setStoredValue(value);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, initialValue]); // Added initialValue to dependencies

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]); // Now depends on storedValue, or use functional update pattern.

    // Better: functional update pattern for setValue -> setStoredValue
    // so we don't depend on storedValue in useCallback if logical calculation allows.
    // BUT the persisted valueToStore calculation might need current storedValue if value is function.
    // Wait, if value is function, it expects current state.

    // Correct safer implementation:
    const setValueSafe = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue((prevValue) => {
            const valueToStore = value instanceof Function ? value(prevValue) : value;
            try {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
            return valueToStore;
        });
    }, [key]);

    return [storedValue, setValueSafe];
}

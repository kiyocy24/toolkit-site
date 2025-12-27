
import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key)
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            // If error also return initialValue
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            // Save state
            setStoredValue(valueToStore)
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }

    // Subscribe to changes in other tabs/windows if needed, 
    // currently just a simple implementation. 
    // Ideally, we might want to listen to storage events, but for this simple use case it might be overkill.
    // However, for Next.js hydration mismatch avoidance, we might need a useEffect to force re-render on client?
    // Actually, the lazy initialization in useState might cause hydration mismatch if server renders initialValue 
    // and client renders stored value.

    // To solve hydration mismatch:
    // Initialize with initialValue, then useEffect to set from localStorage.

    return [storedValue, setValue]
}


export function useLocalStorageSafe<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            const item = window.localStorage.getItem(key);
            const value = item ? JSON.parse(item) : initialValue;
            setStoredValue(value);
            setIsInitialized(true);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            setStoredValue(initialValue);
            setIsInitialized(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

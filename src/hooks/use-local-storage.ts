
import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Prevent hydration mismatch by only reading from localStorage after mount.

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            const item = window.localStorage.getItem(key);
            const value = item ? JSON.parse(item) : initialValue;


            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStoredValue(value);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, initialValue]); // Added initialValue to dependencies



    // Use a functional update to safely access the previous value without including it in dependencies
    const setValue = useCallback((value: T | ((val: T) => T)) => {
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

    return [storedValue, setValue];
}

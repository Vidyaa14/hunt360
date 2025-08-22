import { useState, useEffect } from 'react';

// Custom hook for debouncing values
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom hook for debounced search
export const useDebounceSearch = (searchFunction, delay = 500) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, delay);

    useEffect(() => {
        if (debouncedSearchTerm) {
            setLoading(true);
            setError(null);
            
            searchFunction(debouncedSearchTerm)
                .then(setResults)
                .catch(setError)
                .finally(() => setLoading(false));
        } else {
            setResults(null);
        }
    }, [debouncedSearchTerm, searchFunction]);

    return {
        searchTerm,
        setSearchTerm,
        results,
        loading,
        error,
    };
};

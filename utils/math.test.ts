import { describe, it, expect } from 'vitest';
import { factorize, collatz } from './math';

describe('factorize', () => {
    it('should return empty object for numbers less than 2', () => {
        expect(factorize(1n)).toEqual({});
        expect(factorize(0n)).toEqual({});
        expect(factorize(-5n)).toEqual({});
    });

    it('should correct factorize prime numbers', () => {
        expect(factorize(2n)).toEqual({ "2": 1 });
        expect(factorize(3n)).toEqual({ "3": 1 });
        expect(factorize(13n)).toEqual({ "13": 1 });
    });

    it('should correctly factorize composite numbers', () => {
        expect(factorize(4n)).toEqual({ "2": 2 });
        expect(factorize(6n)).toEqual({ "2": 1, "3": 1 });
        expect(factorize(12n)).toEqual({ "2": 2, "3": 1 });
        expect(factorize(100n)).toEqual({ "2": 2, "5": 2 });
    });

    it('should handle larger numbers', () => {
        // 360 = 2^3 * 3^2 * 5^1
        expect(factorize(360n)).toEqual({ "2": 3, "3": 2, "5": 1 });
    });

    it('should handle very large numbers without exponential notation issues', () => {
        // 2^61 - 1 is a Mersenne prime: 2305843009213693951
        const largePrime = 2305843009213693951n;
        expect(factorize(largePrime)).toEqual({ "2305843009213693951": 1 });

        // A large composite number: 1000000000000000000 = 2^18 * 5^18
        // 10^18
        const tenTo18 = 1000000000000000000n;
        expect(factorize(tenTo18)).toEqual({ "2": 18, "5": 18 });
    });
});

describe('collatz', () => {
    it('should return empty array for numbers less than 1', () => {
        expect(collatz(0n)).toEqual([]);
        expect(collatz(-1n)).toEqual([]);
    });

    it('should return correct sequence for 1', () => {
        const result = collatz(1n);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ step: 1, value: 1n, operation: 'initial' });
    });

    it('should return correct sequence for 2', () => {
        // 2 -> 1
        const result = collatz(2n);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ step: 1, value: 2n, operation: 'initial' });
        expect(result[1]).toEqual({ step: 2, value: 1n, operation: 'end' });
    });

    it('should return correct sequence for 3', () => {
        // 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1
        const result = collatz(3n);
        const values = result.map(r => r.value);
        expect(values).toEqual([3n, 10n, 5n, 16n, 8n, 4n, 2n, 1n]);
    });
});

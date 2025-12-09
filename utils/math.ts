
export function factorize(n: bigint): Record<string, number> {
    const factors: Record<string, number> = {};
    if (n < 2n) {
        return factors;
    }

    let d = 2n;
    let temp = n;

    while (d * d <= temp) {
        while (temp % d === 0n) {
            const key = d.toString();
            factors[key] = (factors[key] || 0) + 1;
            temp /= d;
        }
        d++;
    }

    if (temp > 1n) {
        const key = temp.toString();
        factors[key] = (factors[key] || 0) + 1;
    }

    return factors;
}

export type CollatzStep = {
    step: number;
    value: bigint;
    operation: string;
};

export function collatz(n: bigint): CollatzStep[] {
    if (n < 1n) {
        return [];
    }

    let count = 1;
    const steps: CollatzStep[] = [{
        step: count,
        value: n,
        operation: "initial",
    }];

    let current = n;
    while (current !== 1n) {
        let nextValue: bigint;
        if (current % 2n === 0n) {
            nextValue = current / 2n;
        } else {
            nextValue = current * 3n + 1n;
        }

        let operation = "";
        if (nextValue === 1n) {
            operation = "end";
        } else if (current % 2n === 0n) {
            operation = "divide";
        } else {
            operation = "multiply and add";
        }

        count++;
        steps.push({
            step: count,
            value: nextValue,
            operation: operation,
        });
        current = nextValue;
    }
    return steps;
}

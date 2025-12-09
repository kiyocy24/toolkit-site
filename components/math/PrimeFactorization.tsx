
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button"; // Import Button
import { Card, CardBody } from "@nextui-org/react";
import { factorize } from "../../utils/math";

export function PrimeFactorization() {
    const [inputValue, setInputValue] = useState<string>("");
    const [targetValue, setTargetValue] = useState<string>("");

    let n: bigint | null = null;
    let isValid = false;
    try {
        if (targetValue.trim() !== "") {
            n = BigInt(targetValue);
            isValid = n > 1n;
        }
    } catch {
        isValid = false;
    }

    const factors = (isValid && n !== null) ? factorize(n) : {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleCalculate = () => {
        setTargetValue(inputValue);
    }

    const formatFactors = (factors: Record<string, number>) => {
        if (Object.keys(factors).length === 0) return "";
        return Object.entries(factors)
            .map(([base, exponent]) => ({ base: BigInt(base), exponent }))
            .sort((a, b) => {
                if (a.base < b.base) return -1;
                if (a.base > b.base) return 1;
                return 0;
            })
            .map(({ base, exponent }) => {
                if (exponent === 1) return `${base.toString()}`;
                return `${base.toString()}^${exponent}`;
            })
            .join(" × ");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-end">
                <Input
                    label="数値"
                    placeholder="正の整数 (例: 12)"
                    value={inputValue}
                    onChange={handleChange}
                    type="number"
                    min={2}
                    className="flex-grow"
                />
                <Button color="primary" onClick={handleCalculate} size="lg">
                    計算
                </Button>
            </div>
            {isValid && n !== null && (
                <Card>
                    <CardBody>
                        <div className="text-2xl font-mono text-center break-all">
                            {n.toString()} = {formatFactors(factors)}
                        </div>
                    </CardBody>
                </Card>
            )}
            {!isValid && targetValue !== "" && (
                <div className="text-default-500">
                    2以上の整数を入力してください。
                </div>
            )}
        </div>
    );
}

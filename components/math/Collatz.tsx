import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Table, TableBody, TableCell, TableHeader, TableColumn, TableRow } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { collatz, CollatzStep } from "../../utils/math";

const columns = [
    {
        key: "step",
        label: "Step",
    },
    {
        key: "value",
        label: "Value",
    },
    {
        key: "operation",
        label: "Operation",
    }
];

export function Collatz() {
    const [inputValue, setInputValue] = useState<string>("");
    const [targetValue, setTargetValue] = useState<string>("1");

    // Parse input, defaulting to 1 if invalid
    let n: bigint = 1n;
    let isValid = false;
    try {
        if (targetValue.trim() !== "") {
            n = BigInt(targetValue);
            isValid = n >= 1n;
        }
    } catch {
        isValid = false;
    }

    // Get steps only if valid
    const steps: CollatzStep[] = isValid ? collatz(n) : [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleCalculate = () => {
        setTargetValue(inputValue);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-end">
                <Input
                    id="value"
                    type="number"
                    label="数値"
                    placeholder="正の整数"
                    value={inputValue}
                    min={1}
                    onChange={handleChange}
                    size="lg"
                    className="flex-grow"
                />
                <Button color="primary" onClick={handleCalculate} size="lg">
                    計算
                </Button>
            </div>
            {isValid && (
                <Table aria-label="Collatz operation table">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={steps}>
                        {(item) => (
                            <TableRow key={item.step}>
                                <TableCell>
                                    <span className="font-mono">{item.step}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="break-all font-mono">{item.value.toString()}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="break-all font-mono">{item.operation}</span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

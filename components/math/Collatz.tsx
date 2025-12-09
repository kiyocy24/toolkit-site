
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Table, TableBody, TableCell, TableHeader, TableColumn, TableRow } from "@nextui-org/react";
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
    const [value, setValue] = useState<string>("1");

    // Parse input, defaulting to 1 if invalid
    let n: bigint = 1n;
    let isValid = false;
    try {
        if (value.trim() !== "") {
            n = BigInt(value);
            isValid = n >= 1n;
        }
    } catch {
        isValid = false;
    }

    // Get steps only if valid
    const steps: CollatzStep[] = isValid ? collatz(n) : [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return (
        <div className="flex flex-col gap-4">
            <Input
                id="value"
                type="number"
                label="数値"
                placeholder="正の整数"
                value={value}
                min={1}
                onChange={handleChange}
                size="lg"
            />
            {isValid && (
                <Table aria-label="Collatz operation table">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={steps}>
                        {(item) => (
                            <TableRow key={item.step}>
                                <TableCell>{item.step}</TableCell>
                                <TableCell>{item.value.toString()}</TableCell>
                                <TableCell>{item.operation}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

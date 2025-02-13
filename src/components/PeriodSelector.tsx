import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface PeriodSelectorProps {
    selectedPeriod: { type: "year" | "month"; year: number; month?: number };
    setSelectedPeriod: (period: { type: "year" | "month"; year: number; month?: number }) => void;
}

export default function PeriodSelector({ selectedPeriod, setSelectedPeriod }: PeriodSelectorProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex gap-4 mb-4">
            {/* Type Selector (Year / Month) */}
            <Select
                onValueChange={(value) =>
                    setSelectedPeriod({
                        type: value as "year" | "month",
                        year: selectedPeriod.year,
                        month: selectedPeriod.month,
                    })
                }
                value={selectedPeriod.type}
            >
                <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select
                onValueChange={(value) =>
                    setSelectedPeriod({ ...selectedPeriod, year: parseInt(value) })
                }
                value={selectedPeriod.year.toString()}
            >
                <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                    {[...Array(4)].map((_, i) => {
                        const year = currentYear - i;
                        return (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>

            {/* Month Selector (Only if type = month) */}
            {selectedPeriod.type === "month" && (
                <Select
                    onValueChange={(value) =>
                        setSelectedPeriod({ ...selectedPeriod, month: parseInt(value) })
                    }
                    value={selectedPeriod.month?.toString()}
                >
                    <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(12)].map((_, i) => {
                            const monthValue = (i + 1).toString();
                            return (
                                <SelectItem key={monthValue} value={monthValue}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}

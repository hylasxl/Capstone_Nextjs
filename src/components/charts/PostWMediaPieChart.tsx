import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    chartData: { labels: string[]; data: number[]; backgroundColors: string[] } | null;
}

export default function PieChart({ chartData }: PieChartProps) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">Post with Media Rate</h2>
            {chartData ? (
                <Pie
                    data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                data: chartData.data,
                                backgroundColor: chartData.backgroundColors,
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true, plugins: {
                            legend: { position: "top" }, tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        const value = parseFloat(tooltipItem.raw as string);
                                        return `${value.toFixed(2)}%`;
                                    }
                                }
                            }
                        }
                    }}
                />
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )}
        </div>
    );
}
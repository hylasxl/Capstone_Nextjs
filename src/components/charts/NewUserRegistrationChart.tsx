import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UserChartProps {
    chartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[] } | null;
}

export default function UserChart({ chartData }: UserChartProps) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-2/3     mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">New User Registrations</h2>
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { position: "top" } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
                    }}
                />
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )}
        </div>
    );
}


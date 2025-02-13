import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UserChartProps {
    chartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[] } | null;
}

export default function PostChart({ chartData }: UserChartProps) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">Post Statistic</h2>
            {chartData ? (
                <Line
                    data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: "Post",
                                data: chartData.datasets[0].data, // First dataset
                                borderColor: "rgb(75, 192, 192)",
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                tension: 0.3,
                                yAxisID: "y1", // Left Y-axis
                            },
                            {
                                label: "Uploaded Photo",
                                data: chartData.datasets[1]?.data || [], // Second dataset (optional check)
                                borderColor: "rgb(255, 99, 132)",
                                backgroundColor: "rgba(255, 99, 132, 0.2)",
                                tension: 0.3,
                                borderDash: [5, 5], // Dashed line for differentiation
                                yAxisID: "y2", // Right Y-axis
                            }
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: { legend: { position: "top" } },
                        scales: {
                            x: { grid: { display: false } },
                            y1: {
                                type: "linear",
                                position: "left",
                                beginAtZero: true,
                                title: { display: true, text: "Posts" },
                            },
                            y2: {
                                type: "linear",
                                position: "right",
                                beginAtZero: true,
                                title: { display: true, text: "Photo" },
                                grid: { drawOnChartArea: false }, // Prevents overlapping grid lines
                            }
                        },
                    }}
                />
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function DashboardMetric() {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updateImage = () => {
            const timestamp = new Date().getTime();
            const grafanaUrl = `http://localhost:3002/render/d-solo/cecucjreoujuoe/default-dashboard?orgId=1&panelId=1&width=1000&height=500&timezone=browser&from=now-30m&to=now&_t=${timestamp}`;
            setImageUrl(grafanaUrl);
            setLoading(false);
        };

        updateImage();

        const interval = setInterval(updateImage, 10000);

        return () => clearInterval(interval);
    }, []);

    const openGrafanaDashboard = () => {
        window.open(
            "http://localhost:3002/d/cecucjreoujuoe/default-dashboard?orgId=1&from=now-15m&to=now&timezone=browser&viewPanel=panel-1",
            "_blank"
        );
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-center my-4">API Gateway Metrics (30 Minutes)</h1>
            {loading ? (
                <Skeleton className="w-full max-w-[1000px] h-[500px] rounded-lg" />
            ) : (
                <div className="relative w-full max-w-[1000px] h-[500px]">
                    <Image
                        src={imageUrl}
                        alt="Grafana Panel"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg shadow-md"
                        priority
                    />
                </div>
            )}
            <div className="mt-6 text-lg">
                <p><strong>Total Requests (excluding /metrics):</strong> <code>http_requests_total</code></p>
                <p><strong>95th Percentile Request Duration (5 min):</strong> <code>histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))</code></p>
            </div>
            <Button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={openGrafanaDashboard}
            >
                Open Full Dashboard
            </Button>
        </div>
    );
}

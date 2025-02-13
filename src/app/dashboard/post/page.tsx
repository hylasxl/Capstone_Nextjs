"use client"

import { PostService } from "@/services/postService";
import { GetNewPostStatisticRequest, DataTerms, GetMediaStatisticRequest, GetPostWMediaStatisticRequest, ReportedPostData, GetReportedPostRequest } from "@/types/post.type";
import { useEffect, useState } from "react";
import PeriodSelector from "@/components/PeriodSelector";
import PostChart from "@/components/charts/NewPostStatisticChart";
import PieChart from "@/components/charts/PostWMediaPieChart";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";


export default function DashboardPost() {

    const [chartData, setChartData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[] } | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<{ type: "year" | "month"; year: number; month?: number }>({
        type: "year",
        year: 2024,
    });

    const [pieData, setPieData] = useState<{ labels: string[]; data: number[]; backgroundColors: string[] } | null>(null);

    const [reportPage, setReportPage] = useState<number>(1);
    const [reportList, setReportList] = useState<ReportedPostData[]>([]);


    useEffect(() => {
        const fetchStatistic = async () => {
            try {
                const request: GetNewPostStatisticRequest = {
                    RequestAccountID: 6,
                    PeriodLabel: selectedPeriod.type,
                    PeriodYear: selectedPeriod.year,
                    PeriodMonth: selectedPeriod.month ?? 0,
                }

                const response = await PostService.getNewPostStatistic(request);
                const labels: string[] = response.Data.map((item: DataTerms) => item.Label);
                const data: number[] = response.Data.map((item: DataTerms) => item.Count);

                const mediaStatisticRequest: GetMediaStatisticRequest = {
                    RequestAccountID: 6,
                    PeriodLabel: selectedPeriod.type,
                    PeriodYear: selectedPeriod.year,
                    PeriodMonth: selectedPeriod.month ?? 0,
                }

                const mediaStatisticResponse = await PostService.getMediaStatistic(mediaStatisticRequest);
                const secondaryData: number[] = mediaStatisticResponse.Data.map((item: DataTerms) => item.Count);

                const postWMediaRequest: GetPostWMediaStatisticRequest = {
                    RequestAccountID: 6,
                    PeriodLabel: selectedPeriod.type,
                    PeriodYear: selectedPeriod.year,
                    PeriodMonth: selectedPeriod.month ?? 0,
                }

                const postWMediaResponse = await PostService.getPostWMediaStatistic(postWMediaRequest);
                const postWMediaRate = parseFloat((postWMediaResponse.TotalPostWMedias / postWMediaResponse.TotalPosts * 100).toFixed(2));

                setPieData({
                    labels: ["Post with medias", "Post without medias"],
                    data: [postWMediaRate, 100 - postWMediaRate],
                    backgroundColors: ["#4CAF50", "#F44336"]
                })

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Post",
                            data,
                            borderColor: "rgb(75, 192, 192)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            tension: 0.3,
                        },
                        {
                            label: "Uploaded Photo",
                            data: secondaryData,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                            tension: 0.3,
                        }
                    ],
                });

            } catch (error) {
                console.error("Error fetching post statistic data:", error);
            }
        }
        fetchStatistic()
    }, [selectedPeriod])

    useEffect(() => {
        const fetchReport = async () => {
            const request: GetReportedPostRequest = {
                RequestAccountID: 6,
                Page: reportPage,
                PageSize: 10
            }


            const response = await PostService.getReportPost(request);
            setReportList(response.ReportedPosts);
        }
        fetchReport()
    }, [reportPage])

    const getReportResolveText = (text: string): string => {
        switch (text) {
            case "report_pending":
                return "Pending";
            case "report_skipped":
                return "Resolved: Skipped"
            case "delete_post":
                return "Resolved: Delete Post"
            default:
                return "Pending"
        }
    }


    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col gap-6">
            <div className="w-full">
                <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
                <div className="flex gap-2">
                    <div className="w-2/3">
                        <PostChart chartData={chartData}></PostChart>
                    </div>
                    <div className="w-1/3">
                        <PieChart chartData={pieData}></PieChart>
                    </div>
                </div>
            </div>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Reported Posts</h2>
                <Table className="w-full border rounded-lg shadow-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>ID</TableHead>
                            <TableHead>PostID</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            reportList.length > 0 ? (
                                reportList.map((report, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell>{report.ID}</TableCell>
                                        <TableCell>{report.PostID}</TableCell>
                                        <TableCell>{report.Reason}</TableCell>
                                        <TableCell>{getReportResolveText(report.ResolveStatus)}</TableCell>
                                        <TableCell>
                                            <Button
                                                className="mr-10"
                                                disabled={report.ResolveStatus !== "report_pending"}
                                                variant={report.ResolveStatus == "report_pending" ? "outline" : "destructive"}
                                                onClick={() => { }}
                                            >
                                                {report.ResolveStatus == "report_pending" ? "Delete" : "Disabled"}
                                            </Button>
                                            <Button
                                                onClick={() => { }}
                                            >
                                                View Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No Report Found</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => {

                        setReportPage((prev) => Math.max(prev - 1, 1));

                    }} disabled={reportPage == 1}>
                        Previous
                    </Button>
                    <span className="mx-4 text-gray-600">Page {reportPage}</span>
                    <Button variant="outline" disabled={reportList.length < 10} onClick={() => {

                        setReportPage((prev) => prev + 1);

                    }}>
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import {
    GetNewRegisterationDataResponse,
    DataTerms,
    GetUserTypeRequest,
    GetUserTypeResponse,
    GetAccountListRequest,
    GetAccountListResponse,
    AccountRawInfo,
    SearchAccountListRequest,
    ResolveBanUserRequest,
    ReportAccountData,
    GetReportedAccountListRequest
} from "@/types/user.type";
import PeriodSelector from "@/components/PeriodSelector";
import UserChart from "@/components/charts/NewUserRegistrationChart";
import { useWebSocket } from "@/hooks/useWebsocket";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function UserDashboard() {
    const [chartData, setChartData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[] } | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<{ type: "year" | "month"; year: number; month?: number }>({
        type: "year",
        year: 2024,
    });

    const [userStats, setUserStats] = useState<{ total: number; banned: number; deleted: number }>({
        total: 0,
        banned: 0,
        deleted: 0,
    });

    const [activeUsers, setActiveUsers] = useState<number[]>([]);
    const { sendMessage, messages } = useWebSocket();

    const [page, setPage] = useState<number>(1);
    const [searchPage, setSearchPage] = useState<number>(1);
    const [accountList, setAccountList] = useState<AccountRawInfo[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [reportPage, setReportPage] = useState<number>(1);
    const [reportList, setReportList] = useState<ReportAccountData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestData = {
                    RequestAccountID: 6,
                    PeriodLabel: selectedPeriod.type,
                    PeriodYear: selectedPeriod.year,
                    PeriodMonth: selectedPeriod.month ?? 0,
                };

                const response: GetNewRegisterationDataResponse = await UserService.getNewRegisterationData(requestData);

                const labels: string[] = response.Data.map((item: DataTerms) => item.Label);
                const data: number[] = response.Data.map((item: DataTerms) => item.Count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "New Users",
                            data,
                            borderColor: "rgb(75, 192, 192)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            tension: 0.3,
                        }
                    ],
                });

                const statRequest: GetUserTypeRequest = {
                    RequestAccountID: 6
                }

                const statResponse: GetUserTypeResponse = await UserService.countUserType(statRequest);

                setUserStats({
                    total: statResponse.TotalUsers,
                    banned: statResponse.BannedUsers,
                    deleted: statResponse.DeletedUsers
                });

            } catch (error) {
                console.error("Error fetching user registration data:", error);
            }
        };

        fetchData();
    }, [selectedPeriod]);

    useEffect(() => {
        sendMessage({ action: "get_active_users" });

        const interval = setInterval(() => {
            sendMessage({ action: "get_active_users" });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const filteredMessages = messages.filter((msg) => msg.action === "active_users");
        if (filteredMessages.length > 0) {
            setActiveUsers(filteredMessages[filteredMessages.length - 1].active_users || []);
        }
    }, [messages]);

    useEffect(() => {
        const fetchAccounts = async () => {
            if (searchQuery.trim().length === 0) {
                const request: GetAccountListRequest = {
                    RequestID: 6,
                    Page: page,
                    PageSize: 10
                }

                const response: GetAccountListResponse = await UserService.getAccountList(request);
                setAccountList(response.Accounts);
            }
        }

        fetchAccounts();
    }, [page, searchQuery]);

    useEffect(() => {
        const fetchSearchAccount = async () => {
            if (searchQuery.trim().length > 0) {
                const request: SearchAccountListRequest = {
                    Page: searchPage,
                    PageSize: 10,
                    RequestID: 6,
                    QueryString: searchQuery.trim()
                }

                const response = await UserService.searchAccountList(request);
                setAccountList(response.Accounts);
            }
        }

        fetchSearchAccount();
    }, [searchQuery, searchPage]);

    function checkOnline(accountID: number): boolean {
        return activeUsers.includes(accountID);
    }

    async function toggleBanStatus(account: AccountRawInfo) {
        try {
            const updatedAccount = { ...account, IsBanned: !account.IsBanned };

            const request: ResolveBanUserRequest = {
                AccountID: account.AccountID,
                Action: account.IsBanned ? "activate" : "ban"
            }

            await UserService.banUser(request);

            setAccountList((prevList) =>
                prevList.map((acc) =>
                    acc.AccountID === account.AccountID ? updatedAccount : acc
                )
            );

            setUserStats((prev) => ({
                ...prev,
                banned: account.IsBanned ? prev.banned - 1 : prev.banned + 1
            }));


        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    }

    useEffect(() => {
        const fetchReport = async () => {
            const request: GetReportedAccountListRequest = {
                Page: reportPage,
                PageSize: 10,
                RequestAccountID: 6
            }
            const response = await UserService.getReportList(request);
            setReportList(response.Accounts);
            console.log(response.Accounts);
        }
        fetchReport()
    }, [reportPage])

    const toggleReportAction = (index: number) => {
        setReportList((prev) =>
            prev.map((report, i) =>
                i === index
                    ? { ...report, ResolveStatus: report.ResolveStatus === "report_pending" ? "delete_user" : "report_pending" }
                    : report
            )
        );
    };

    const getReportResolveText = (text: string): string => {
        switch (text) {
            case "report_pending":
                return "Pending";
            case "report_skipped":
                return "Resolved: Skipped"
            case "delete_user":
                return "Resolved: Ban User"
            default:
                return "Pending"
        }
    }


    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col gap-6">
            {/* Top Section */}
            <div className="flex gap-6">
                <div className="w-full">
                    <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
                    <UserChart chartData={chartData} />
                </div>


            </div>
            {/* Right - User Stats */}
            <div className="w-full flex  flex flex-row gap-4">
                <div className="w-1/4">
                    <UserStatCard title="Number of users" count={userStats.total} color="bg-blue-500" />
                </div>
                <div className="w-1/4">
                    <UserStatCard title="Online" count={activeUsers.length} color="bg-green-500" percent={(activeUsers.length / userStats.total) * 100} />
                </div>
                <div className="w-1/4">
                    <UserStatCard title="Banned" count={userStats.banned} color="bg-red-500" />
                </div>
                <div className="w-1/4">
                    <UserStatCard title="Deleted" count={userStats.deleted} color="bg-gray-500" />
                </div>
            </div>

            {/* Table Section */}
            <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
                <div className="flex justify-between items-center mb-4">
                    <Input
                        type="text"
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1); // Reset page when search query changes
                            setSearchPage(1); // Reset searchPage when search query changes
                        }}
                        className="w-64"
                    />
                </div>
                <Table className="w-full border rounded-lg shadow-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>ID</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Online</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            accountList.length > 0 ? (
                                accountList.map((account) => (
                                    <TableRow key={account.AccountID} className="hover:bg-gray-50">
                                        <TableCell>{account.AccountID}</TableCell>
                                        <TableCell>{account.Username}</TableCell>
                                        <TableCell>{account.Method.toLocaleUpperCase()}</TableCell>
                                        <TableCell className={account.IsBanned ? "text-red-500" : "text-green-500"}>
                                            {account.IsBanned ? "Banned" : "Active"}
                                        </TableCell>
                                        <TableCell className={checkOnline(account.AccountID) ? "text-green-500" : "text-red-500"}>
                                            {checkOnline(account.AccountID) ? "Online" : "Offline"}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={account.IsBanned ? "outline" : "destructive"}
                                                onClick={() => toggleBanStatus(account)}
                                            >
                                                {account.IsBanned ? "Activate" : "Ban"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No Accounts Found</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => {
                        if (searchQuery.trim().length === 0) {
                            setPage((prev) => Math.max(prev - 1, 1));
                        } else {
                            setSearchPage((prev) => Math.max(prev - 1, 1));
                        }
                    }} disabled={searchQuery.trim().length === 0 ? page === 1 : searchPage === 1}>
                        Previous
                    </Button>
                    <span className="mx-4 text-gray-600">Page {searchQuery.trim().length === 0 ? page : searchPage}</span>
                    <Button variant="outline" disabled={accountList.length < 10} onClick={() => {
                        if (searchQuery.trim().length === 0) {
                            setPage((prev) => prev + 1);
                        } else {
                            setSearchPage((prev) => prev + 1);
                        }
                    }}>
                        Next
                    </Button>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Reported Accounts</h2>
                <Table className="w-full border rounded-lg shadow-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>ID</TableHead>
                            <TableHead>Username</TableHead>
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
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{report.Username}</TableCell>
                                        <TableCell>{report.Reason}</TableCell>
                                        <TableCell>{getReportResolveText(report.ResolveStatus)}</TableCell>
                                        <TableCell>
                                            <Button
                                                disabled={report.ResolveStatus !== "report_pending"}
                                                variant={report.ResolveStatus == "report_pending" ? "outline" : "destructive"}
                                                onClick={() => toggleReportAction(index)}
                                            >
                                                {report.ResolveStatus == "report_pending" ? "Ban" : "Disabled"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No Accounts Found</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => {

                        setReportPage((prev) => Math.max(prev - 1, 1));

                    }} disabled={searchQuery.trim().length === 0 ? page === 1 : searchPage === 1}>
                        Previous
                    </Button>
                    <span className="mx-4 text-gray-600">Page {searchQuery.trim().length === 0 ? page : searchPage}</span>
                    <Button variant="outline" disabled={accountList.length < 10} onClick={() => {

                        setReportPage((prev) => prev + 1);

                    }}>
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
}
export const UserStatCard: React.FC<{
    title: string;
    count: number;
    color: string; // Expected as Tailwind bg color (e.g., "bg-blue-500")
    percent?: number;
}> = ({ title, count, color }) => {

    return (
        <Card className={cn("p-4 w-90 max-w-xs shadow-lg border border-border/40", color, "text-white")}>
            <CardContent className="flex flex-col items-center text-center space-y-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-3xl font-bold">{count}</p>
            </CardContent>
        </Card>
    );
};
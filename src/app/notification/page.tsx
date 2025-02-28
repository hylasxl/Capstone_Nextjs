"use client";

import { useEffect, useState, useRef } from "react";
import { NotificationService } from "@/services/notificationService";
import { useAuth } from "@/hooks/useAuth";
import { MarkNotifcationRead, Notification } from "@/types/notification.type";
import { format } from "date-fns";  // To format date_time

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const pageSize = 30;
    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!user) return;

        const getNoti = async () => {
            setLoading(true);

            const request = {
                account_id: user.id,
                page: page,
                page_size: pageSize,
            };

            try {
                const response = await NotificationService.getNotification(request);

                if (response.notifications.length < pageSize) {
                    setHasMore(false);
                }

                setNotifications((prev) => [...prev, ...response.notifications]); // Append new notifications
            } catch (e) {
                console.error("Error fetching notifications:", e);
            } finally {
                setLoading(false);
            }
        };

        getNoti();
    }, [page, user]);



    // Observe when the bottom of the notifications list is in view
    useEffect(() => {
        if (!loadMoreRef.current) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !loading && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                rootMargin: "200px",
            }
        );

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current && loadMoreRef.current) {
                observer.current.unobserve(loadMoreRef.current);
            }
        };
    }, [loading, hasMore]);

    useEffect(() => {
        if (user == null) return
        const markRead = async () => {
            const request: MarkNotifcationRead = {
                account_id: user.id
            }
            await NotificationService.markRead(request)
        }
        markRead()
    }, [])

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>

            {notifications.length === 0 && !loading && <p>No notifications yet.</p>}

            <ul className="space-y-2">
                {notifications.map((notification) => (
                    <li
                        key={notification.id}
                        className={`p-2 border rounded-md ${notification.is_read ? "bg-gray-200" : "bg-white"}`}
                    >
                        <div className="flex justify-between">
                            <span>{notification.content}</span>
                            <span className="text-sm text-gray-500">
                                {format(new Date(notification.date_time * 1000), "PPPppp")}
                            </span>
                        </div>

                    </li>
                ))}
            </ul>

            {loading && <p>Loading...</p>}

            {/* This div will trigger the observer when it becomes visible */}
            {hasMore && <div ref={loadMoreRef} className="h-10"></div>}
        </div>
    );
}

import { useEffect, useState } from "react";
import WebSocketService from "@/services/webSocketService";

export const useWebSocket = () => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const handleMessage = (message: any) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        WebSocketService.subscribe(handleMessage);

        return () => {
            WebSocketService.unsubscribe(handleMessage);
        };
    }, []);

    return {
        sendMessage: (data: any) => WebSocketService.send(data),
        messages,
    };
};

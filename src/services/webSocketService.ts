class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private eventListeners: ((data: any) => void)[] = [];
    private isConnected = false;
    private userId: number | null = null;

    private constructor() { }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(userId: number) {
        if (this.isConnected || this.socket) return;

        this.userId = userId;
        this.socket = new WebSocket(`ws://192.168.20.129:8080/ws?user_id=${userId}`);

        this.socket.onopen = () => {
            // console.log("✅ WebSocket Connected");
            this.isConnected = true;
            this.send({ action: "get_active_users" }); // Request initial data
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // console.log("📩 WebSocket Message:", message);
            this.eventListeners.forEach((callback) => callback(message));
        };

        this.socket.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        this.socket.onclose = () => {
            console.log("⚠️ WebSocket Disconnected. Reconnecting...");
            this.isConnected = false;
            this.socket = null;
            setTimeout(() => this.connect(userId), 3000); // Auto-reconnect
        };
    }

    send(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    subscribe(callback: (data: any) => void) {
        this.eventListeners.push(callback);
    }

    unsubscribe(callback: (data: any) => void) {
        this.eventListeners = this.eventListeners.filter((cb) => cb !== callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

export default WebSocketService.getInstance();

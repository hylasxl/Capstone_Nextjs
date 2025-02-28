export interface GetNotificationRequest {
    account_id: number,
    page: number,
    page_size: number
}

export interface GetNotificationResponse {
    account_id: number,
    page: number,
    page_size: number,
    notifications: Notification[]
}

export interface Notification {
    id: number,
    content: string,
    date_time: number,
    is_read: boolean
}

export interface MarkNotifcationRead {
    account_id: number
}

export interface MarkNotifcationReadResponse {
    quantity: number,
    success: boolean
}
import { BASE_URL } from "@/utils/constant.utils";
import { NotificationEntityType, NotificationType } from "@/utils/enums.utils";

// 1. Core Data Interfaces
export interface INotificationSender {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
}

export interface INotification {
    _id: string;
    recipient: string;
    sender?: INotificationSender | null;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: NotificationEntityType | null;
    entityId?: string | null;
    link?: string | null;
    isRead: boolean;
    readAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

// 2. Query Params Interface
export interface IGetNotificationsParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: NotificationType;
}

// 3. API Response Interfaces
export interface INotificationListApiResponse {
    status: string;
    message: string;
    data: {
        totalNotifications: number;
        unreadCount: number;
        currentPage: number;
        totalPages: number;
        notifications: INotification[];
    };
}

export interface IUnreadCountApiResponse {
    status: string;
    message: string;
    data: {
        unreadCount: number;
    };
}

export interface INotificationSingleApiResponse {
    status: string;
    message: string;
    data: {
        notification: INotification;
    };
}

export interface IMarkAllReadApiResponse {
    status: string;
    message: string;
    data: {
        modifiedCount: number;
    };
}

export interface IDeleteApiResponse {
    status: string;
    message: string;
    data: null;
}

// 4. Notification Service
export const notificationService = {
    // Get all notifications for current logged-in user with pagination & filtering
    getMyNotifications: async (params?: IGetNotificationsParams) => {
        const searchParams = new URLSearchParams();

        if (params?.page) {
            searchParams.set("page", params.page.toString());
        }

        if (params?.limit) {
            searchParams.set("limit", params.limit.toString());
        }

        if (params?.isRead !== undefined) {
            searchParams.set("isRead", params.isRead.toString());
        }

        if (params?.type?.trim()) {
            searchParams.set("type", params.type.trim());
        }

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/api/notification${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            credentials: "include",
        });

        const data: INotificationListApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching notifications"
            );
        }

        return data;
    },

    // Get count of unread notifications
    getUnreadCount: async () => {
        const response = await fetch(`${BASE_URL}/api/notification/unread-count`, {
            credentials: "include",
        });

        const data: IUnreadCountApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when fetching unread count"
            );
        }

        return data;
    },

    // Mark single notification as read by ID
    markAsRead: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/notification/${id}`, {
            method: "PATCH",
            credentials: "include",
        });

        const data: INotificationSingleApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when marking notification as read"
            );
        }

        return data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await fetch(`${BASE_URL}/api/notification/read-all`, {
            method: "PATCH",
            credentials: "include",
        });

        const data: IMarkAllReadApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when marking all notifications as read"
            );
        }

        return data;
    },

    // Delete single notification by ID
    deleteNotification: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/notification/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when deleting notification"
            );
        }

        return data;
    },

    // Clear all notifications for current user
    clearAllNotifications: async () => {
        const response = await fetch(`${BASE_URL}/api/notification`, {
            method: "DELETE",
            credentials: "include",
        });

        const data: IDeleteApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong when clearing notifications"
            );
        }

        return data;
    },
};
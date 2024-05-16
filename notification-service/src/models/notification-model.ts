export interface NotificationModel {
    notification_id: number;
    order_id: string;
    user_id: string;
    notification_type: string;
    sent_at: string;
  }
  
  export interface CreateNotification extends Omit<NotificationModel, "notification_id" | "sent_at"> {
  }
  
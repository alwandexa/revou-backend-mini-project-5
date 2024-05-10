export interface OrderModel {
  order_id: number;
  user_id: string;
  order_date: string;
  status: string;
}

export interface CreateUserRequest extends Omit<OrderModel, "user_id" | "role"> {}

export interface CreateUserResponse extends Pick<OrderModel, "user_id"> {}
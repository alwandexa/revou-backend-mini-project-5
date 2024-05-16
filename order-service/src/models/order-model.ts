export interface OrderModel {
  order_id: number;
  user_id: string;
  order_date: string;
  status: string;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest
  extends Omit<OrderModel, "order_id" | "price" | "order_date" | "status"> {}

export interface CreateOrderResponse extends Pick<OrderModel, "order_id"> {}

export interface UpdateOrderStatus
  extends Pick<OrderModel, "order_id" | "status"> {}

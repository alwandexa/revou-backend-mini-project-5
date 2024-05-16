export interface InventoryModel {
  product_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export interface CheckStockRequest extends Pick<InventoryModel, "product_id"> {
  amount: number;
}

export interface CheckStockResponse {
  is_enough: boolean;
}

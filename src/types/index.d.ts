export interface Product {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface BillRequestBody {
  customerName: string;
  mobile: string;
  paidAmount: number;
  products: Product[];
}
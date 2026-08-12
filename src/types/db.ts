export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  sub_category: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
}

export type DbOrderStatus =
  | "new"
  | "in_progress"
  | "done"
  | "paid"
  | "cancelled";

export type UiOrderStatus =
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderType = "in-store" | "delivery" | "pickup" | "dine-in";

export interface OrderRow {
  id: string;
  order_number: string;
  status: DbOrderStatus;
  type: OrderType;
  table_id: string | null;
  customer_name: string | null;
  total_price: number;
  created_at: string;
}

export interface OrderItemRow {
  order_id: string;
  quantity: number;
  item_price: number;
  menu_items: { name: string } | null;
}

export interface NormalizedOrderItem {
  order_id: string;
  quantity: number;
  item_price: number;
  menu_name: string | null;
}

export interface Order {
  id: string;
  orderNo: string;
  status: UiOrderStatus;
  customerName: string;
  type: OrderType;
  table: string | null;
  paid: boolean;
  createdAt: number;
  totalPrice: number;
  orderItems: NormalizedOrderItem[];
  itemTitle: string;
}

export interface ReportOrder {
  id: string;
  order_number: string;
  status: DbOrderStatus;
  type: OrderType;
  table_id: string | null;
  customer_name: string | null;
  total_price: number;
  created_at: string;
  totalPrice: number;
  createdAt: number;
}

export interface OrderItemWithJoins {
  quantity: number;
  item_price: number;
  order_id: string;
  menu_items: {
    name: string;
    category: string;
  } | null;
  orders: {
    created_at: string;
  } | null;
}

export type UserRole = "admin" | "staff" | "cashier";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  email?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface AddDrinkPayload {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available: boolean;
}

export interface MenuItemFormData {
  name: string;
  price: string | number;
  category: string;
  image: string;
  description: string;
  available: boolean;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface UpdateUserPayload {
  role?: string;
  is_active?: boolean;
  full_name?: string;
  email?: string;
  password?: string;
}

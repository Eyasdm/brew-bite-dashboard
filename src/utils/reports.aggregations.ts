import type { OrderItemWithJoins, ReportOrder } from "../types";

export interface Stats {
  totalRevenue: number;
  totalOrders: number;
  avgOrder: number;
  activeCustomers: number;
}

export interface DailyOrdersDataPoint {
  day: string;
  orders: number;
  revenue: number;
}

export interface RevenueTrendDataPoint {
  day: string;
  revenue: number;
}

export interface PeakHoursDataPoint {
  hour: string;
  orders: number;
}

export interface CategoryData {
  name: string;
  orders: number;
  revenue: number;
}

export interface ProductData {
  name: string;
  category: string;
  orders: number;
  revenue: number;
}

export interface ProductsDataResult {
  categories: CategoryData[];
  products: ProductData[];
  topProducts: ProductData[];
}

export interface CustomerStatsResult {
  avgOrdersPerCustomer: number;
  returningRate: number;
}

export interface PerformanceStatsResult {
  completionRate: number;
  cancellationRate: number;
  deliveryRate: number;
  totalDeliveries: number;
}

export function buildStats(orders: ReportOrder[]): Stats {
  if (!orders.length) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrder: 0,
      activeCustomers: 0,
    };
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const customers = new Set(orders.map((o) => o.customer_name).filter(Boolean));

  return {
    totalRevenue,
    totalOrders: orders.length,
    avgOrder: totalRevenue / orders.length,
    activeCustomers: customers.size,
  };
}

export function buildDailyOrdersData(orders: ReportOrder[]): DailyOrdersDataPoint[] {
  const map: Record<string, DailyOrdersDataPoint> = {};

  orders.forEach((o) => {
    const day = new Date(o.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!map[day]) map[day] = { day, orders: 0, revenue: 0 };
    map[day].orders += 1;
    map[day].revenue += o.totalPrice || 0;
  });

  return Object.values(map);
}

export function buildRevenueTrendData(orders: ReportOrder[]): RevenueTrendDataPoint[] {
  const map: Record<string, RevenueTrendDataPoint> = {};

  orders.forEach((o) => {
    const day = new Date(o.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!map[day]) map[day] = { day, revenue: 0 };
    map[day].revenue += o.totalPrice || 0;
  });

  return Object.values(map);
}

export function buildPeakHoursData(orders: ReportOrder[]): PeakHoursDataPoint[] {
  const map: Record<string, PeakHoursDataPoint> = {};

  orders.forEach((o) => {
    const hour = new Date(o.createdAt).getHours();
    const label = `${hour}:00`;

    if (!map[label]) map[label] = { hour: label, orders: 0 };
    map[label].orders += 1;
  });

  return Object.values(map).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
}

export function buildProductsData(items: OrderItemWithJoins[]): ProductsDataResult {
  const categoriesMap: Record<string, CategoryData> = {};
  const productsMap: Record<string, ProductData> = {};

  items.forEach((row) => {
    const name = row.menu_items?.name;
    const category = row.menu_items?.category;
    const qty = row.quantity || 0;
    const revenue = qty * (row.item_price || 0);

    if (!name || !category) return;

    if (!categoriesMap[category]) {
      categoriesMap[category] = { name: category, orders: 0, revenue: 0 };
    }
    categoriesMap[category].orders += qty;
    categoriesMap[category].revenue += revenue;

    if (!productsMap[name]) {
      productsMap[name] = { name, category, orders: 0, revenue: 0 };
    }
    productsMap[name].orders += qty;
    productsMap[name].revenue += revenue;
  });

  const categories = Object.values(categoriesMap);
  const products = Object.values(productsMap);

  return {
    categories,
    products,
    topProducts: products.sort((a, b) => b.orders - a.orders).slice(0, 5),
  };
}

export function buildCustomerStats(orders: ReportOrder[]): CustomerStatsResult {
  if (!orders.length) {
    return { avgOrdersPerCustomer: 0, returningRate: 0 };
  }

  const customerOrderCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const name = o.customer_name;
    if (!name) return;
    customerOrderCounts[name] = (customerOrderCounts[name] || 0) + 1;
  });

  const customerList = Object.values(customerOrderCounts);
  const uniqueCustomers = customerList.length;

  if (uniqueCustomers === 0) {
    return { avgOrdersPerCustomer: 0, returningRate: 0 };
  }

  const avgOrdersPerCustomer = orders.length / uniqueCustomers;

  const returning = customerList.filter((count) => count > 1).length;
  const returningRate =
    uniqueCustomers > 0 ? Math.round((returning / uniqueCustomers) * 100) : 0;

  return {
    avgOrdersPerCustomer: Math.round(avgOrdersPerCustomer * 10) / 10,
    returningRate,
  };
}

export function buildPerformanceStats(orders: ReportOrder[]): PerformanceStatsResult {
  if (!orders.length) {
    return {
      completionRate: 0,
      cancellationRate: 0,
      deliveryRate: 0,
      totalDeliveries: 0,
    };
  }

  const delivered = orders.filter((o) => o.status === "paid").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const deliveryOrders = orders.filter((o) => o.type === "delivery").length;

  const completionRate = Math.round((delivered / orders.length) * 100);
  const cancellationRate = Math.round((cancelled / orders.length) * 100);
  const deliveryRate =
    orders.length > 0 ? Math.round((deliveryOrders / orders.length) * 100) : 0;

  return {
    completionRate,
    cancellationRate,
    deliveryRate,
    totalDeliveries: deliveryOrders,
  };
}

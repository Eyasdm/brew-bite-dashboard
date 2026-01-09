export function buildStats(orders) {
  if (!orders.length) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrder: 0,
      activeCustomers: 0,
    };
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const customers = new Set(orders.map((o) => o.customerName).filter(Boolean));

  return {
    totalRevenue,
    totalOrders: orders.length,
    avgOrder: totalRevenue / orders.length,
    activeCustomers: customers.size,
  };
}

export function buildDailyOrdersData(orders) {
  const map = {};

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

export function buildRevenueTrendData(orders) {
  const map = {};

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

export function buildPeakHoursData(orders) {
  const map = {};

  orders.forEach((o) => {
    const hour = new Date(o.createdAt).getHours();
    const label = `${hour}:00`;

    if (!map[label]) map[label] = { hour: label, orders: 0 };
    map[label].orders += 1;
  });

  return Object.values(map).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
}

export function buildProductsData(items) {
  const categoriesMap = {};
  const productsMap = {};

  items.forEach((row) => {
    const name = row.menu_items?.name;
    const category = row.menu_items?.category;
    const qty = row.quantity || 0;
    const revenue = qty * (row.item_price || 0);

    if (!name || !category) return;

    // Category aggregation
    if (!categoriesMap[category]) {
      categoriesMap[category] = {
        name: category,
        orders: 0,
        revenue: 0,
      };
    }
    categoriesMap[category].orders += qty;
    categoriesMap[category].revenue += revenue;

    // Product aggregation
    if (!productsMap[name]) {
      productsMap[name] = {
        name,
        category,
        orders: 0,
        revenue: 0,
      };
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

export function buildCustomerStats(orders) {
  const totalOrders = orders.length;

  const avgOrdersPerCustomer =
    totalOrders === 0 ? 0 : totalOrders / totalOrders;

  const returningRate = totalOrders > 1 ? 87 : 0;

  return {
    avgOrdersPerCustomer,
    returningRate,
    satisfaction: 4.2, // dummy / placeholder
  };
}
export function buildPerformanceStats() {
  return {
    avgPrepTime: 5.2, // minutes
    orderAccuracy: 96.5, // %
    avgDeliveryTime: 10, // minutes
    onTimeDelivery: 92, // %
  };
}

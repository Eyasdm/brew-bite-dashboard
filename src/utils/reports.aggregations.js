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

export function buildCustomerStats(orders) {
  if (!orders.length) {
    return { avgOrdersPerCustomer: 0, returningRate: 0 };
  }

  // Count orders per unique customer name
  const customerOrderCounts = {};
  orders.forEach((o) => {
    const name = o.customerName;
    if (!name) return;
    customerOrderCounts[name] = (customerOrderCounts[name] || 0) + 1;
  });

  const customerList = Object.values(customerOrderCounts);
  const uniqueCustomers = customerList.length;

  if (uniqueCustomers === 0) {
    return { avgOrdersPerCustomer: 0, returningRate: 0 };
  }

  const avgOrdersPerCustomer = orders.length / uniqueCustomers;

  // Returning = customers with more than 1 order
  const returning = customerList.filter((count) => count > 1).length;
  const returningRate =
    uniqueCustomers > 0 ? Math.round((returning / uniqueCustomers) * 100) : 0;

  return {
    avgOrdersPerCustomer: Math.round(avgOrdersPerCustomer * 10) / 10,
    returningRate,
  };
}

export function buildPerformanceStats(orders) {
  if (!orders.length) {
    return {
      avgPrepTime: 0,
      completionRate: 0,
      deliveryRate: 0,
      cancellationRate: 0,
    };
  }

  const delivered = orders.filter((o) => o.status === "delivered").length;
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

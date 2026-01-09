import { buildProductsData } from "../../utils/reports.aggregations";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c"];

export default function ProductsCharts({ items }) {
  const { categories, products, topProducts } = buildProductsData(items);

  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center text-text-muted">
        No product data for selected period
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Donut */}
      <div className="lg:col-span-2 rounded-2xl border bg-card p-4">
        <ProductsDonut
          categories={categories}
          products={products}
          COLORS={COLORS}
        />
      </div>

      {/* Top Products */}
      <div className="rounded-2xl border bg-card p-4">
        <ProductsList products={topProducts} />
      </div>
    </div>
  );
}

function ProductsDonut({ categories, products, COLORS }) {
  return (
    <>
      <h3 className="mb-4 text-sm font-medium">Products by Category</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Categories */}
            <Pie
              data={categories}
              dataKey="orders"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
            >
              {categories.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            {/* Products */}
            <Pie
              data={products}
              dataKey="orders"
              nameKey="name"
              innerRadius={90}
              outerRadius={125}
            >
              {products.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.55}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function ProductsList({ products }) {
  return (
    <>
      <h3 className="mb-4 text-sm font-medium">Top Products</h3>

      <div className="space-y-3">
        {products.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-xl border p-3"
          >
            <div>
              <div className="text-sm font-medium">
                #{i + 1} {p.name}
              </div>
              <div className="text-xs text-text-muted">{p.orders} orders</div>
            </div>

            <div className="text-sm font-semibold text-green-600">
              ${p.revenue.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

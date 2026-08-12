import { useTranslation } from "react-i18next";
import { buildProductsData } from "../../utils/reports.aggregations";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { OrderItemWithJoins } from "../../types";
import type { CategoryData, ProductData } from "../../utils/reports.aggregations";

const COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c"];

interface ProductsChartsProps {
  items: OrderItemWithJoins[];
}

export default function ProductsCharts({ items }: ProductsChartsProps) {
  const { t } = useTranslation();
  const { categories, products, topProducts } = buildProductsData(items);

  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center text-text-muted">
        {t("reports.productsCharts.noData")}
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

interface ProductsDonutProps {
  categories: CategoryData[];
  products: ProductData[];
  COLORS: string[];
}

function ProductsDonut({ categories, products, COLORS }: ProductsDonutProps) {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="mb-4 text-sm font-medium">
        {t("reports.productsCharts.byCategory")}
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Categories */}
            <Pie
              data={categories as unknown as Record<string, unknown>[]}
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
              data={products as unknown as Record<string, unknown>[]}
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

interface ProductsListProps {
  products: ProductData[];
}

function ProductsList({ products }: ProductsListProps) {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="mb-4 text-sm font-medium">
        {t("reports.productsCharts.topProducts")}
      </h3>

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
              <div className="text-xs text-text-muted">
                {t("reports.productsCharts.ordersCount", { count: p.orders })}
              </div>
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

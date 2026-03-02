import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#4e73df","#1cc88a","#36b9cc","#f6c23e",
  "#e74a3b","#858796","#fd7e14","#20c997"
];

export default function FinanceAnalyticsChart({ transactions, meta }) {


  const [selectedType, setSelectedType] = useState("EXPENSE");
  console.log("selectedType:", selectedType);

  /* =============================
     INDIAN FORMATTER
  ==============================*/
  const formatIndian = (value) => {
    if (value >= 10000000) return (value / 10000000).toFixed(1) + "Cr";
    if (value >= 100000) return (value / 100000).toFixed(1) + "L";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K";
    return value;
  };

  /* =============================
     CLASSIFY TRANSACTIONS
  ==============================*/
  const classifiedData = useMemo(() => {
    const incomeCategories = meta?.incomeCategories || [];
    const investmentCategories = meta?.investmentCategories || [];
    const expenseCategories =
      Object.values(meta?.expenseCategories || {}).flat();

    return transactions.map(t => {
      let type = "OTHER";

      if (incomeCategories.includes(t.category)) {
        type = "INCOME";
      } else if (investmentCategories.includes(t.category)) {
        type = "INVESTMENT";
      } else if (expenseCategories.includes(t.category)) {
        type = "EXPENSE";
      }

      return { ...t, transactionType: type };
    });
  }, [transactions, meta]);

  /* =============================
     PIE DATA
  ==============================*/
  const typeData = useMemo(() => {
    const map = {};

    classifiedData.forEach(t => {
      const amount = Number(t.amount);
      if (!amount) return;
      map[t.transactionType] =
        (map[t.transactionType] || 0) + amount;
    });

    return Object.keys(map).map(key => ({
      name: key,
      value: map[key]
    }));
  }, [classifiedData]);

  /* =============================
     BAR DATA
  ==============================*/
  const categoryData = useMemo(() => {
    if (!selectedType) return [];

    const map = {};

    classifiedData
      .filter(t => t.transactionType === selectedType)
      .forEach(t => {
        const amount = Number(t.amount);
        if (!amount) return;

        map[t.category] =
          (map[t.category] || 0) + amount;
      });

    return Object.keys(map).map(key => ({
      name: key,
      value: map[key]
    }));
  }, [classifiedData, selectedType]);

  /* =============================
     DYNAMIC TICKS (SMART SCALE)
  ==============================*/
  const maxValue = Math.max(
    ...categoryData.map(d => d.value),
    0
  );

  const generateTicks = () => {
    if (maxValue < 1000) {
      return Array.from({ length: 6 }, (_, i) => i * 200);
    }

    if (maxValue < 100000) {
      const step = 10000;
      return Array.from(
        { length: Math.ceil(maxValue / step) + 1 },
        (_, i) => i * step
      );
    }

    if (maxValue < 1000000) {
      const step = 50000;
      return Array.from(
        { length: Math.ceil(maxValue / step) + 1 },
        (_, i) => i * step
      );
    }

    const step = 100000;
    return Array.from(
      { length: Math.ceil(maxValue / step) + 1 },
      (_, i) => i * step
    );
  };

  if (!transactions.length) {
    return <p>No data available</p>;
  }

  return (
    <div style={{ display: "flex", gap: "30px", height: "100%" }}>

      {/* LEFT PIE */}
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: "center", marginBottom: 10 }}>
          Transaction Type Breakdown
        </h3>

        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              data={typeData}
              dataKey="value"
              nameKey="name"
              outerRadius={130}
              onClick={(data) => setSelectedType(data.name)}
            >
              {typeData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatIndian(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RIGHT BAR */}
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: "center", marginBottom: 10 }}>
          {selectedType
            ? `${selectedType} Category Breakdown`
            : "Select a segment to view breakdown"}
        </h3>

        {selectedType && (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 13 }}
                tickLine={false}
              />

              <YAxis
                ticks={generateTicks()}
                tickFormatter={formatIndian}
                tick={{ fontSize: 13 }}
                tickLine={false}
                width={70}
              />

              <Tooltip formatter={(value) => formatIndian(value)} />

              <Bar
                dataKey="value"
                fill="#4e73df"
                radius={[6, 6, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
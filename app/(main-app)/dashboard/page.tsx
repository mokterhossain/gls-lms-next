"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= SAFE DATA ================= */

const dataMap: Record<string, any> = {
  "7d": {
    revenue: [30, 45, 28, 60, 75, 50, 90],
    users: [120, 200, 180, 240, 300, 280, 350],
    orders: [12, 18, 14, 25, 30, 22, 40],
  },
  "30d": {
    revenue: [40, 55, 60, 80, 95, 120],
    users: [200, 260, 300, 340, 420, 500],
    orders: [15, 20, 25, 30, 35, 45],
  },
  "90d": {
    revenue: [60, 80, 100, 140, 180, 220],
    users: [300, 380, 420, 500, 580, 650],
    orders: [25, 35, 45, 55, 65, 80],
  },
  "1y": {
    revenue: [80, 100, 140, 180, 220, 260],
    users: [400, 480, 560, 640, 720, 800],
    orders: [30, 40, 55, 70, 85, 100],
  },
};

/* ================= HELPERS ================= */

const buildChart = (arr: number[]) =>
  (arr ?? []).map((v, i) => ({
    name: `P${i + 1}`,
    value: v,
  }));

function calcComparison(current: number[], previous: number[]) {
  const curr = (current ?? []).reduce((a, b) => a + b, 0);
  const prev = (previous ?? []).reduce((a, b) => a + b, 0);

  if (!prev) return { value: "0.0", positive: true };

  const diff = ((curr - prev) / prev) * 100;

  return {
    value: Math.abs(diff).toFixed(1),
    positive: diff >= 0,
  };
}

/* ================= COMPONENT ================= */

export default function DashboardPage() {
  const [range, setRange] =
    useState<"7d" | "30d" | "90d" | "1y">("7d");

  const data = dataMap[range] ?? dataMap["7d"];

  /* previous period (safe fallback) */
  const previous = useMemo(() => {
    if (!data) return dataMap["7d"];

    return {
      revenue: data.revenue.map((v: number) => v * 0.85),
      users: data.users.map((v: number) => v * 0.9),
      orders: data.orders.map((v: number) => v * 0.88),
    };
  }, [range, data]);

  const kpi = {
    revenue: calcComparison(data.revenue, previous.revenue),
    users: calcComparison(data.users, previous.users),
    orders: calcComparison(data.orders, previous.orders),
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Overview
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Real-time business insights
          </p>
        </div>

        {/* RANGE FILTER */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {["7d", "30d", "90d", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className="px-3 py-1 text-xs rounded-full transition"
              style={{
                background:
                  range === r
                    ? "var(--primary)"
                    : "var(--primary-soft)",
                color:
                  range === r ? "#fff" : "var(--primary)",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {[
          { label: "Revenue", data: kpi.revenue },
          { label: "Users", data: kpi.users },
          { label: "Orders", data: kpi.orders },
        ].map((item) => (
          <div
            key={item.label}
            className="p-5 rounded-2xl border shadow-sm"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-sm opacity-70">
              {item.label}
            </p>

            <div className="flex items-center justify-between mt-2">
              <h3 className="text-xl sm:text-2xl font-semibold">
                12,400
              </h3>

              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: item.data.positive
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(239,68,68,0.15)",
                  color: item.data.positive
                    ? "#10b981"
                    : "#ef4444",
                }}
              >
                {item.data.positive ? "▲" : "▼"} {item.data.value}%
              </span>
            </div>

            <div
              className="mt-3 h-1 w-12 rounded-full"
              style={{ background: "var(--primary)" }}
            />
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* REVENUE */}
        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="font-semibold mb-3">Revenue</h3>

          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={buildChart(data.revenue)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* USERS */}
        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="font-semibold mb-3">Users</h3>

          <div className="h-60">
            <ResponsiveContainer>
              <AreaChart data={buildChart(data.users)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary-soft)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDERS */}
        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="font-semibold mb-3">Orders</h3>

          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={buildChart(data.orders)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
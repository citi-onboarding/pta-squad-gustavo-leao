"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { category: "Romance", totalQty: 230 },
  { category: "Tecnologia", totalQty: 310 },
  { category: "História", totalQty: 175 },
  { category: "Ciências", totalQty: 265 },
  { category: "Infantil", totalQty: 140 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Romance: "bar-romance",
  Tecnologia: "bar-tecnologia",
  História: "bar-historia",
  Ciências: "bar-ciencias",
  Infantil: "bar-infantil",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-muted-foreground">
          Quantidade:{" "}
          <span className="font-bold text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};


export function ChartByCategory() {
  return (
    <Card className="w-full">
        <style>{`
        .bar-romance    { fill: hsl(var(--chart-1)); }
        .bar-tecnologia { fill: hsl(var(--chart-2)); }
        .bar-historia   { fill: hsl(var(--chart-3)); }
        .bar-ciencias   { fill: hsl(var(--chart-4)); }
        .bar-infantil   { fill: hsl(var(--chart-5)); }

        .recharts-cartesian-grid-horizontal line {
        stroke: hsl(var(--border));
        stroke-dasharray: 4 4;
        }
        
        .recharts-cartesian-axis-line {
        stroke: hsl(var(--border));
        }

        .recharts-bar-rectangle path {
        transition: transform 0.2s ease;
        transform-origin: bottom;
        }
        .recharts-bar-rectangle:hover path {
        transform: scaleY(1.008);
        }
      `}
      </style>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Livros por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 sm:h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            barCategoryGap="15%" 
            barGap={8}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="category"
              axisLine={true}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              axisLine={true}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              domain={[0, "auto"]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
            <Bar dataKey="totalQty" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.category}
                  className={CATEGORY_COLORS[entry.category]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
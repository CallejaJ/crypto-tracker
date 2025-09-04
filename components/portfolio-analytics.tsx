"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  LucidePieChart,
  BarChart3,
  Activity,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts";

const portfolioPerformanceData = [
  { date: "2024-01-01", value: 35000 },
  { date: "2024-01-15", value: 38500 },
  { date: "2024-02-01", value: 42000 },
  { date: "2024-02-15", value: 39500 },
  { date: "2024-03-01", value: 45000 },
  { date: "2024-03-15", value: 47582 },
];

const diversificationData = [
  { name: "Bitcoin", value: 49.3, color: "#f97316" },
  { name: "Ethereum", value: 39.8, color: "#3b82f6" },
  { name: "Solana", value: 10.9, color: "#8b5cf6" },
];

const performanceMetrics = [
  { period: "24h", change: 12.5, value: "$5,947.29" },
  { period: "7d", change: 8.3, value: "$3,952.19" },
  { period: "30d", change: 36.5, value: "$12,734.85" },
];

const topPerformers = [
  { coin: "ETH", change: 18.3, value: "$18,923.45" },
  { coin: "BTC", change: 5.2, value: "$23,456.78" },
  { coin: "SOL", change: -2.1, value: "$5,202.11" },
];

const riskMetrics = [
  { metric: "Portfolio Beta", value: "1.24", status: "moderate" },
  { metric: "Sharpe Ratio", value: "2.18", status: "good" },
  { metric: "Max Drawdown", value: "15.3%", status: "low" },
  { metric: "Volatility", value: "28.7%", status: "high" },
];

export function PortfolioAnalytics() {
  const getRiskColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Performance Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {performanceMetrics.map((metric) => (
          <Card key={metric.period} className='bg-card'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-card-foreground flex items-center'>
                <Activity className='mr-2 h-4 w-4' />
                {metric.period.toUpperCase()} Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-heading font-black text-card-foreground'>
                {metric.value}
              </div>
              <div className='flex items-center mt-2'>
                {metric.change > 0 ? (
                  <TrendingUp className='h-4 w-4 text-green-500 mr-1' />
                ) : (
                  <TrendingDown className='h-4 w-4 text-red-500 mr-1' />
                )}
                <span
                  className={`text-sm ${
                    metric.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Value Chart */}
      <Card className='bg-card'>
        <CardHeader>
          <CardTitle className='text-xl font-heading font-bold text-card-foreground flex items-center'>
            <BarChart3 className='mr-2 h-5 w-5' />
            Portfolio Value Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={portfolioPerformanceData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis
                  dataKey='date'
                  stroke='#9ca3af'
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  stroke='#9ca3af'
                  tick={{ fill: "#9ca3af" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f9fafb",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Portfolio Value",
                  ]}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#8b5cf6'
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Portfolio Diversification */}
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle className='text-xl font-heading font-bold text-card-foreground flex items-center'>
              <LucidePieChart className='mr-2 h-5 w-5' />
              Portfolio Diversification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsPieChart>
                  <Pie
                    data={diversificationData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {diversificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                    }}
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className='space-y-2 mt-4'>
              {diversificationData.map((item) => (
                <div
                  key={item.name}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: item.color }}
                    />
                    <span className='text-sm text-card-foreground'>
                      {item.name}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-card-foreground'>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle className='text-xl font-heading font-bold text-card-foreground'>
              Performance Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.coin}
                  className='flex items-center justify-between p-3 rounded-lg bg-muted/20'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                      <span className='text-primary-foreground font-bold text-xs'>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <span className='font-heading font-bold text-card-foreground'>
                        {performer.coin}
                      </span>
                      <p className='text-sm text-muted-foreground'>
                        {performer.value}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    {performer.change > 0 ? (
                      <TrendingUp className='h-4 w-4 text-green-500 mr-1' />
                    ) : (
                      <TrendingDown className='h-4 w-4 text-red-500 mr-1' />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        performer.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {performer.change > 0 ? "+" : ""}
                      {performer.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className='bg-card'>
        <CardHeader>
          <CardTitle className='text-xl font-heading font-bold text-card-foreground flex items-center'>
            <Shield className='mr-2 h-5 w-5' />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {riskMetrics.map((risk) => (
              <div
                key={risk.metric}
                className='p-4 rounded-lg bg-muted/20 border border-border'
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>
                    {risk.metric}
                  </span>
                  <Badge
                    className={`${getRiskColor(
                      risk.status
                    )} text-white text-xs`}
                  >
                    {risk.status}
                  </Badge>
                </div>
                <div className='text-lg font-heading font-bold text-card-foreground'>
                  {risk.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

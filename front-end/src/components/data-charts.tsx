"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";

interface CrimeData {
  name: string;
  count: number;
  anomalies: number;
}

interface SeverityData {
  name: string;
  value: number;
  color: string;
}

// Mock data - in a real app, this would come from Supabase
const crimesByType: CrimeData[] = [
  { name: "Theft", count: 45, anomalies: 3 },
  { name: "Assault", count: 28, anomalies: 2 },
  { name: "Vandalism", count: 32, anomalies: 1 },
  { name: "Fraud", count: 19, anomalies: 4 },
  { name: "Burglary", count: 23, anomalies: 2 },
];

const crimesByLocation: CrimeData[] = [
  { name: "Downtown", count: 38, anomalies: 2 },
  { name: "Midtown", count: 29, anomalies: 3 },
  { name: "Uptown", count: 24, anomalies: 1 },
  { name: "Financial District", count: 31, anomalies: 4 },
  { name: "Residential Area", count: 25, anomalies: 2 },
];

const crimesBySeverity: SeverityData[] = [
  { name: "Low", value: 35, color: "#94a3b8" },
  { name: "Medium", value: 45, color: "#3b82f6" },
  { name: "High", value: 20, color: "#ef4444" },
];

const COLORS = ["#94a3b8", "#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function DataCharts() {
  const formatTooltip = (value: number, name: string) => {
    if (name === "anomalies") {
      return [`${value} anomalies`, "Anomalies"];
    }
    return [`${value} incidents`, "Total Incidents"];
  };

  const formatPieLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent: number;
  }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  const formatPieTooltip = (value: number) => {
    return [`${value} incidents`, "Count"];
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Crime Distribution by Type</CardTitle>
          <CardDescription>
            Number of crimes reported by type with anomaly indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crimesByType}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total Incidents" />
                <Bar dataKey="anomalies" fill="#ef4444" name="Anomalies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crime Distribution by Location</CardTitle>
          <CardDescription>
            Number of crimes reported by location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crimesByLocation}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Total Incidents" />
                <Bar dataKey="anomalies" fill="#ef4444" name="Anomalies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crime Severity Distribution</CardTitle>
          <CardDescription>
            Breakdown of crimes by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimesBySeverity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={formatPieLabel}
                >
                  {crimesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatPieTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

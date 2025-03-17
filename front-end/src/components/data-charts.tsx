"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "@/lib/api-client";
import type { ChartDataResponse } from "@/lib/api-types";
import { Skeleton } from "@/components/ui/skeleton";

interface DataChartsProps {
  datasetId: string;
}

function ChartLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

export default function DataCharts({ datasetId }: DataChartsProps) {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<ChartDataResponse | null>(null);
  const [typeData, setTypeData] = useState<ChartDataResponse | null>(null);
  const [timeData, setTimeData] = useState<ChartDataResponse | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRangeParam = {
        startDate: startDate,
        endDate: endDate,
      };

      const [areaResponse, typeResponse, timeResponse] = await Promise.all([
        apiClient.getCrimesByArea(datasetId, dateRangeParam),
        apiClient.getCrimesByType(datasetId, dateRangeParam),
        apiClient.getCrimesByTime(datasetId, dateRangeParam),
      ]);

      setAreaData(areaResponse);
      setTypeData(typeResponse);
      setTimeData(timeResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load chart data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [datasetId, startDate, endDate]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const formatData = (data: ChartDataResponse | null) => {
    if (!data) return [];
    return data.labels.map((label, index) => ({
      name: label.length > 30 ? label.substring(0, 30) + "..." : label,
      value: data.values[index],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">From:</span>
          <Input
            type="date"
            value={startDate}
            min="2024-01-01"
            max="2024-12-31"
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
          <span className="text-sm text-muted-foreground">To:</span>
          <Input
            type="date"
            value={endDate}
            min="2024-01-01"
            max="2024-12-31"
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crimes by Area</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartLoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={formatData(areaData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="h-[520px]">
          <CardHeader>
            <CardTitle>Top Crime Types</CardTitle>
          </CardHeader>
          <CardContent className="h-[520px]">
            {loading ? (
              <ChartLoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatData(typeData)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 160,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={150}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                      // Show full label in tooltip if it was truncated
                      const fullLabel =
                        typeData?.labels[props.payload.index] || name;
                      return [value, fullLabel];
                    }}
                  />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crimes by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartLoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={formatData(timeData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

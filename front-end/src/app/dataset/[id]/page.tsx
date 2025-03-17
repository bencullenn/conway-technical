"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "@/components/data-table";
import DataCharts from "@/components/data-charts";
import DataMap from "@/components/data-map";
import { apiClient } from "@/lib/api-client";
import type { Dataset } from "@/lib/api-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

function DataLoadingSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

export default function DatasetPage() {
  const params = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDataset(params.id as string);
        setDataset(data.dataset);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dataset");
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [params.id]);

  if (loading) {
    return <DataLoadingSkeleton />;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (!dataset) {
    return <div className="p-8">Dataset not found</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{dataset.name}</h1>
        <p className="text-muted-foreground">
          Created on {new Date(dataset.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{dataset.rowCount.toLocaleString()} records</span>
          <span>{dataset.columnCount} columns</span>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <DataTable datasetId={params.id as string} />
        </TabsContent>
        <TabsContent value="charts">
          <DataCharts datasetId={params.id as string} />
        </TabsContent>
        <TabsContent value="map">
          <DataMap datasetId={params.id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

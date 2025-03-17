import { Suspense } from "react";
import FileUpload from "@/components/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/data-table";
import DataCharts from "@/components/data-charts";
import DataMap from "@/components/data-map";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-10 mb-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Data Analyzer
          </h1>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Upload your dataset to visualize patterns and detect anomalies.
          </p>
        </div>

        <FileUpload />
      </div>

      <Suspense fallback={<DataLoadingSkeleton />}>
        <DataVisualization />
      </Suspense>
    </main>
  );
}

function DataVisualization() {
  // In a real app, we would check if a dataset is loaded
  // For demo purposes, we'll always show the visualization components
  const isDataLoaded = true;

  if (!isDataLoaded) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dataset Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Dataset ID: </span>
          <span className="text-sm font-medium">abc123def456</span>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <DataTable />
        </TabsContent>
        <TabsContent value="charts">
          <DataCharts />
        </TabsContent>
        <TabsContent value="map">
          <DataMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DataLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

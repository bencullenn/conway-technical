"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, BarChart, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AnomalyDetectionResponse, AnomalyRecord } from "@/lib/api-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const anomalyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface AnomalyDetectionProps {
  datasetId: string;
}

function LoadingState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 1));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[500px]">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Analyzing Crime Patterns
        </h2>
        <Progress value={progress} className="w-full" />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Detecting spatial and temporal anomalies in crime data...
          </p>
          <p className="text-xs text-muted-foreground">
            This may take up to 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

function StartDetection({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[500px]">
      <div className="text-center space-y-4">
        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Anomaly Detection</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Analyze the dataset to identify locations with unusually high crime
          rates compared to their surrounding areas.
        </p>
      </div>
      <Button onClick={onStart} size="lg">
        <Search className="mr-2 h-4 w-4" />
        Start Analysis
      </Button>
    </div>
  );
}

export default function AnomalyDetection({ datasetId }: AnomalyDetectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnomalyDetectionResponse | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(
    null
  );

  const startDetection = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.detectAnomalies({ datasetId });
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to detect anomalies"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <AlertTriangle className="h-5 w-5 inline-block mr-2" />
        {error}
      </div>
    );
  }

  if (!data) {
    return <StartDetection onStart={startDetection} />;
  }

  // Los Angeles center coordinates
  const center: [number, number] = [34.0522, -118.2437];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Anomaly Map</CardTitle>
            <Badge variant="outline" className="ml-2">
              {data.anomaly_count} anomalies detected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px] rounded-md overflow-hidden">
            <MapContainer
              center={center}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              className="rounded-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.anomalies.map((anomaly) => (
                <Marker
                  key={`${anomaly.id}-${anomaly.lat}-${anomaly.lon}`}
                  position={[anomaly.lat, anomaly.lon]}
                  icon={anomalyIcon}
                  eventHandlers={{
                    click: () => setSelectedAnomaly(anomaly),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">
                        {anomaly.crime_code_desc}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {anomaly.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(anomaly.date_time_occ).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAnomaly ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedAnomaly.crime_code_desc}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedAnomaly.date_time_occ).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAnomaly.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Area</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAnomaly.area_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAnomaly.status_desc}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-md border border-red-200">
                <p className="text-sm font-medium text-red-700">
                  Why is this an anomaly?
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {selectedAnomaly.anomaly_description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">
                    Confidence Score:{" "}
                    {(selectedAnomaly.confidence_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-center">
              <div>
                <MapPin className="h-10 w-10 mx-auto mb-2" />
                <p>Select a point on the map to view anomaly details</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total Records Analyzed
              </p>
              <p className="text-2xl font-semibold">
                {data.total_analyzed.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Anomalies Found</p>
              <p className="text-2xl font-semibold">
                {data.anomaly_count.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Analysis Time</p>
              <p className="text-2xl font-semibold">
                {data.analysis_time_seconds.toFixed(1)}s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

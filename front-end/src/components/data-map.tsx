"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Layers } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// Mock data - in a real app, this would come from Supabase
const crimeData = [
  {
    id: "1",
    date: "2023-01-15",
    type: "Theft",
    location: "Downtown LA",
    lat: 34.0407,
    lng: -118.2468,
    severity: "Medium",
    isAnomaly: false,
  },
  {
    id: "2",
    date: "2023-01-16",
    type: "Assault",
    location: "Hollywood",
    lat: 34.0928,
    lng: -118.3287,
    severity: "High",
    isAnomaly: false,
  },
  {
    id: "3",
    date: "2023-01-17",
    type: "Vandalism",
    location: "Venice Beach",
    lat: 33.985,
    lng: -118.4695,
    severity: "Low",
    isAnomaly: true,
  },
  {
    id: "4",
    date: "2023-01-18",
    type: "Theft",
    location: "Santa Monica",
    lat: 34.0195,
    lng: -118.4912,
    severity: "Medium",
    isAnomaly: false,
  },
  {
    id: "5",
    date: "2023-01-19",
    type: "Fraud",
    location: "Beverly Hills",
    lat: 34.0736,
    lng: -118.4004,
    severity: "High",
    isAnomaly: true,
  },
];

interface DataMapProps {
  datasetId: string;
}

export default function DataMap({ datasetId }: DataMapProps) {
  const [selectedCrime, setSelectedCrime] = useState<
    (typeof crimeData)[0] | null
  >(null);
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);

  // Filter data based on anomaly filter
  const filteredData = showAnomaliesOnly
    ? crimeData.filter((item) => item.isAnomaly)
    : crimeData;

  // Los Angeles center coordinates
  const center: [number, number] = [34.0522, -118.2437];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Crime Map</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={showAnomaliesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {showAnomaliesOnly ? "Showing Anomalies" : "Show Anomalies"}
              </Button>
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" />
                Layers
              </Button>
            </div>
          </div>
          <CardDescription>
            Geographic distribution of reported crimes in Los Angeles
          </CardDescription>
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
              {filteredData.map((crime) => (
                <Marker
                  key={crime.id}
                  position={[crime.lat, crime.lng]}
                  eventHandlers={{
                    click: () => setSelectedCrime(crime),
                  }}
                  icon={
                    crime.isAnomaly
                      ? new L.Icon({
                          iconUrl:
                            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                          shadowUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                          shadowSize: [41, 41],
                        })
                      : new L.Icon.Default()
                  }
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{crime.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {crime.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {crime.date}
                      </p>
                      <Badge
                        variant={
                          crime.severity === "High"
                            ? "destructive"
                            : crime.severity === "Medium"
                            ? "default"
                            : "secondary"
                        }
                        className="mt-2"
                      >
                        {crime.severity}
                      </Badge>
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
          <CardTitle>Crime Details</CardTitle>
          <CardDescription>
            Select a point on the map to see details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedCrime ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedCrime.type}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCrime.date}
                  </p>
                </div>
                {selectedCrime.isAnomaly && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Anomaly
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedCrime.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Severity</p>
                  <Badge
                    variant={
                      selectedCrime.severity === "High"
                        ? "destructive"
                        : selectedCrime.severity === "Medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedCrime.severity}
                  </Badge>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Coordinates</p>
                  <p className="font-medium">
                    {selectedCrime.lat.toFixed(4)},{" "}
                    {selectedCrime.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {selectedCrime.isAnomaly && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200 text-sm">
                  <p className="font-semibold text-red-700 mb-1">
                    Anomaly Detected
                  </p>
                  <p className="text-red-600">
                    This crime shows unusual patterns compared to similar
                    incidents in the area.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-center">
              <div>
                <MapPin className="h-10 w-10 mx-auto mb-2" />
                <p>Select a point on the map to view details</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

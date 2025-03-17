import { NextResponse } from "next/server"
import type { CrimeRecord } from "@/lib/api-types"

// Mock data - in a real app, this would come from your FastAPI backend
const mockCrimeData: CrimeRecord[] = [
  {
    id: "1",
    date: "2023-01-15",
    type: "Theft",
    location: "Downtown",
    lat: 40.7128,
    lng: -74.006,
    severity: "Medium",
    isAnomaly: false,
  },
  {
    id: "2",
    date: "2023-01-16",
    type: "Assault",
    location: "Midtown",
    lat: 40.7549,
    lng: -73.984,
    severity: "High",
    isAnomaly: false,
  },
  {
    id: "3",
    date: "2023-01-17",
    type: "Vandalism",
    location: "Uptown",
    lat: 40.8448,
    lng: -73.8648,
    severity: "Low",
    isAnomaly: true,
  },
  {
    id: "4",
    date: "2023-01-18",
    type: "Theft",
    location: "Downtown",
    lat: 40.7138,
    lng: -74.007,
    severity: "Medium",
    isAnomaly: false,
  },
  {
    id: "5",
    date: "2023-01-19",
    type: "Fraud",
    location: "Financial District",
    lat: 40.7075,
    lng: -74.0113,
    severity: "High",
    isAnomaly: true,
  },
]

export async function GET() {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    dataset: {
      id: "abc123def456",
      name: "NYC Crime Data 2023",
      createdAt: "2023-01-20T12:00:00Z",
      rowCount: 5,
      columnCount: 8,
    },
    records: mockCrimeData,
  })
}

export async function POST(request: Request) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  const body = await request.json()

  // Mock file upload response
  if (body.action === "upload") {
    return NextResponse.json({
      success: true,
      datasetId: "abc123def456",
      message: "Dataset uploaded and processed successfully",
    })
  }

  // Mock anomaly detection response
  if (body.action === "detect-anomalies") {
    const anomalies = mockCrimeData.filter((record) => record.isAnomaly)

    return NextResponse.json({
      success: true,
      anomalyCount: anomalies.length,
      anomalies,
      message: "Anomaly detection completed successfully",
    })
  }

  // Mock chart data response
  if (body.action === "chart-data") {
    if (body.groupBy === "type") {
      return NextResponse.json({
        labels: ["Theft", "Assault", "Vandalism", "Fraud", "Burglary"],
        values: [45, 28, 32, 19, 23],
        anomalyCounts: [3, 2, 1, 4, 2],
      })
    }

    if (body.groupBy === "location") {
      return NextResponse.json({
        labels: ["Downtown", "Midtown", "Uptown", "Financial District", "Residential Area"],
        values: [38, 29, 24, 31, 25],
        anomalyCounts: [2, 3, 1, 4, 2],
      })
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}


import type {
  UploadResponse,
  Dataset,
  DatasetResponse,
  AnomalyDetectionRequest,
  AnomalyDetectionResponse,
  ChartDataRequest,
  ChartDataResponse,
} from "./api-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-fastapi-backend.com"

/**
 * Upload a CSV file to the backend for processing
 */
export async function uploadDataset(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/datasets/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to upload dataset")
  }

  return response.json()
}

/**
 * Get a list of all datasets
 */
export async function getDatasets(): Promise<Dataset[]> {
  const response = await fetch(`${API_BASE_URL}/datasets`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch datasets")
  }

  return response.json()
}

/**
 * Get a specific dataset by ID
 */
export async function getDataset(datasetId: string): Promise<DatasetResponse> {
  const response = await fetch(`${API_BASE_URL}/datasets/${datasetId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch dataset")
  }

  return response.json()
}

/**
 * Run anomaly detection on a dataset
 */
export async function detectAnomalies(request: AnomalyDetectionRequest): Promise<AnomalyDetectionResponse> {
  const response = await fetch(`${API_BASE_URL}/analysis/detect-anomalies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to detect anomalies")
  }

  return response.json()
}

/**
 * Get chart data for visualization
 */
export async function getChartData(request: ChartDataRequest): Promise<ChartDataResponse> {
  const response = await fetch(`${API_BASE_URL}/visualization/chart-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to get chart data")
  }

  return response.json()
}


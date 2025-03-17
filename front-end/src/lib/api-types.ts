export interface UploadResponse {
  success: boolean
  datasetId: string
  message: string
}

// Dataset API
export interface Dataset {
  id: string
  name: string
  createdAt: string
  rowCount: number
  columnCount: number
}

export interface CrimeRecord {
  id: string
  date: string
  type: string
  location: string
  lat: number
  lng: number
  severity: "Low" | "Medium" | "High"
  isAnomaly: boolean
}

export interface DatasetResponse {
  dataset: Dataset
  records: CrimeRecord[]
}

// Analysis API
export interface AnomalyDetectionRequest {
  datasetId: string
  method: "statistical" | "clustering" | "isolation_forest"
  parameters?: Record<string, any>
}

export interface AnomalyDetectionResponse {
  success: boolean;
  anomalyCount: number  any>
}

export interface AnomalyDetectionResponse {
  success: boolean
  anomalyCount: number
  anomalies: CrimeRecord[]
  message: string
}

// Visualization API
export interface ChartDataRequest {
  datasetId: string
  groupBy: string
  metric: string
}

export interface ChartDataResponse {
  labels: string[]
  values: number[]
  anomalyCounts?: number[]
}


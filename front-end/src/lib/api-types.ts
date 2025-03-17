export interface UploadResponse {
  success: boolean;
  datasetId: string;
  message: string;
}

// Dataset API
export interface Dataset {
  id: string;
  name: string;
  createdAt: string;
  rowCount: number;
  columnCount: number;
}

export interface CrimeRecord {
  id: string;
  date: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  severity: "Low" | "Medium" | "High";
  isAnomaly: boolean;
}

export interface DatasetResponse {
  dataset: Dataset;
  records: CrimeRecord[];
}

// Analysis API
export interface AnomalyDetectionRequest {
  datasetId: string;
}

export interface AnomalyRecord {
  id: number;
  date_time_occ: string;
  crime_code_desc: string;
  location: string;
  area_name: string;
  status_desc: string;
  lat: number;
  lon: number;
  anomaly_description: string;
  confidence_score: number;
}

export interface AnomalyDetectionResponse {
  anomalies: AnomalyRecord[];
  total_analyzed: number;
  analysis_time_seconds: number;
  anomaly_count: number;
}

// Visualization API
export interface ChartDataRequest {
  datasetId: string;
  groupBy: string;
  metric: string;
}

export interface ChartDataResponse {
  labels: string[];
  values: number[];
  anomalyCounts?: number[];
}

export interface Crime {
  id: number;
  date_time_occ: string;
  crime_code_desc: string;
  location: string;
  area_name: string;
  status_desc: string;
  lat: number | null;
  lon: number | null;
  part_1: boolean;
}

export interface CrimesResponse {
  data: Crime[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface GetCrimesParams {
  datasetId: string;
  page: number;
  page_size: number;
  search?: string;
  start_date: string;
  end_date: string;
}

import type {
  UploadResponse,
  Dataset,
  DatasetResponse,
  AnomalyDetectionRequest,
  AnomalyDetectionResponse,
  ChartDataRequest,
  ChartDataResponse,
} from "./api-types";
import { env } from "@/config/env";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers =
      options.body instanceof FormData
        ? options.headers // Don't set Content-Type for FormData
        : {
            "Content-Type": "application/json",
            ...options.headers,
          };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error message from the response
      const errorMessage =
        data.detail || data.message || "An unknown error occurred";
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Upload a CSV file to the backend for processing
   */
  async uploadDataset(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request("/upload-dataset", {
      method: "POST",
      body: formData,
    });
  }

  /**
   * Get a list of all datasets
   */
  async getDatasets(): Promise<Dataset[]> {
    return this.request("/datasets");
  }

  /**
   * Get a specific dataset by ID
   */
  async getDataset(datasetId: string): Promise<DatasetResponse> {
    return this.request(`/datasets/${datasetId}`);
  }

  /**
   * Run anomaly detection on a dataset
   */
  async detectAnomalies(
    request: AnomalyDetectionRequest
  ): Promise<AnomalyDetectionResponse> {
    return this.request("/analysis/detect-anomalies", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Get chart data for visualization
   */
  async getChartData(request: ChartDataRequest): Promise<ChartDataResponse> {
    return this.request("/visualization/chart-data", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

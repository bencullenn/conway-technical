"use client";

import type React from "react";

import { useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if file is CSV
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast.error("Please upload a CSV file");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    try {
      await apiClient.uploadDataset(file);

      clearInterval(interval);
      setProgress(100);

      toast.success("Your data is being processed");

      // Simulate redirect or state update after processing
      setTimeout(() => {
        setUploading(false);
        setFile(null);
        setProgress(0);
        // Call the onUploadSuccess callback if provided
        onUploadSuccess?.();
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setUploading(false);

      // Display the specific error message from the backend
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload file";
      toast.error(errorMessage);

      // Reset file state on error
      setFile(null);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-12 w-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading
                ? "border-muted-foreground/25 cursor-not-allowed"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() =>
              !uploading && document.getElementById("file-upload")?.click()
            }
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              {file ? file.name : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {file && !uploading && (
            <Button className="w-full" onClick={handleUpload} disabled={!file}>
              <FileUp className="mr-2 h-4 w-4" />
              Process Dataset
            </Button>
          )}

          {uploading && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">
                {progress < 100 ? "Uploading..." : "Processing..."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

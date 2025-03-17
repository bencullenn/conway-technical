"use client";
import FileUpload from "@/components/file-upload";

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
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import type { Crime } from "@/lib/api-types";

interface DataTableProps {
  datasetId: string;
}

export default function DataTable({ datasetId }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const fetchCrimes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCrimes({
        datasetId,
        page,
        page_size: 10,
        search: searchTerm,
        start_date: startDate,
        end_date: endDate,
      });

      setCrimes(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Error fetching crimes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, [page, searchTerm, startDate, endDate, datasetId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by type or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">From:</span>
            <Input
              type="date"
              value={startDate}
              min="2024-01-01"
              max="2024-12-31"
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-auto"
            />
            <span className="text-sm text-muted-foreground">To:</span>
            <Input
              type="date"
              value={endDate}
              min="2024-01-01"
              max="2024-12-31"
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-auto"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : crimes.length > 0 ? (
              crimes.map((crime) => (
                <TableRow key={crime.id}>
                  <TableCell>
                    {new Date(crime.date_time_occ).toLocaleString()}
                  </TableCell>
                  <TableCell>{crime.crime_code_desc}</TableCell>
                  <TableCell>{crime.location}</TableCell>
                  <TableCell>{crime.area_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{crime.status_desc}</Badge>
                  </TableCell>
                  <TableCell>
                    {crime.part_1 && (
                      <Badge variant="destructive">Part 1</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

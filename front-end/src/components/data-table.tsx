"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AlertTriangle } from "lucide-react"

// Mock data - in a real app, this would come from Supabase
const mockData = [
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

export default function DataTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false)

  // Filter data based on search term and anomaly filter
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (showAnomaliesOnly) {
      return matchesSearch && item.isAnomaly
    }

    return matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by type or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAnomaliesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
            className="whitespace-nowrap"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {showAnomaliesOnly ? "Showing Anomalies" : "Show Anomalies"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Filter by Date</DropdownMenuItem>
              <DropdownMenuItem>Filter by Type</DropdownMenuItem>
              <DropdownMenuItem>Filter by Location</DropdownMenuItem>
              <DropdownMenuItem>Filter by Severity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id} className={row.isAnomaly ? "bg-red-50" : ""}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.severity === "High" ? "destructive" : row.severity === "Medium" ? "default" : "secondary"
                      }
                    >
                      {row.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.isAnomaly && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Anomaly
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


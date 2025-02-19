"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DataUpload = () => {
  const [psrFile, setPsrFile] = useState(null);
  const [channelMappingFile, setChannelMappingFile] = useState(null);
  const [storeMappingFile, setStoreMappingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file && !file.name.endsWith(".csv")) {
      setError("Only .csv files are allowed.");
      return;
    }
    setError("");
    setFile(file);
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/uploads`);
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data);
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("uploadType", type);
    formData.append("uploadedBy", "Admin"); // You can replace this with the logged-in user's name

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Upload successful!");
        fetchUploadedFiles(); // Refresh uploaded files
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="space-y-6 px-16 py-2">
      <h1 className="text-center text-2xl font-bold">
        Upload Analytics Data Here
      </h1>

      {/* PSR Data Upload */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload PSR Data CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, setPsrFile)}
          />
          <Button
            onClick={() => handleUpload(psrFile, "sales")}
            disabled={!psrFile || loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>

      {/* Channel Mapping File Upload */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload Channel Mapping File CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, setChannelMappingFile)}
          />
          <Button
            onClick={() => handleUpload(channelMappingFile, "channel_mapping")}
            disabled={!channelMappingFile || loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>

      {/* Store Mapping File Upload */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload Store Mapping File CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, setStoreMappingFile)}
          />
          <Button
            onClick={() => handleUpload(storeMappingFile, "store_mapping")}
            disabled={!storeMappingFile || loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.file_name}</TableCell>
                    <TableCell>{file.upload_type}</TableCell>
                    <TableCell>
                      {formatDate(new Date(file.upload_date))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataUpload;

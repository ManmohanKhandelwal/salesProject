"use client";

import { useState } from "react";
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
  const [mappingFile, setMappingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(""); // Error state

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
    setError(""); // Clear error
    setFile(file);
  };

  const handleUpload = (file, type) => {
    if (file) {
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, type, date: formatDate(new Date()) },
      ]);
    }
  };

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
          <div className="flex justify-center items-center">
            <Input
              type="file"
              accept=".csv"
              className="text-center"
              onChange={(e) => handleFileChange(e, setPsrFile)}
            />
          </div>
          <Button
            onClick={() => handleUpload(psrFile, "PSR Data")}
            disabled={!psrFile}
          >
            Upload
          </Button>
        </CardContent>
      </Card>

      {/* Mapping File Upload */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload Mapping File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center">
            <Input
              type="file"
              accept=".csv"
              className="text-center"
              onChange={(e) => handleFileChange(e, setMappingFile)}
            />
          </div>
          <Button
            onClick={() => handleUpload(mappingFile, "Mapping File")}
            disabled={!mappingFile}
          >
            Upload
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
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{file.date}</TableCell>
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

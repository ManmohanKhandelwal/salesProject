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
import { backEndURL } from "@/lib/utils";

const DataUpload = () => {
  const [psrFile, setPsrFile] = useState(null);
  const [channelMappingFile, setChannelMappingFile] = useState(null);
  const [storeMappingFile, setStoreMappingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(backEndURL("/uploads"));
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
    formData.append("file", file);
    formData.append("fileType", type);
    formData.append("uploadedBy", "Admin"); // You can replace this with the logged-in user's name

    try {
      const response = await fetch(backEndURL("/upload/psr-data"), {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
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

  const downloadTemplate = (templateType) => {
    const templates = {
      psr_data: `document_no,document_date,subbrandform_name,customer_name,customer_code,channel_description,customer_type,category,brand,brandform,retailing
  123456,2025-03-20,ExampleSubbrand,John Doe,987654,Online,VIP,Beverages,CocaCola,Classic,100.50
  `,
      channel_mapping: `customer_type,channel,broad_channel,short_channel
  Individual,Retail,General Trade,GT
  `,
      store_mapping: `Old_Store_Code,New_Store_Code,New_Branch,DSE_Code,ZM,SM,BE,STL
  S123,N456,MainBranch,DSE0,ZM1,SM2,BE3,STL4
  `,
    };

    const blob = new Blob([templates[templateType]], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${templateType}_template.csv`;
    link.click();
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
          <div className="flex space-x-3">
            <Button
              onClick={() => handleUpload(psrFile, "psr_data")}
              disabled={!psrFile || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
            <Button onClick={() => downloadTemplate("psr_data")}>
              Download Template
            </Button>
          </div>
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
          <div className="flex space-x-3">
            <Button
              onClick={() =>
                handleUpload(channelMappingFile, "channel_mapping")
              }
              disabled={!channelMappingFile || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
            <Button onClick={() => downloadTemplate("channel_mapping")}>
              Download Template
            </Button>
          </div>
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
          <div className="flex space-x-3">
            <Button
              onClick={() => handleUpload(storeMappingFile, "store_mapping")}
              disabled={!storeMappingFile || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
            <Button onClick={() => downloadTemplate("store_mapping")}>
              Download Template
            </Button>
          </div>
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

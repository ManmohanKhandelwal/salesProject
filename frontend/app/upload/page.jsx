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
  const [fileTypeToMerge, setFileTypeToMerge] = useState("psr_data");

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
      const response = await fetch(backEndURL("/temp-table-csvfiles"));
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
    formData.append("enctype", "multipart/form-data");
    formData.append("uploadedBy", "Admin"); // You can replace this with the logged-in user's name

    try {
      const response = await fetch(backEndURL("/upload/new-csv-data"), {
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
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Last Modified At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file, index) => (
                  <TableRow key={index}>
                    {/* ✅ Old Commented Section (Uncomment if needed) */}
                    {/* <TableCell>{file.file_name}</TableCell>
      <TableCell>{file.upload_type}</TableCell>
      <TableCell>{formatDate(new Date(file.upload_date))}</TableCell> */}

                    {/* ✅ New Detailed File Info */}
                    <TableCell>{file.fileName}</TableCell>
                    <TableCell>{file.fileSize}</TableCell>
                    <TableCell>{file.uploadedAt}</TableCell>
                    <TableCell>{file.lastModified}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            fetch(backEndURL(`/delete-temp-table-csvfiles`), {
                              method: "POST",
                              body: JSON.stringify({ jobId: file.jobId }),
                              headers: { "Content-Type": "application/json" },
                            }).then((res) => {
                              if (res.ok) {
                                alert("File deleted successfully!");
                                fetchUploadedFiles();
                              } else {
                                alert("Failed to delete file.");
                              }
                            });
                          }
                        }}
                      >
                        🗑️ DELETE
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          fetch(backEndURL(`/download-uploaded-file`), {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              jobId: file.jobId,
                              fileName: file.fileName,
                            }),
                          })
                            .then((res) => {
                              if (res.ok) {
                                alert("File downloaded successfully!");
                                return res.blob(); // Convert response to a blob
                              } else {
                                throw new Error("Failed to download file.");
                              }
                            })
                            .then((blob) => {
                              // Create a link to download the file
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = file.fileName; // Set the filename for download
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                            })
                            .catch((error) => {
                              alert(error.message);
                            });
                        }}
                      >
                        DOWNLOAD ⤵️
                      </Button>
                    </TableCell>
                    <TableCell>
                        <select
                         name="tableType"
                          id="tableType"
                          className="p-2 border border-gray-300 rounded-md"
                          value={fileTypeToMerge}
                          onChange={(e) => setFileTypeToMerge(e.target.value)}
                        >
                          <option value="psr_data" >PSR Data</option>
                          <option value="channel_mapping">Channel Mapping</option>
                          <option value="store_mapping">Store Mapping</option>
                        </select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            const url = fileTypeToMerge === "psr_data"
                              ? "/update/psr-data-table" : "/update/mappings-table";
                            fetch(backEndURL(url), {
                              method: "POST",
                              body: JSON.stringify({ jobId: file.jobId, tableType: fileTypeToMerge }),
                              headers: { "Content-Type": "application/json" },
                            }).then((res) => {
                              if (res.ok) {
                                alert(res?.message || "File Merged successfully!");
                                fetchUploadedFiles();
                              } else {
                                alert(res?.message || "Failed to Merge file.");
                              }
                            });
                          }
                        }}
                      >
                        PUSH ⤴️
                      </Button>
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

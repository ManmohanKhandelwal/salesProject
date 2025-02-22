import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } }; // Prevent body parsing for uploads

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {
    const response = await fetch("http://localhost:5000/upload/psr_data", {
      method: "POST",
      body: req.body, // Stream body directly
      headers: {
        "Content-Type": req.headers.get("content-type"),
      },
      duplex: "half", // ✅ Required for streamed requests
    });

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error.message);
    return new NextResponse(
      JSON.stringify({ message: "Upload forwarding failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

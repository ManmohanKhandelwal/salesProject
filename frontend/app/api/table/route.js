import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const tableName = searchParams.get("tableName") || "";

  try {
    // const { tableName } = req?.query;
    if (process.env.NODE_ENV === "development") {
      const response = await fetch("http://localhost:5000/table-meta-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName: tableName || "" }),
      });

      if (!response.ok) throw new Error(`Failed to fetch Store data`);
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({
        message: "Store API is disabled in production",
      });
    }
  } catch (error) {
    console.error("Error fetching Store data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

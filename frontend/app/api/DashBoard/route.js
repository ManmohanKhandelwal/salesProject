import { DashboardInitialData } from "@/constants/dashBoardData";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to the dashboard route.
 *
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} - The response containing the initial dashboard data.
 */
export async function POST(req) {
  const body  = await req.json();
  console.log("POST request body:");
  return NextResponse.json(DashboardInitialData);
}

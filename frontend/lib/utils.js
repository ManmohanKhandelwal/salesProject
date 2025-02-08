import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default async function fetchDashBoardData(selectedFilters) {
  try {
    const res = await fetch("/api/DashBoard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedFilters),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
}

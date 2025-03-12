import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default async function fetchDashBoardData(selectedFilters) {
  try {
    const res = await fetch("/api/dashboard", {
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

//Fetch Relative URL in Development and Absolute URL in Production
export function backEndURL(path='') {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:5000${path}`
    : NEXT_PUBLIC_API_BASE_URL + path;
}

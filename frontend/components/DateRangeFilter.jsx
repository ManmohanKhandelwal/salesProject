"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

const DateRangeFilter = ({ name }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (selectedDate) => {
    // Toggle between selecting start and end dates
    if (!dateRange.startDate || dateRange.endDate) {
      setDateRange({ startDate: selectedDate, endDate: null });
    } else {
      setDateRange({ ...dateRange, endDate: selectedDate });
    }
  };

  const handleReset = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  const formatDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return "All Time";
    if (dateRange.startDate && !dateRange.endDate)
      return `From ${format(dateRange.startDate, "MMM dd, yyyy")}`;
    if (dateRange.startDate && dateRange.endDate)
      return `${format(dateRange.startDate, "MMM dd, yyyy")} - ${format(
        dateRange.endDate,
        "MMM dd, yyyy"
      )}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {formatDateRange()}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Select {name}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="flex flex-col space-y-4">
          <Calendar
            selected={dateRange.startDate || dateRange.endDate}
            onSelect={handleDateChange}
            mode="single"
            className="border rounded-lg"
          />
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset to All Time
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateRangeFilter;

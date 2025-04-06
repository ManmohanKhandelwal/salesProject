"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

const DateRangeDropdownFilterStorePage = ({ name, filterKey, selectedFilters, setSelectedFilters }) => {
  const defaultRange = selectedFilters[filterKey] || { from: "", to: "" };

  const handleChange = (key, value) => {
    const updated = { ...defaultRange, [key]: value }; // update `from` or `to`
  
    setSelectedFilters((prev) => ({
      ...prev,
      dateRange: {
        from: updated.from ? format(new Date(updated.from), "yyyy-MM-dd") : "",
        to: updated.to ? format(new Date(updated.to), "yyyy-MM-dd") : "",
      },
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <p>{name}</p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-4 space-y-3">
        <DropdownMenuLabel>Select {name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-2">
          <div>
            <label className="text-sm">From:</label>
            <input
              type="date"
              value={defaultRange.from}
              onChange={(e) => handleChange("from", e.target.value)}
              className="w-full border rounded p-2 text-sm text-black"
            />
          </div>

          <div>
            <label className="text-sm">To:</label>
            <input
              type="date"
              value={defaultRange.to}
              onChange={(e) => handleChange("to", e.target.value)}
              className="w-full border rounded p-2 text-sm text-black"
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateRangeDropdownFilterStorePage;

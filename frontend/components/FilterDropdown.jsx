"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FilterDropdown = ({ filter, name }) => {
  const [selectedBranches, setSelectedBranches] = useState(
    filter.map((item) => item.id) // Default
  );

  const handleSelect = (branchId) => {
    if (branchId === "all") {
      // Handle "All" selection
      if (selectedBranches.includes("all")) {
        setSelectedBranches([]); // Unselect all
      } else {
        setSelectedBranches(filter.map((item) => item.id)); // Select all
      }
    } else {
      // Handle individual branch selection
      setSelectedBranches((prev) => {
        const updatedSelection = prev.includes(branchId)
          ? prev.filter((id) => id !== branchId) // Remove branch
          : [...prev, branchId]; // Add branch

        // Automatically select "All" if all items are selected
        if (
          updatedSelection.length === filter.length - 1 &&
          !updatedSelection.includes("all")
        ) {
          return [...updatedSelection, "all"];
        }

        // Remove "All" if any individual item is deselected
        if (updatedSelection.includes("all") && branchId !== "all") {
          return updatedSelection.filter((id) => id !== "all");
        }

        return updatedSelection;
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <p>{name}</p>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select {name}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {filter.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={selectedBranches.includes(item.id)}
            onCheckedChange={() => handleSelect(item.id)}
          >
            {item.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";
// import { useState } from "react";
// import { ScrollArea } from "./ui/scroll-area";

// const FilterDropdown = ({ filter, name }) => {
//   const [selectedBranches, setSelectedBranches] = useState(
//     filter.map((item) => item.id) // Initially, select all items
//   );

//   const handleSelect = (branchId) => {
//     if (branchId === "all") {
//       // Handle "All" selection
//       if (selectedBranches.length === filter.length) {
//         setSelectedBranches([]); // Deselect all
//       } else {
//         setSelectedBranches(filter.map((item) => item.id)); // Select all
//       }
//     } else {
//       setSelectedBranches((prev) => {
//         if (prev.length === filter.length) {
//           // Deselect all and select only the current item if all are selected
//           return [branchId];
//         }

//         const updatedSelection = prev.includes(branchId)
//           ? prev.filter((id) => id !== branchId) // Deselect the item
//           : [...prev, branchId]; // Select the item

//         // Automatically select "All" if all individual items are selected
//         return updatedSelection.length === filter.length
//           ? filter.map((item) => item.id)
//           : updatedSelection;
//       });
//     }
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">
//           <p>{name}</p>
//           <ChevronDown />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="w-56">
//         <DropdownMenuLabel>Select {name}</DropdownMenuLabel>

//         <DropdownMenuSeparator />

//         <ScrollArea className="h-72">
//           {filter.map((item) => (
//             <DropdownMenuCheckboxItem
//               key={item.id}
//               checked={selectedBranches.includes(item.id)}
//               onCheckedChange={() => handleSelect(item.id)}
//             >
//               {item.title}
//               {/* {item["New Branch"]} */}
//             </DropdownMenuCheckboxItem>
//           ))}
//         </ScrollArea>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export default FilterDropdown;
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
import { useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";

const FilterDropdown = ({
  filter,
  name,
  filterKey,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleSelection = (id) => {
    setSelectedFilters((prevFilters) => {
      const currentSelection = prevFilters[filterKey] || [];

      if (id === "all") {
        // If "all" is already selected, deselect everything; otherwise, select all items
        const allSelected = currentSelection.length === filter.length;
        return {
          ...prevFilters,
          [filterKey]: allSelected ? [] : filter.map((item) => item.id),
        };
      } else {
        // Toggle individual item selection
        const updatedSelection = currentSelection.includes(id)
          ? currentSelection.filter((b) => b !== id) // Remove if exists
          : [...currentSelection, id]; // Add if not exists

        return { ...prevFilters, [filterKey]: updatedSelection };
      }
    });
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

        <ScrollArea className="h-72">
          {filter.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedFilters[filterKey]?.includes(item.id) || false}
              onSelect={() => handleSelection(item.id)}
            >
              {item.title}
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;

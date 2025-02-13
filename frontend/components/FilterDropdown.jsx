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

// export default FilterDropdown;"use client";

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
import { ScrollArea } from "./ui/scroll-area";

const FilterDropdown = ({
  filter,
  name,
  filterKey,
  selectedFilters,
  setSelectedFilters,
}) => {
  // Get the selected values for this specific filter category (e.g., years, months)
  const selectedItems = selectedFilters[filterKey] || ["all"];

  const handleSelection = (id) => {
    setSelectedFilters((prevFilters) => {
      let updatedSelection;

      if (id === "all") {
        // If "All" is selected, reset the selection to only "All"
        updatedSelection = ["all"];
      } else {
        // If an item is selected, remove "All" and toggle selection
        updatedSelection = selectedItems.includes(id)
          ? selectedItems.filter((item) => item !== id) // Deselect
          : [...selectedItems.filter((item) => item !== "all"), id]; // Select and remove "All"

        // If all individual items are selected, replace with "All"
        if (updatedSelection.length === filter.length) {
          updatedSelection = ["all"];
        }
      }

      console.log(`${filterKey} Selected:`, updatedSelection); // Log selected items

      return { ...prevFilters, [filterKey]: updatedSelection };
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
          {/* Individual Options */}
          {filter.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.title}
              checked={selectedItems.includes(item.title)}
              onCheckedChange={() => handleSelection(item.title)}
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

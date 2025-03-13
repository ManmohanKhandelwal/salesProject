import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

const BrandFormStats = ({ TopTenBrandForm }) => {
  const getBackgroundStyle = (index) => {
    if (index === 0)
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700"; // Gold
    if (index === 1)
      return "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-600"; // Silver
    if (index === 2)
      return "bg-gradient-to-r from-amber-700 to-amber-800 dark:from-amber-900 dark:to-amber-950"; // Bronze
    return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"; // Default
  };

  return (
    <div className="w-full p-6">
      <ScrollArea className="h-[470px] pb-2">
        <div className="flex flex-col gap-4 items-center">
          {TopTenBrandForm.map((brandFormDetails, index) => {
            const [isHovered, setIsHovered] = useState(false);

            return (
              <div
                key={index}
                className={`w-full max-w-md p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex justify-between items-center ${getBackgroundStyle(
                  index
                )} border border-gray-200 dark:border-gray-700`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="w-full flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {brandFormDetails.brandform}
                  </h3>
                  <p className="text-md md:text-lg font-medium text-gray-800 dark:text-gray-300">
                    Retailing: ₹{" "}
                    {isHovered
                      ? brandFormDetails.totalRetailing.toLocaleString()
                      : `${(brandFormDetails.totalRetailing / 10000000).toFixed(
                          2
                        )} Cr`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BrandFormStats;

import { BadgeIndianRupee } from "lucide-react";
import { useState } from "react";

const SummaryCard = ({ title, data }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="w-full px-5 py-4 rounded-xl border transition-all duration-300 
      bg-gradient-to-br from-[#F3E8FF] to-[#E0F2FF] dark:from-gray-800 dark:to-gray-900
      hover:scale-[1.03] shadow-md dark:shadow-neonBlue border-gray-300 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/50 dark:bg-blue-500 p-3 rounded-xl text-blue-700 dark:text-white shadow-md">
            <BadgeIndianRupee size={20} />
          </div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}{" "}
            <span className="text-gray-600 dark:text-gray-400">
              {!isHovered && "(in CR)"}
            </span>
          </h1>
        </div>

        <div className="flex items-center justify-between border-t pt-3 border-gray-300 dark:border-gray-700">
          <p className="text-gray-700 text-md font-medium dark:text-gray-300">
            {data.title}
          </p>
          <p className="text-gray-900 text-2xl font-bold dark:text-white">
            {isHovered
              ? data.value.toLocaleString()
              : `${(data.value / 10000000).toFixed(2)} Cr`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

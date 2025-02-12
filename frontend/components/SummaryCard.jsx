import { BadgeIndianRupee } from "lucide-react";
import { useState } from "react";

const SummaryCard = ({ title, data }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:scale-105 transition-all duration-300 shadow-md dark:shadow-neonBlue">
      <div
        className="flex flex-col gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-blue-400 p-2 rounded-full text-white">
            <BadgeIndianRupee />
          </div>
          <h1 className="text-xl font-semibold dark:text-white">
            {title} {isHovered ? "" : " (in CR)"}
          </h1>
        </div>

        <div className="flex items-center justify-between ">
          <p className="text-gray-900 text-lg font-semibold dark:text-white">
            {data.title}
          </p>
          <p className="text-gray-900 text-xl font-bold dark:text-white">
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

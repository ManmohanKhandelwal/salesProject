import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const StoreCard = ({
  title,
  trend,
  percentChange,
  data,
  className,
  isShadow = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-full h-full p-4 ${
        className ? className : "bg-white"
      } dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:scale-105 transition-all duration-300 shadow-md ${
        isShadow ? "dark:shadow-neonGreen" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
        {trend && (
          <div
            className={`flex items-center gap-2 ${
              trend === "up" ? "bg-green-400" : "bg-red-500"
            } p-2 rounded-full text-sm`}
          >
            {trend === "up" ? <TrendingUp /> : <TrendingDown />}
            {percentChange && <p>{percentChange}</p>}
          </div>
        )}
      </div>

      {/* Show in Cr by default, exact amount on hover */}
      <h1
        className="text-4xl font-bold pt-2 dark:text-white relative cursor-pointer transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {data}
      </h1>
    </div>
  );
};

export default StoreCard;

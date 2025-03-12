import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const SalesCard = ({
  title,
  data,
  trend,
  percentChange,
  className,
  isShadow = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-full p-6 rounded-2xl border transition-all duration-300 
        ${className ? className : "bg-white dark:bg-gray-900"} 
        ${isShadow ? "shadow-lg dark:shadow-neonGreen" : "shadow-md"} 
        hover:scale-[1.04] hover:shadow-xl dark:border-gray-700 border-gray-200`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium ">
          {title} <span className="">{!isHovered && "(in CR)"}</span>
        </h1>
        {trend && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold 
              ${
                trend === "up"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
          >
            {trend === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{percentChange}</span>
          </div>
        )}
      </div>

      <h1
        className="text-5xl font-bold pt-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered
          ? data.toLocaleString()
          : `${(data / 10000000).toFixed(2)} Cr`}
      </h1>
    </div>
  );
};

export default SalesCard;

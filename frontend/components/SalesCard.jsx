import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

const SalesCard = ({ title, data, trend, percentChange }) => {
  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div
          className={`flex items-center gap-2 ${
            trend === "up" ? "bg-green-400" : "bg-red-400"
          } p-2 rounded-full text-sm`}
        >
          {trend === "up" ? <TrendingUp /> : <TrendingDown />}
          <p>{percentChange}</p>
        </div>
      </div>

      <h1 className="text-4xl font-bold pt-2">{data}</h1>
    </div>
  );
};

export default SalesCard;

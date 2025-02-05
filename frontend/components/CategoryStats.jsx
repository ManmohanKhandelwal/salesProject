"use client";

import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from "./ui/scroll-area";

// Normalize data for the chart (calculate percentage) Function
function normalizedData(data) {
  return data.map((item) => ({
    ...item,
    achievedPercentage: (item.retail / item.target) * 100,
  }));
}

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CategoryStats = ({ CategoryStatsData }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={normalizedData(CategoryStatsData)}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="achievedPercentage"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={style}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <ScrollArea className="mt-1 h-52">
        {CategoryStatsData.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center text-sm mb-1"
          >
            <span className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.fill }}
              />
              <p className="font-semibold text-lg">{item.name}</p>
            </span>
            <span className="text-lg">
              {item.retail} / {item.target}
            </span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default CategoryStats;

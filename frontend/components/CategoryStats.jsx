"use client";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from "./ui/scroll-area";

const data = [
  { name: "Group A", retail: 2487, target: 3000, fill: "#FF6F61" },
  { name: "Group B", retail: 1828, target: 2000, fill: "#0088FE" },
  { name: "Group C", retail: 1463, target: 1800, fill: "#00C49F" },
  { name: "Group D", retail: 1302, target: 1600, fill: "#FFBB28" },
  { name: "Group E", retail: 1046, target: 1500, fill: "#FF8042" },
  { name: "Group F", retail: 976, target: 1200, fill: "#AF19FF" },
];

// Normalize data for the chart (calculate percentage)
const normalizedData = data.map((item) => ({
  ...item,
  achievedPercentage: (item.retail / item.target) * 100,
}));

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CategoryStats = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={normalizedData}
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
        {data.map((item) => (
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

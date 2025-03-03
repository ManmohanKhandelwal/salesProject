"use client";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

const generateColors = (size) => {
    return Array.from({ length: size }, (_, i) => `hsl(${(i * 360) / size}, 70%, 50%)`);
  };

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2; // Adjust label distance
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {(payload.total_retailing/10000000).toFixed(1)+"Cr"}
      </text>
    );
  };
  

const StorePagePieChart = ({ data, nameKey}) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true); // Ensures component only renders on client side
    }, []);
    if (!isClient) return <p>Loading chart...</p>; 
    
    const formattedData = data?.map((item) => ({
        name:item[nameKey],
        total_retailing: Number(item.total_retailing),
      }));

    const COLORS = generateColors(formattedData?.length);
  return (
    <>
      <PieChart width={350} height={250}>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="total_retailing"
          nameKey="name"
        >
          {formattedData?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        
      </PieChart>
    </>
  );
};

export default StorePagePieChart;

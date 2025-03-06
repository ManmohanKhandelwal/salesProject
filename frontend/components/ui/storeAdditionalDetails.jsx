import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const formatAmount = (amount) =>
  Number(amount) > 100000 ? `${(Number(amount) / 1000).toFixed(2)}K` : amount;

const DetailCard = ({ title, value, color }) => (
  <Card className="shadow-lg border-0 rounded-xl transition-transform transform hover:scale-[1.02]">
    <CardContent
      className={`p-4 flex justify-between items-center rounded-xl ${color}`}
    >
      <p className="text-lg font-semibold text-white">{title}</p>
      <Badge
        variant="outline"
        className="text-md px-3 py-1 bg-white/20 text-white rounded-lg"
      >
        {value}
      </Badge>
    </CardContent>
  </Card>
);

const StoreAdditionalDetails = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DetailCard
        title="Highest Retailing Month"
        value={`${months[data.highest_retailing_month.split("-")[1] - 1]} ${
          data.highest_retailing_month.split("-")[0]
        }`}
        color="bg-gradient-to-r from-cyan-500 to-cyan-700"
      />
      <DetailCard
        title="Highest Retailing Amount"
        value={`₹ ${formatAmount(data.highest_retailing_amount)}`}
        color="bg-gradient-to-r from-amber-500 to-amber-700"
      />
      <DetailCard
        title="Lowest Retailing Month"
        value={`${months[data.lowest_retailing_month.split("-")[1] - 1]} ${
          data.lowest_retailing_month.split("-")[0]
        }`}
        color="bg-gradient-to-r from-lime-500 to-lime-700"
      />
      <DetailCard
        title="Lowest Retailing Amount"
        value={`₹ ${formatAmount(data.lowest_retailing_amount)}`}
        color="bg-gradient-to-r from-green-500 to-green-700"
      />
      <DetailCard
        title="Highest Retailing Product"
        value={data.highest_retailing_product}
        color="bg-gradient-to-r from-fuchsia-500 to-fuchsia-700"
      />
      <DetailCard
        title="Highest Retailing Product Amount"
        value={`₹ ${formatAmount(data.highest_retailing_product_amount)}`}
        color="bg-gradient-to-r from-orange-500 to-orange-700"
      />
      <DetailCard
        title="Lowest Retailing Product"
        value={data.lowest_retailing_product}
        color="bg-gradient-to-r from-red-500 to-red-700"
      />
      <DetailCard
        title="Lowest Retailing Product Amount"
        value={`₹ ${formatAmount(data.lowest_retailing_product_amount)}`}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
    </div>
  );
};

export default StoreAdditionalDetails;

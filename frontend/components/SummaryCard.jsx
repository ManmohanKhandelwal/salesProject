import { BadgeIndianRupee } from "lucide-react";

const SummaryCard = ({ title, data }) => {
  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:scale-105 transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-400 p-2 rounded-full text-white">
            <BadgeIndianRupee />
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-900 text-lg font-semibold">{data.title}</p>
          <p className="text-gray-900 text-xl font-bold">{data.value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

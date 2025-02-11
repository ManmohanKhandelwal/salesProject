import { ScrollArea } from "./ui/scroll-area";

const CategoryStats = ({ CategoryStatsData }) => {
  const sortedCategories = [...CategoryStatsData].sort(
    (a, b) => b.retailing - a.retailing
  );

  const getBackgroundColor = (index) => {
    if (index === 0) return "bg-yellow-400 dark:bg-yellow-600"; // Gold
    if (index === 1) return "bg-gray-300 dark:bg-gray-500"; // Silver
    if (index === 2) return "bg-amber-700 dark:bg-amber-900"; // Bronze
    return "bg-white dark:bg-gray-800"; // Default
  };

  return (
    <div className="w-full p-6">
      <ScrollArea className="h-[470px] pb-2">
        <div className="flex flex-col gap-4 items-center">
          {sortedCategories.map((category, index) => (
            <div
              key={index}
              className={`w-full max-w-md p-4 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-200 flex justify-between items-center ${getBackgroundColor(
                index
              )}`}
            >
              <div className="w-full flex justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                  Retailing: ₹{category.retailing.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryStats;

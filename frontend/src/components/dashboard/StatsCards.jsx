import { Calendar, CheckCircle, Clock } from "lucide-react";

const StatsCards = ({ todos, completedCount, pendingCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 lg:mb-8">
      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
              Total Tasks
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {todos.length}
            </h3>
          </div>
          <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
              Completed
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {completedCount}
            </h3>
          </div>
          <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
              Pending
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
              {pendingCount}
            </h3>
          </div>
          <Clock className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-500 opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

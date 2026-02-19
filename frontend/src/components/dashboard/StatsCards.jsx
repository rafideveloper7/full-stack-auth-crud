import { Calendar, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const StatsCards = ({ stats }) => {
  // Debug: See what's coming in props
  // useEffect(() => {
  //   console.log('📊 StatsCards received props:', stats);
  // }, [stats]);

  // Ensure we have numbers
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  
  // 👉 IMPORTANT: Calculate pending from total and completed if not provided
  const pending = stats?.pending ?? (total - completed);
  
  // Double-check calculation
  const calculatedPending = total - completed;
  
  // console.log('📊 StatsCards values:', {
  //   total,
  //   completed,
  //   pendingFromProps: stats?.pending,
  //   calculatedPending,
  //   usingPending: pending,
  //   match: pending === calculatedPending
  // });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      {/* 2x2 Grid on Mobile */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Total Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-lg font-bold text-blue-700">{total}</p>
            </div>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Done</p>
              <p className="text-lg font-bold text-green-700">{completed}</p>
            </div>
          </div>
        </div>

        {/* Pending Card - Using calculated pending */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-lg font-bold text-orange-700">{pending}</p>
              {/* Show calculation if there's a mismatch */}
              {pending !== calculatedPending && (
                <p className="text-[10px] text-gray-500">
                  (calc: {calculatedPending})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Progress</p>
              <p className="text-lg font-bold text-purple-700">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Progress Bar */}
      {total > 0 && (
        <div className="bg-gray-100 rounded-full h-1.5 mb-4">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}
    </>
  );
};

export default StatsCards;
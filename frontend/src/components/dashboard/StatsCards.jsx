import { Calendar, CheckCircle, Clock, TrendingUp } from "lucide-react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: Calendar,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textLight: "text-blue-600"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      bgLight: "bg-green-50",
      textLight: "text-green-600"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "orange",
      gradient: "from-orange-500 to-red-600",
      bgLight: "bg-orange-50",
      textLight: "text-orange-600"
    }
  ];

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 lg:mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <h3 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </h3>
              </div>
              <div className={`p-4 ${card.bgLight} rounded-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-3`}>
                <card.icon className={`h-8 w-8 ${card.textLight}`} />
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                style={{ 
                  width: card.title === "Total Tasks" ? '100%' : 
                         card.title === "Completed" ? `${completionRate}%` : 
                         `${100 - completionRate}%` 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold">{completionRate}% Complete</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-white/80 text-xs">Completed</p>
                <p className="text-xl font-bold">{stats.completed}</p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-xs">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsCards;
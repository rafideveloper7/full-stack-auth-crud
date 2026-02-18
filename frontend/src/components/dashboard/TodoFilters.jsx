import { Plus, Filter, ListFilter,Check , Clock } from "lucide-react";

const TodoFilters = ({
  showAddForm,
  setShowAddForm,
  filter,
  setFilter,
  filteredTodos,
  totalTodos,
}) => {
  const filters = [
    { value: "all", label: "All Tasks", color: "blue", icon: ListFilter },
    { value: "completed", label: "Completed", color: "green", icon: Check },
    { value: "pending", label: "Pending", color: "orange", icon: Clock }
  ];

  const getFilterColor = (filterValue) => {
    switch(filterValue) {
      case 'all': return 'blue';
      case 'completed': return 'green';
      case 'pending': return 'orange';
      default: return 'blue';
    }
  };

  const currentColor = getFilterColor(filter);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base font-semibold group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Task</span>
        </button>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-200 w-full sm:w-auto">
          <Filter className={`h-5 w-5 text-${currentColor}-500`} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-gray-700 text-sm sm:text-base w-full cursor-pointer font-medium"
          >
            {filters.map(f => (
              <option key={f.value} value={f.value} className={`text-${f.color}-600`}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
        <span className="text-gray-600 font-medium">
          Showing <span className={`text-${currentColor}-600 font-bold`}>{filteredTodos.length}</span> of{" "}
          <span className="text-gray-800 font-bold">{totalTodos}</span> tasks
        </span>
        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;
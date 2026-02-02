import { Plus, Filter } from "lucide-react";

const TodoFilters = ({
  showAddForm,
  setShowAddForm,
  filter,
  setFilter,
  filteredTodos,
  todos,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add New Todo</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-gray-700 text-sm sm:text-base w-full"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-0">
        Showing {filteredTodos.length} of {todos.length} tasks
      </p>
    </div>
  );
};

export default TodoFilters;

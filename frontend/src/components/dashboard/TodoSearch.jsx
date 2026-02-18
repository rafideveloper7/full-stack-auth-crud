import { Search, X } from "lucide-react";

const TodoSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base transition"
          placeholder="Search todos by title or description..."
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoSearch;
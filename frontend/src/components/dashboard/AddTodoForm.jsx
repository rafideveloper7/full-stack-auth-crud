const AddTodoForm = ({ newTodo, setNewTodo, addNewTodo, setShowAddForm }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg mb-6 border border-gray-200 animate-fadeIn">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
        Create New Todo
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Title *
          </label>
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
            placeholder="Enter todo title"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Description
          </label>
          <textarea
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
            placeholder="Enter description (optional)"
            rows="2"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={addNewTodo}
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm sm:text-base"
          >
            Add Todo
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoForm;

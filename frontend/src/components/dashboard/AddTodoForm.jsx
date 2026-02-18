import { X, PlusCircle } from "lucide-react";

const AddTodoForm = ({ newTodo, setNewTodo, addNewTodo, setShowAddForm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    addNewTodo();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl mb-6 border-2 border-indigo-100 animate-slideDown">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Task
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-base"
              placeholder="Enter todo title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-base"
              placeholder="Enter description (optional)"
              rows="4"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!newTodo.title.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create Todo
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoForm;
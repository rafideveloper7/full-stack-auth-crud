import { ChevronDown, ChevronUp, Check, AlertCircle, Edit, Trash2, X, Save } from "lucide-react";

const MobileTodoCard = ({
  todo,
  index,
  editingTodo,
  editForm,
  setEditForm,
  expandedTodoId,
  setExpandedTodoId,
  toggleTodoStatus,
  startEditing,
  saveEdit,
  cancelEdit,
  setShowDeleteConfirm,
}) => {
  const isEditing = editingTodo === todo._id;
  const isExpanded = expandedTodoId === todo._id;

  return (
    <div className={`bg-white rounded-2xl shadow-lg mb-4 border-2 transition-all duration-200 ${
      todo.isCompleted 
        ? "border-green-200 hover:border-green-300" 
        : "border-orange-200 hover:border-orange-300"
    }`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold transition-all duration-200 ${
                todo.isCompleted 
                  ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md" 
                  : "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md"
              }`}>
                {index + 1}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border-2 border-indigo-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                  placeholder="Title"
                  autoFocus
                />
              ) : (
                <h3 className={`font-bold text-base truncate ${
                  todo.isCompleted 
                    ? "text-gray-400 line-through" 
                    : "text-gray-800"
                }`}>
                  {todo.title}
                </h3>
              )}
            </div>

            {(isExpanded || isEditing) && (
              <div className="mt-3 ml-11 animate-fadeIn">
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-indigo-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                    placeholder="Description"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                    {todo.description || (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpandedTodoId(isExpanded ? null : todo._id)}
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-gray-100">
          <button
            onClick={() => toggleTodoStatus(todo._id, todo.isCompleted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
              todo.isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
            }`}
          >
            {todo.isCompleted ? (
              <>
                <Check className="h-4 w-4" />
                <span>Done</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Pending</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveEdit(todo._id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEditing(todo)}
                  className="flex items-center gap-1 bg-gradient-to-r from-indigo-400 to-purple-500 text-white p-3 rounded-xl hover:from-indigo-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(todo._id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-red-400 to-red-500 text-white p-3 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTodoCard;
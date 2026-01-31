import { ChevronDown, ChevronUp, Check, AlertCircle, Edit, Trash2 } from "lucide-react";

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
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium">
              {index + 1}
            </div>
            {editingTodo === todo._id ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Title"
              />
            ) : (
              <h3 className="font-semibold text-gray-800 truncate">
                {todo.title}
              </h3>
            )}
          </div>

          {expandedTodoId === todo._id || editingTodo === todo._id ? (
            <div className="mt-2">
              {editingTodo === todo._id ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Description"
                  rows="2"
                />
              ) : (
                <p className="text-gray-600 text-sm">
                  {todo.description || "No description"}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm truncate">
              {todo.description || "No description"}
            </p>
          )}
        </div>

        <button
          onClick={() =>
            setExpandedTodoId(expandedTodoId === todo._id ? null : todo._id)
          }
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          {expandedTodoId === todo._id ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => toggleTodoStatus(todo._id, todo.isCompleted)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
            todo.isCompleted
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {todo.isCompleted ? (
            <>
              <Check className="h-3 w-3" />
              <span>Done</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3" />
              <span>Pending</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          {editingTodo === todo._id ? (
            <>
              <button
                onClick={() => saveEdit(todo._id)}
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600 transition"
              >
                <Check className="h-3 w-3" />
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-600 transition"
              >
                {/* <X className="h-3 w-3" /> */}
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEditing(todo)}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 p-1.5 rounded-lg hover:bg-blue-200 transition"
                title="Edit"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(todo._id)}
                className="flex items-center gap-1 bg-red-100 text-red-700 p-1.5 rounded-lg hover:bg-red-200 transition"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTodoCard;
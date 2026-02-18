import { Check, XCircle, Edit, Trash2, CheckCircle, X, Calendar, Plus, Save } from "lucide-react";

const DesktopTodoTable = ({
  filteredTodos,
  editingTodo,
  editForm,
  setEditForm,
  toggleTodoStatus,
  startEditing,
  saveEdit,
  cancelEdit,
  setShowDeleteConfirm,
  filter,
  setShowAddForm
}) => {
  const getStatusBadge = (isCompleted) => {
    return isCompleted
      ? "bg-gradient-to-r from-green-400 to-green-500 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      : "bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200";
  };

  const getRowStyle = (isCompleted) => {
    return isCompleted
      ? "bg-gradient-to-r from-green-50/50 to-emerald-50/50"
      : "bg-white";
  };

  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Tasks
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Manage all your todos in one place
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTodos.map((todo, idx) => (
              <tr
                key={todo._id}
                className={`${getRowStyle(todo.isCompleted)} hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group`}
              >
                <td className="px-6 py-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 group-hover:scale-110 ${
                    todo.isCompleted 
                      ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md" 
                      : "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md"
                  }`}>
                    {idx + 1}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {editingTodo === todo._id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all duration-200"
                      autoFocus
                    />
                  ) : (
                    <span className={`font-semibold text-gray-800 ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>
                      {todo.title}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingTodo === todo._id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all duration-200"
                      rows="2"
                    />
                  ) : (
                    <span className={`text-gray-600 ${todo.isCompleted ? 'text-gray-400' : ''}`}>
                      {todo.description || (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleTodoStatus(todo._id, todo.isCompleted)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${getStatusBadge(todo.isCompleted)}`}
                  >
                    {todo.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingTodo === todo._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="flex items-center gap-1 bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-indigo-500 hover:to-purple-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(todo._id)}
                          className="flex items-center gap-1 bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredTodos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Calendar className="h-16 w-16 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-700 mb-3">
                      No tasks found
                    </p>
                    <p className="text-gray-500 text-base mb-6">
                      {filter === "all"
                        ? "Ready to add your first todo?"
                        : `No ${filter} tasks available`}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <Plus className="h-5 w-5" />
                      Create Your First Todo
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesktopTodoTable;
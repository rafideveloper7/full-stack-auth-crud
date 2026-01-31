import { Check, XCircle, Edit, Trash2, CheckCircle, X } from "lucide-react";

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
}) => {
  return (
    <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="p-5 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Your Tasks
        </h2>
        <p className="text-gray-600 sm:text-base text-sm mt-1">
          Manage all your todos in one place
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTodos.map((todo, idx) => (
              <tr
                key={todo._id}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full">
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      {idx + 1}
                    </span>
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  {editingTodo === todo._id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  ) : (
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {todo.title}
                      </p>
                    </div>
                  )}
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  {editingTodo === todo._id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      rows="2"
                    />
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {todo.description || "—"}
                    </p>
                  )}
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <button
                    onClick={() => toggleTodoStatus(todo._id, todo.isCompleted)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                      todo.isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {todo.isCompleted ? (
                      <>
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>
                </td>

                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {editingTodo === todo._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="flex items-center gap-1 bg-blue-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm"
                        >
                          <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 bg-gray-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition text-xs sm:text-sm"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-200 transition text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(todo._id)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <td
                  colSpan={5}
                  className="px-4 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    {/* <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 opacity-50" /> */}
                    <p className="text-base sm:text-lg font-medium text-gray-500 mb-1 sm:mb-2">
                      No tasks found
                    </p>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {filter === "all"
                        ? "Start by adding a new todo!"
                        : `No ${filter} tasks found`}
                    </p>
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
import { 
  Check, 
  XCircle, 
  Edit, 
  Trash2, 
  CheckCircle, 
  X, 
  Calendar, 
  Plus, 
  Save,
  Clock,
  MoreHorizontal,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

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
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showDates, setShowDates] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (index) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-rose-50 text-rose-700 border-rose-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-500">Manage your workflow</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDates(!showDates)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle dates"
          >
            {showDates ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <span className="text-sm text-gray-500">
            {filteredTodos.length} of {filteredTodos.length} tasks
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              {showDates && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTodos.map((todo, idx) => (
              <tr
                key={todo._id}
                className={`hover:bg-gray-50/80 transition-colors ${hoveredRow === todo._id ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHoveredRow(todo._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-md ${getPriorityColor(idx)}`}>
                    {idx + 1}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {editingTodo === todo._id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className={`text-sm font-medium text-gray-900 ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>
                      {todo.title}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingTodo === todo._id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows="2"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {todo.description || <span className="text-gray-400 italic">—</span>}
                    </span>
                  )}
                </td>

                {showDates && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span title={new Date(todo.createdAt).toLocaleString()}>
                          {formatDate(todo.createdAt)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span title={new Date(todo.updatedAt).toLocaleString()}>
                          {formatDate(todo.updatedAt)}
                          {todo.createdAt !== todo.updatedAt && (
                            <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                              edited
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                  </>
                )}

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleTodoStatus(todo._id, todo.isCompleted)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      todo.isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    {todo.isCompleted ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        Pending
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white rounded-md text-xs font-medium hover:bg-gray-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(todo._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredTodos.length === 0 && (
              <tr>
                <td colSpan={showDates ? 7 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">No tasks found</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {filter === 'all' ? 'Get started by creating your first task' : `No ${filter} tasks available`}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      New Task
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Total: {filteredTodos.length}</span>
          <span>•</span>
          <span>Completed: {filteredTodos.filter(t => t.isCompleted).length}</span>
          <span>•</span>
          <span>Pending: {filteredTodos.filter(t => !t.isCompleted).length}</span>
        </div>
        <div>
          <button 
            onClick={() => setShowDates(!showDates)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showDates ? 'Hide dates' : 'Show dates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopTodoTable;
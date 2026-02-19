import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Calendar, 
  Clock,
  MoreVertical,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

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
  const [showMenu, setShowMenu] = useState(false);
  const isEditing = editingTodo === todo._id;
  const isExpanded = expandedTodoId === todo._id;

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const priorityColors = [
    'bg-blue-50 border-blue-200',
    'bg-purple-50 border-purple-200',
    'bg-emerald-50 border-emerald-200',
    'bg-amber-50 border-amber-200',
    'bg-rose-50 border-rose-200'
  ];

  return (
    <div className={`bg-white rounded-lg border ${priorityColors[index % priorityColors.length]} shadow-sm mb-3 transition-all duration-200 ${isExpanded ? 'shadow-md' : ''}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded ${priorityColors[index % priorityColors.length]}`}>
                {index + 1}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title"
                  autoFocus
                />
              ) : (
                <h3 className={`text-sm font-medium text-gray-900 ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </h3>
              )}
            </div>

            {/* Date badges - Always visible */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span>{formatDate(todo.createdAt)}</span>
              </div>
              {todo.createdAt !== todo.updatedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>{formatDate(todo.updatedAt)}</span>
                </div>
              )}
            </div>

            {/* Expandable content */}
            {(isExpanded || isEditing) && (
              <div className="mt-3">
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                    rows="2"
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    {todo.description || <span className="text-gray-400 italic">No description</span>}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpandedTodoId(isExpanded ? null : todo._id)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {!isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        startEditing(todo);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(todo._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => saveEdit(todo._id)}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          ) : (
            <>
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
                    Done
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Pending
                  </>
                )}
              </button>
              <span className="text-xs text-gray-400">
                {todo.isCompleted ? 'Completed' : 'In progress'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTodoCard;
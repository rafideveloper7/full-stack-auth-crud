import { X, PlusCircle, AlignLeft, Type } from "lucide-react";
import { useEffect, useRef } from "react";

const AddTodoModal = ({ newTodo, setNewTodo, addNewTodo, setShowAddForm }) => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowAddForm]);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowAddForm(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setShowAddForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    addNewTodo();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Modal */}
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slideDown overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <PlusCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create New Task</h3>
              <p className="text-indigo-100 text-sm mt-0.5">Add a new todo to your list</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(false)}
            className="absolute top-5 right-5 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Type className="h-4 w-4 text-indigo-600" />
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={inputRef}
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-base"
                placeholder="e.g., Buy groceries, Finish project, Call mom..."
                required
              />
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                {newTodo.title.length}/100 characters
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <AlignLeft className="h-4 w-4 text-indigo-600" />
                Description <span className="text-red-500">*</span>
                 {/* <span className="text-gray-400 text-xs font-normal">(optional)</span> */}
              </label>
              <textarea
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-base resize-none"
                placeholder="Add more details about your task..."
                rows="4"
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                {newTodo.description.length}/500 characters
              </p>
            </div>

            {/* Quick tips */}
            <div className="bg-indigo-50 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
                💡 Quick Tips
              </h4>
              <ul className="text-xs text-indigo-600 space-y-1">
                <li>• Keep titles short and descriptive</li>
                <li>• Add due dates in description if needed</li>
                <li>• You can edit anytime later</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={!newTodo.title.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cancel
            </button>
          </div>

          {/* Keyboard shortcut hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-gray-600 text-xs">Esc</kbd> to cancel
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;
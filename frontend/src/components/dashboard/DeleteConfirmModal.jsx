import { AlertCircle, X } from "lucide-react";

const DeleteConfirmModal = ({
  showDeleteConfirm,
  deleteTodo,
  setShowDeleteConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-slideDown">
        <button
          onClick={() => setShowDeleteConfirm(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Delete Todo
          </h3>
          <p className="text-gray-600 text-base">
            Are you sure you want to delete this todo? This action cannot be
            undone.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => deleteTodo(showDeleteConfirm)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Delete
          </button>
          <button
            onClick={() => setShowDeleteConfirm(null)}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
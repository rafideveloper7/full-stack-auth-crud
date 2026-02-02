import { AlertCircle } from "lucide-react";

const DeleteConfirmModal = ({
  showDeleteConfirm,
  deleteTodo,
  setShowDeleteConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5">
        <div className="text-center mb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Delete Todo
          </h3>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete this todo? This action cannot be
            undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => deleteTodo(showDeleteConfirm)}
            className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => setShowDeleteConfirm(null)}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  LogOut,
  User,
  Calendar,
  Clock,
  Filter,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return logout();

      const res = await axios.get("https://full-stack-auth-crud.vercel.app/api/todo", {
        headers: { Authorization: token },
      });

      setTodos(res.data.Todos || res.data.data || []);

      // Set current user from token
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://full-stack-auth-crud.vercel.app/api/todo/${id}`,
        { isCompleted: !currentStatus },
        { headers: { Authorization: token } },
      );
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo status");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://full-stack-auth-crud.vercel.app/api/todo/${id}`, {
        headers: { Authorization: token },
      });
      fetchTodos();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo");
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditForm({ title: todo.title, description: todo.description || "" });
    setExpandedTodoId(todo._id);
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://full-stack-auth-crud.vercel.app/api/todo/${id}`, editForm, {
        headers: { Authorization: token },
      });
      setEditingTodo(null);
      // fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo");
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditForm({ title: "", description: "" });
  };

  const addNewTodo = async () => {
    if (!newTodo.title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://full-stack-auth-crud.vercel.app/api/todo", newTodo, {
        headers: { Authorization: token },
      });
      setNewTodo({ title: "", description: "" });
      setShowAddForm(false);
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    let statusMatch = true;
    if (filter === "completed") statusMatch = todo.isCompleted;
    if (filter === "pending") statusMatch = !todo.isCompleted;

    // Filter by search query
    const searchMatch =
      searchQuery === "" ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const pendingCount = todos.filter((todo) => !todo.isCompleted).length;

  // Mobile view card component for todos
  const TodoCard = ({ todo, index }) => (
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
                <X className="h-3 w-3" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="block lg:hidden mb-4">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Todo Dashboard
                </h1>
                <p className="text-xs text-gray-500">Manage tasks</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 animate-slideDown">
              {currentUser && (
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <User className="h-8 w-8 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    Total: {todos.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Done: {completedCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">
                    Pending: {pendingCount}
                  </span>
                </div>
                
              </div>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Todo Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your tasks efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <div className="max-w-[120px] sm:max-w-none">
                  <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                  Total Tasks
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {todos.length}
                </h3>
              </div>
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                  Completed
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  {completedCount}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                  Pending
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
                  {pendingCount}
                </h3>
              </div>
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
              placeholder="Search todos..."
            />
          </div>
        </div>

        {/* Add Todo Button & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add New Todo</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700 text-sm sm:text-base w-full"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-0">
            Showing {filteredTodos.length} of {todos.length} tasks
          </p>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-lg mb-6 border border-gray-200 animate-fadeIn">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
              Create New Todo
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
                  placeholder="Enter todo title"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
                  placeholder="Enter description (optional)"
                  rows="2"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={addNewTodo}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm sm:text-base"
                >
                  Add Todo
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
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
                  Are you sure you want to delete this todo? This action cannot
                  be undone.
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
        )}

        {/* Mobile View - Cards */}
        <div className="block lg:hidden">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Your Tasks</h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage all your todos
              </p>
            </div>

            <div className="p-3">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium mb-1">
                    No tasks found
                  </p>
                  <p className="text-gray-400 text-sm">
                    {filter === "all"
                      ? "Start by adding a new todo!"
                      : `No ${filter} tasks found`}
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo, idx) => (
                  <TodoCard key={todo._id} todo={todo} index={idx} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Desktop View - Table */}
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
                        onClick={() =>
                          toggleTodoStatus(todo._id, todo.isCompleted)
                        }
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
                        <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 opacity-50" />
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
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        /* Better scrolling on mobile */
        @media (max-width: 640px) {
          table {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;

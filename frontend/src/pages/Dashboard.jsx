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
  Search,
  Check,
  AlertCircle,
} from "lucide-react";

// Import components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import TodoSearch from "../components/dashboard/TodoSearch";
import TodoFilters from "../components/dashboard/TodoFilters";
import AddTodoForm from "../components/dashboard/AddTodoForm";
import DeleteConfirmModal from "../components/dashboard/DeleteConfirmModel";
import MobileTodoCard from "../components/dashboard/MobileTodoCard";
import DesktopTodoTable from "../components/dashboard/DesktopTodoTable";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";


// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Remove "Bearer " prefix if present (for consistency)
    return token.startsWith("Bearer ") ? token.slice(7) : token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch current user's todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        console.error("No token found");
        return logout();
      }


      // Test if token is valid by getting user info first
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload);
        
        // Check if user ID exists in token
        const userId = payload.id || payload._id || payload.userId;
        
        if (!userId) {
          logout();
          return;
        }
      } catch (parseError) {
        console.error("Error parsing token:", parseError);
        logout();
        return;
      }

      // Fetch todos
      const response = await axios.get(`${API_BASE_URL}/todo`, {
        headers: { 
          Authorization: token,
          "Content-Type": "application/json"
        },
      });

      
      if (response.data.isSuccess) {
        setTodos(response.data.data || []);
      } else {
        alert(response.data.message || "Failed to fetch todos");
      }

    } catch (error) {
      console.error("Fetch todos error:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.status === 401) {
          alert("Session expired. Please login again.");
          logout();
        } else {
          alert(error.response.data?.message || "Failed to fetch todos");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Toggle todo status
  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const token = getAuthToken();
      await axios.put(
        `${API_BASE_URL}/todo/${id}`,
        { isCompleted: !currentStatus },
        { headers: { Authorization: token } }
      );
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error("Error updating todo:", error);
      alert(error.response?.data?.message || "Failed to update todo status");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_BASE_URL}/todo/${id}`, {
        headers: { Authorization: token },
      });
      fetchTodos();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert(error.response?.data?.message || "Failed to delete todo");
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditForm({ 
      title: todo.title, 
      description: todo.description || "" 
    });
    setExpandedTodoId(todo._id);
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      const token = getAuthToken();
      await axios.put(
        `${API_BASE_URL}/todo/${id}`,
        editForm,
        { headers: { Authorization: token } }
      );
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert(error.response?.data?.message || "Failed to update todo");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingTodo(null);
    setEditForm({ title: "", description: "" });
  };

  // Add new todo
  const addNewTodo = async () => {
    if (!newTodo.title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      const token = getAuthToken();
      await axios.post(
        `${API_BASE_URL}/todo`,
        newTodo,
        { headers: { Authorization: token } }
      );
      setNewTodo({ title: "", description: "" });
      setShowAddForm(false);
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      alert(error.response?.data?.message || "Failed to add todo");
    }
  };

  // Filter and search todos
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <DashboardHeader
          currentUser={currentUser}
          logout={logout}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          todos={todos}
          completedCount={completedCount}
          pendingCount={pendingCount}
        />

        {/* Stats Cards */}
        <StatsCards
          todos={todos}
          completedCount={completedCount}
          pendingCount={pendingCount}
        />

        {/* Search Bar */}
        <TodoSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Add Todo Button & Filters */}
        <TodoFilters
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          filter={filter}
          setFilter={setFilter}
          filteredTodos={filteredTodos}
          todos={todos}
        />

        {/* Add Todo Form */}
        {showAddForm && (
          <AddTodoForm
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            addNewTodo={addNewTodo}
            setShowAddForm={setShowAddForm}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            showDeleteConfirm={showDeleteConfirm}
            deleteTodo={deleteTodo}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        )}

        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Your Tasks</h2>
              <p className="text-gray-600 text-sm mt-1">
                {currentUser?.name ? `${currentUser.name}'s todos` : "Manage all your todos"}
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
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Todo
                  </button>
                </div>
              ) : (
                filteredTodos.map((todo, idx) => (
                  <MobileTodoCard
                    key={todo._id}
                    todo={todo}
                    index={idx}
                    editingTodo={editingTodo}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    expandedTodoId={expandedTodoId}
                    setExpandedTodoId={setExpandedTodoId}
                    toggleTodoStatus={toggleTodoStatus}
                    startEditing={startEditing}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <DesktopTodoTable
          filteredTodos={filteredTodos}
          editingTodo={editingTodo}
          editForm={editForm}
          setEditForm={setEditForm}
          toggleTodoStatus={toggleTodoStatus}
          startEditing={startEditing}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          setShowDeleteConfirm={setShowDeleteConfirm}
          filter={filter}
          currentUser={currentUser}
          setShowAddForm={setShowAddForm}
        />
      </div>
    </div>
  );
}

export default Dashboard;
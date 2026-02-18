import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create and export the context
export const TodoContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token || null;
  };

  // Set auth header - IMPORTANT: Send raw token without "Bearer " prefix
  const authHeader = () => {
    const token = getToken();
    return {
      headers: { 
        Authorization: token, // Send raw token as your backend expects
        "Content-Type": "application/json"
      }
    };
  };

  // Logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    // Don't fetch if no token
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/todo`, authHeader());

      if (response.data.isSuccess) {
        setTodos(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch todos");
      }
    } catch (err) {
      console.error("Fetch todos error:", err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to fetch todos");
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  // Add todo
  const addTodo = useCallback(async () => {
    if (!newTodo.title.trim()) {
      setError("Please enter a title");
      return false;
    }

    try {
      setError(null);
      await axios.post(`${API_BASE_URL}/api/todo`, newTodo, authHeader());
      setNewTodo({ title: "", description: "" });
      setShowAddForm(false);
      await fetchTodos();
      return true;
    } catch (err) {
      console.error("Error adding todo:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to add todo");
      }
      return false;
    }
  }, [newTodo, fetchTodos, handleLogout]);

  // Update todo
  const updateTodo = useCallback(async (id, updates) => {
    try {
      setError(null);
      await axios.put(`${API_BASE_URL}/api/todo/${id}`, updates, authHeader());
      setEditingTodo(null);
      setEditForm({ title: "", description: "" });
      await fetchTodos();
      return true;
    } catch (err) {
      console.error("Error updating todo:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to update todo");
      }
      return false;
    }
  }, [fetchTodos, handleLogout]);

  // Delete todo
  const deleteTodo = useCallback(async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/api/todo/${id}`, authHeader());
      setShowDeleteConfirm(null);
      await fetchTodos();
      return true;
    } catch (err) {
      console.error("Error deleting todo:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        handleLogout();
      } else {
        setError(err.response?.data?.message || "Failed to delete todo");
      }
      return false;
    }
  }, [fetchTodos, handleLogout]);

  // Toggle todo status
  const toggleTodoStatus = useCallback(async (id, currentStatus) => {
    await updateTodo(id, { isCompleted: !currentStatus });
  }, [updateTodo]);

  // Start editing
  const startEditing = useCallback((todo) => {
    setEditingTodo(todo._id);
    setEditForm({ 
      title: todo.title, 
      description: todo.description || "" 
    });
    setExpandedTodoId(todo._id);
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingTodo(null);
    setEditForm({ title: "", description: "" });
  }, []);

  // Save edit
  const saveEdit = useCallback(async (id) => {
    const success = await updateTodo(id, editForm);
    if (success) {
      setEditingTodo(null);
    }
  }, [editForm, updateTodo]);

  // Filtered todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
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
  }, [todos, filter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.isCompleted).length,
    pending: todos.filter(t => !t.isCompleted).length
  }), [todos]);

  // Load todos when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchTodos();
    } else {
      setLoading(false);
    }
  }, [fetchTodos]);

  const value = {
    // State
    todos,
    filteredTodos,
    loading,
    error,
    filter,
    searchQuery,
    showAddForm,
    showDeleteConfirm,
    editingTodo,
    editForm,
    newTodo,
    expandedTodoId,
    showMobileMenu,
    stats,

    // Setters
    setFilter,
    setSearchQuery,
    setShowAddForm,
    setShowDeleteConfirm,
    setEditForm,
    setNewTodo,
    setExpandedTodoId,
    setShowMobileMenu,

    // Actions
    fetchTodos,
    addTodo,
    deleteTodo,
    toggleTodoStatus,
    startEditing,
    cancelEdit,
    saveEdit,
    clearError: () => setError(null)
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
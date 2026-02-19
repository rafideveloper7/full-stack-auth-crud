import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import axios from "axios";

// Create context
const TodoContext = createContext();

// Custom hook to use the context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Clear error
  const clearError = () => setError(null);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    // console.log("Token being sent:", token); 

    return {
      headers: {
        Authorization: token, // Just the token, no "Bearer " prefix
        "Content-Type": "application/json",
      },
    };
  };

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping todo fetch");
        return;
      }

      setLoading(true);
      setError(null);
      // console.log("Fetching todos...");

      const response = await axios.get(`${API_URL}/api/todo`, getAuthHeaders());

      // console.log("Todos fetched:", response.data);
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error("Fetch todos error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      setError(error.response?.data?.message || "Failed to fetch todos");

      // If unauthorized, clear token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      if (!newTodo.title || newTodo.title.trim() === "") {
        setError("Todo title cannot be empty");
        return { success: false, error: "Todo title cannot be empty" };
      }

      // console.log("Adding todo:", newTodo);

      const response = await axios.post(
        `${API_URL}/api/todo`,
        {
          title: newTodo.title.trim(),
          description: newTodo.description?.trim() || "",
        },
        getAuthHeaders(),
      );

      // console.log("Todo added:", response.data);

      if (response.data.isSuccess) {
        setTodos((prevTodos) => [response.data.todo, ...prevTodos]);
        setNewTodo({ title: "", description: "" });
        setShowAddForm(false);
        setError(null);
        return { success: true, todo: response.data.todo };
      }
    } catch (error) {
      console.error("Add todo error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(error.response?.data?.message || "Failed to add todo");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add todo",
      };
    }
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditForm({
      title: todo.title,
      description: todo.description || "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTodo(null);
    setEditForm({ title: "", description: "" });
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      if (!editForm.title || editForm.title.trim() === "") {
        setError("Todo title cannot be empty");
        return { success: false, error: "Todo title cannot be empty" };
      }

      // console.log("Updating todo:", id, editForm);

      const response = await axios.put(
        `${API_URL}/api/todo/${id}`,
        {
          title: editForm.title.trim(),
          description: editForm.description?.trim() || "",
        },
        getAuthHeaders(),
      );

      // console.log("Todo updated:", response.data);

      if (response.data.isSuccess) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? response.data.todo : todo,
          ),
        );
        cancelEdit();
        setError(null);
        return { success: true };
      }
    } catch (error) {
      console.error("Update todo error:", error);
      setError(error.response?.data?.message || "Failed to update todo");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update todo",
      };
    }
  };

  // Toggle todo completion
  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/todo/${id}`,
        { isCompleted: !currentStatus },
        getAuthHeaders(),
      );

      if (response.data.isSuccess) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? response.data.todo : todo,
          ),
        );
      }
    } catch (error) {
      console.error("Toggle todo error:", error);
      setError(error.response?.data?.message || "Failed to update todo");
    }
  };

  // Delete todo
  const deleteTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const todoToDelete = todos.find((t) => t._id === showDeleteConfirm);

      if (!todoToDelete) {
        setShowDeleteConfirm(false);
        return;
      }

      // console.log("Deleting todo:", showDeleteConfirm);

      const response = await axios.delete(
        `${API_URL}/api/todo/${showDeleteConfirm}`,
        getAuthHeaders(),
      );

      // console.log("Todo deleted:", response.data);

      if (response.data.isSuccess) {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo._id !== showDeleteConfirm),
        );
        setShowDeleteConfirm(false);
        setError(null);
      }
    } catch (error) {
      console.error("Delete todo error:", error);
      setError(error.response?.data?.message || "Failed to delete todo");
      setShowDeleteConfirm(false);
    }
  };

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.isCompleted);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.isCompleted);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description && todo.description.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [todos, filter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: todos.length,
      active: todos.filter((t) => !t.isCompleted).length,
      completed: todos.filter((t) => t.isCompleted).length,
    };
  }, [todos]);

  // Load todos when token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchTodos();
    }

    // Listen for storage events (login/logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          fetchTodos();
        } else {
          setTodos([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
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
    setFilter,
    setSearchQuery,
    setShowAddForm,
    setShowDeleteConfirm,
    setEditForm,
    setNewTodo,
    setExpandedTodoId,
    setShowMobileMenu,
    addTodo,
    deleteTodo,
    toggleTodoStatus,
    startEditing,
    cancelEdit,
    saveEdit,
    clearError,
    fetchTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// Also export the context if needed elsewhere
export { TodoContext };

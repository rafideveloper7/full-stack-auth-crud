import { useAuth } from "../hooks/useAuth";
import { useTodos } from "../hooks/useTodos";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import TodoSearch from "../components/dashboard/TodoSearch";
import TodoFilters from "../components/dashboard/TodoFilters";
import AddTodoModal from "../components/dashboard/AddTodoModal"; // Changed import
import DeleteConfirmModal from "../components/dashboard/DeleteConfirmModal";
import MobileTodoCard from "../components/dashboard/MobileTodoCard";
import DesktopTodoTable from "../components/dashboard/DesktopTodoTable";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import { Calendar, Plus, AlertCircle, X } from "lucide-react";

function Dashboard() {
  const { user, logout } = useAuth();
  const {
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
    clearError
  } = useTodos();

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Toast */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-slideDown shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <DashboardHeader
          currentUser={user}
          logout={logout}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          stats={stats}
        />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Search Bar */}
        <TodoSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Add Todo Button & Filters */}
        <TodoFilters
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          filter={filter}
          setFilter={setFilter}
          filteredTodos={filteredTodos}
          totalTodos={stats.total}
        />

        {/* Add Todo Modal */}
        {showAddForm && (
          <AddTodoModal
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            addNewTodo={addTodo}
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-4">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Your Tasks
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {user?.name ? `${user.name}'s tasks` : "Manage your tasks"}
              </p>
            </div>

            <div className="p-4">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-12 w-12 text-gray-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-700 mb-2">
                    No tasks found
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {filter === "all"
                      ? "Ready to add your first task?"
                      : `No ${filter} tasks available`}
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto font-semibold"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Task
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
          setShowAddForm={setShowAddForm}
        />
      </div>
    </div>
  );
}

export default Dashboard;
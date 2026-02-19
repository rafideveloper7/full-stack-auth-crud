import { Menu, X, LogOut, User, Calendar, CheckCircle, Clock } from "lucide-react";

const DashboardHeader = ({
  currentUser,
  logout,
  showMobileMenu,
  setShowMobileMenu,
  stats,
  onProfileClick,
}) => {
  return (
    <>
      {/* Mobile Header */}
      <div className="block lg:hidden mb-4">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
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
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 animate-slideDown border border-gray-100">
            {currentUser && (
              <div 
                onClick={onProfileClick}
                className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-lg p-2"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  {currentUser.profileImage ? (
                    <img 
                      src={currentUser.profileImage} 
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
                <span className="text-xs text-blue-600">Click to view profile</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Total: {stats.total}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  Done: {stats.completed}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">
                  Pending: {stats.pending}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Todo Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div 
              onClick={onProfileClick}
              className="hidden sm:flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm border border-gray-200 cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                {currentUser.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
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
    </>
  );
};

export default DashboardHeader;
import { Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Header />
        </div>
        
{/* Desktop Header with Logout */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-600 bg-surface">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-mono font-semibold text-white">Ready to squash some bugs, {user?.firstName || 'Code Ninja'}? 🐛⚡</h2>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-colors"
          >
            <ApperIcon name="LogOut" size={16} />
            <span>Logout</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
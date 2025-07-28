import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Header />
        </div>
        
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
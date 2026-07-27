import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  BookOpen,
  Image,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,

  GraduationCap,
  ClipboardList,
  Building2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/notices", label: "Notices", icon: Bell },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/admissions", label: "Admissions", icon: ClipboardList },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/admin/departments", label: "Department", icon: Building2 },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-cream-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-maroon-700 text-cream-50 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 border-b border-maroon-600 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-500">
            <GraduationCap size={20} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">PKMC</p>
            <p className="text-xs text-maroon-300">Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-maroon-500 text-cream-50"
                      : "text-maroon-200 hover:bg-maroon-600 hover:text-cream-50"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-maroon-600 px-4 py-3">
          <p className="text-sm font-semibold text-cream-50">{user?.name}</p>
          <p className="text-xs capitalize text-maroon-300">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-maroon-200 transition-colors hover:bg-maroon-600 hover:text-cream-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="flex items-center gap-4 border-b border-maroon-100 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 text-ink-700"
          >
            <Menu size={22} />
          </button>
          <p className="font-display font-semibold text-maroon-600">Admin Panel</p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { LayoutDashboard, ListTodo, ChartColumn, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      name: "Statistics",
      path: "/stats",
      icon: ChartColumn,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col h-screen w-60 shrink-0 bg-[#0F1016] border-r border-white/5 sticky top-0">
      {/* Logo */}
      <div className="px-8 pt-8 pb-10 border-b border-white/5">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight">
          Focusly
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-400/15 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={21} />

              <span className="font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {/* <div className="border-t border-white/5 p-6">
        <div className="flex items-center gap-3"></div>
      </div> */}
    </aside>
  );
};

export default Sidebar;

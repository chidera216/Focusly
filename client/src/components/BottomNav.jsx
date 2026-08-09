import { LayoutDashboard, ListTodo, ChartColumn, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-50">
      <div className="relative bg-[#111118]/95 backdrop-blur-xl border border-white/5 rounded-[32px] h-20 flex items-center justify-between px-6">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center transition ${
              isActive ? "text-white" : "text-gray-500"
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        {/* Tasks */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center transition ${
              isActive ? "text-white" : "text-gray-500"
            }`
          }
        >
          <ListTodo size={20} />
          <span className="text-xs mt-1">Tasks</span>
        </NavLink>

        {/* Statistics */}
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex flex-col items-center transition ${
              isActive ? "text-white" : "text-gray-500"
            }`
          }
        >
          <ChartColumn size={20} />
          <span className="text-xs mt-1">Stats</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `relative flex flex-col items-center transition ${
              isActive ? "text-white" : "text-gray-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>

              {isActive && (
                <div className="absolute -bottom-3 w-8 h-1 rounded-full" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;

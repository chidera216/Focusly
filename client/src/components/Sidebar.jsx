import { useEffect, useState } from "react";
import { LayoutDashboard, ListTodo, ChartColumn, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

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

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <aside
      className={`
        hidden
        md:flex
        md:flex-col
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-60
        border-r
        transition-colors
        duration-300
        ${
          isDark ? "border-white/6 bg-[#090909]" : "border-black/7 bg-[#FAFAF8]"
        }
      `}
    >
      {/* Brand */}

      <div className="px-7 py-7">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              transition-colors
              duration-300
              ${
                isDark
                  ? "border-white/8 bg-white/3"
                  : "border-black/7 bg-white shadow-sm"
              }
            `}
          >
            <img
              src="/icons.svg"
              alt="Focusly"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div>
            <p
              className={`
                font-['Plus_Jakarta_Sans']
                text-[15px]
                font-semibold
                tracking-tight
                transition-colors
                duration-300
                ${isDark ? "text-white" : "text-[#171717]"}
              `}
            >
              Focusly
            </p>

            <p
              className={`
                mt-0.5
                text-[10px]
                transition-colors
                duration-300
                ${isDark ? "text-zinc-600" : "text-zinc-500"}
              `}
            >
              Stay focused
            </p>
          </div>
        </NavLink>
      </div>

      {/* Divider */}

      <div
        className={`
          mx-6
          h-px
          transition-colors
          duration-300
          ${isDark ? "bg-white/5" : "bg-black/6"}
        `}
      />

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">
        <p
          className={`
            px-3
            pb-3
            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            transition-colors
            duration-300
            ${isDark ? "text-zinc-600" : "text-zinc-500"}
          `}
        >
          Workspace
        </p>

        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? isDark
                        ? "bg-white/8 text-white"
                        : "bg-black/5.5 text-[#171717]"
                      : isDark
                        ? "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                        : "text-zinc-500 hover:bg-black/[0.035] hover:text-zinc-800"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2 : 1.7}
                      className={`
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? isDark
                              ? "text-white"
                              : "text-[#171717]"
                            : isDark
                              ? "text-zinc-700 group-hover:text-zinc-400"
                              : "text-zinc-400 group-hover:text-zinc-700"
                        }
                      `}
                    />

                    <span className="font-medium">{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}

      <div
        className={`
          border-t
          px-7
          py-5
          transition-colors
          duration-300
          ${isDark ? "border-white/5" : "border-black/6"}
        `}
      >
        <p
          className={`
            text-[10px]
            uppercase
            tracking-[0.16em]
            transition-colors
            duration-300
            ${isDark ? "text-zinc-700" : "text-zinc-400"}
          `}
        >
          Focusly
        </p>

        <p
          className={`
            mt-1
            text-[11px]
            transition-colors
            duration-300
            ${isDark ? "text-zinc-600" : "text-zinc-500"}
          `}
        >
          Focus on what matters.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

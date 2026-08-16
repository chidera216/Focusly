import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  ChartColumn,
  User,
  ChevronRight,
} from "lucide-react";
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
      className={`fixed left-0 top-0 z-40 hidden h-screen w-[248px] flex-col border-r md:flex ${
        isDark
          ? "border-white/[0.055] bg-[#0D0D0F]"
          : "border-black/[0.06] bg-[#F8F8F6]"
      }`}
    >
      {/* BRAND */}

      <div className="px-5 pt-6">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-3 rounded-2xl px-2 py-2"
        >
          <div
            className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border ${
              isDark
                ? "border-white/[0.08] bg-[#171719]"
                : "border-black/[0.06] bg-white shadow-sm"
            }`}
          >
            <img
              src="/icons.svg"
              alt="Focusly"
              className="h-full w-full object-contain p-1.5"
            />

            <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-orange-400/[0.04]" />
          </div>

          <div className="min-w-0">
            <p
              className={`font-['Plus_Jakarta_Sans'] text-[15px] font-bold tracking-[-0.03em] ${
                isDark ? "text-white" : "text-[#171717]"
              }`}
            >
              Focusly
            </p>

            <p
              className={`mt-0.5 text-[10px] ${
                isDark ? "text-zinc-600" : "text-zinc-500"
              }`}
            >
              Stay focused
            </p>
          </div>
        </NavLink>
      </div>

      {/* WORKSPACE LABEL */}

      <div className="px-5 pb-3 pt-10">
        <p
          className={`px-2 text-[9px] font-bold uppercase tracking-[0.2em] ${
            isDark ? "text-zinc-700" : "text-zinc-400"
          }`}
        >
          Workspace
        </p>
      </div>

      {/* NAVIGATION */}

      <nav className="px-3">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                  group relative flex h-11 items-center gap-3 rounded-[14px] px-3
                  text-[13px] font-medium transition-all duration-200
                  ${
                    isActive
                      ? isDark
                        ? "bg-white/[0.065] text-white"
                        : "bg-white text-[#171717] shadow-sm"
                      : isDark
                        ? "text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300"
                        : "text-zinc-500 hover:bg-black/[0.025] hover:text-zinc-800"
                  }
                `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}

                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-200 ${
                        isActive
                          ? "bg-orange-400"
                          : "bg-transparent group-hover:bg-zinc-500/30"
                      }`}
                    />

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-all ${
                        isActive
                          ? isDark
                            ? "bg-orange-400/10 text-orange-400"
                            : "bg-orange-50 text-orange-500"
                          : isDark
                            ? "text-zinc-700 group-hover:text-zinc-400"
                            : "text-zinc-400 group-hover:text-zinc-600"
                      }`}
                    >
                      <Icon size={17} strokeWidth={isActive ? 2 : 1.7} />
                    </span>

                    <span className="flex-1">{link.name}</span>

                    <ChevronRight
                      size={14}
                      strokeWidth={1.8}
                      className={`transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? "translate-x-0 text-zinc-500"
                            : "translate-x-0 text-zinc-400"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* FOCUS CARD */}

      <div className="mt-auto px-4 pb-4">
        <div
          className={`relative overflow-hidden rounded-[20px] border p-4 ${
            isDark
              ? "border-white/[0.06] bg-[#141416]"
              : "border-black/[0.05] bg-white"
          }`}
        >
          <div
            className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
              isDark ? "bg-orange-500/[0.08]" : "bg-orange-300/[0.18]"
            }`}
          />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                  isDark ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                Focusly
              </span>
            </div>

            <p
              className={`text-xs font-semibold ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Focus on what matters.
            </p>

            <p
              className={`mt-1 text-[10px] leading-4 ${
                isDark ? "text-zinc-700" : "text-zinc-400"
              }`}
            >
              One session at a time.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

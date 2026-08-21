import { LayoutDashboard, ListTodo, ChartColumn, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const BottomNav = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const links = [
    {
      name: "Home",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      name: "Stats",
      path: "/stats",
      icon: ChartColumn,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const isDark = theme === "dark";

  // ============================================================
  // THEME
  // ============================================================

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  // ============================================================
  // VISUAL SYSTEM
  // ============================================================

  const navSurface = isDark
    ? `
      border-white/[0.10]
      bg-[#18191B]/[0.97]
      shadow-[0_12px_32px_rgba(0,0,0,0.30)]
    `
    : `
      border-black/[0.09]
      bg-[#FAFBF8]/[0.98]
      shadow-[0_12px_32px_rgba(25,30,25,0.12)]
    `;

  const inactiveText = isDark ? "text-[#777B78]" : "text-[#727870]";

  const activeText = isDark ? "text-[#F7F7F5]" : "text-[#171917]";

  const activeIconSurface = isDark
    ? "bg-[#F5F5F2] text-[#111214]"
    : "bg-[#171917] text-white";

  const activeShadow = isDark
    ? "shadow-[0_4px_14px_rgba(0,0,0,0.24)]"
    : "shadow-[0_4px_14px_rgba(0,0,0,0.16)]";

  const hoverSurface = isDark
    ? "group-hover:bg-white/[0.045]"
    : "group-hover:bg-black/[0.045]";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <div
        className={`
          mx-auto
          flex
          h-[68px]
          w-full
          max-w-[390px]
          items-center
          rounded-[24px]
          border
          px-1.5
          backdrop-blur-2xl
          transition-all
          duration-300
          ${navSurface}
        `}
      >
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="group flex h-full flex-1 items-center justify-center"
            >
              {({ isActive }) => (
                <div className="relative flex h-full w-full items-center justify-center">
                  <div
                    className={`
                      flex
                      min-w-[58px]
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      transition-all
                      duration-200
                      ${isActive ? activeText : inactiveText}
                    `}
                  >
                    {/* ICON */}
                    <div
                      className={`
                        relative
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-[12px]
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? `${activeIconSurface} ${activeShadow}`
                            : `bg-transparent ${hoverSurface}`
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={isActive ? 2.2 : 1.5}
                        className="transition-colors duration-200"
                      />
                    </div>

                    {/* LABEL */}
                    <span
                      className={`
                        text-[9px]
                        leading-none
                        tracking-[-0.01em]
                        transition-colors
                        duration-200
                        ${isActive ? "font-semibold" : "font-medium"}
                      `}
                    >
                      {link.name}
                    </span>
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import { LayoutDashboard, ListTodo, ChartColumn, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <div
        className="
          mx-auto
          flex
          h-18
          max-w-sm
          items-center
          rounded-2xl
          border
          border-white/8
          bg-[#101012]/95
          px-2
          shadow-[0_12px_45px_rgba(0,0,0,0.45)]
          backdrop-blur-2xl
        "
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
                <div className="relative flex w-full items-center justify-center">
                  <div
                    className={`
                      flex
                      min-w-14.5
                      flex-col
                      items-center
                      gap-1.5
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-zinc-600 group-hover:text-zinc-300"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-white text-black shadow-[0_4px_15px_rgba(255,255,255,0.12)]"
                            : "bg-transparent"
                        }
                      `}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.1 : 1.7} />
                    </div>

                    <span
                      className={`
                        text-[9px]
                        font-medium
                        leading-none
                        ${
                          isActive
                            ? "text-zinc-200"
                            : "text-zinc-700 group-hover:text-zinc-500"
                        }
                      `}
                    >
                      {link.name}
                    </span>
                  </div>

                  {isActive && (
                    <span
                      className="
                        absolute
                        -bottom-1
                        h-0.5
                        w-4
                        rounded-full
                        bg-white/80
                      "
                    />
                  )}
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

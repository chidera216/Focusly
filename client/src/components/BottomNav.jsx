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
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div
        className="
          mx-auto
          flex
          h-[68px]
          w-full
          max-w-[390px]
          items-center
          rounded-[22px]
          border
          border-white/[0.07]
          bg-[#111113]/95
          px-1.5
          shadow-[0_18px_50px_rgba(0,0,0,0.5)]
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
                      ${
                        isActive
                          ? "text-white"
                          : "text-zinc-600 group-hover:text-zinc-400"
                      }
                    `}
                  >
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
                            ? "bg-white text-[#111113] shadow-[0_4px_18px_rgba(255,255,255,0.08)]"
                            : "bg-transparent group-hover:bg-white/[0.035]"
                        }
                      `}
                    >
                      <Icon size={17} strokeWidth={isActive ? 2.15 : 1.65} />
                    </div>

                    <span
                      className={`
                        text-[9px]
                        font-medium
                        leading-none
                        tracking-[-0.01em]
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
                        bottom-[5px]
                        h-1
                        w-1
                        rounded-full
                        bg-white
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

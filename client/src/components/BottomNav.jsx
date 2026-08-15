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
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-97.5 -translate-x-1/2 md:hidden">
      <div
        className="
          relative
          flex
          h-18
          items-center
          justify-around
          rounded-3xl
          border
          border-white/8
          bg-[#0F0F12]/95
          px-2
          shadow-[0_18px_60px_rgba(0,0,0,0.5)]
          backdrop-blur-2xl
        "
      >
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="relative flex h-full min-w-17 items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`
                    relative
                    flex
                    h-13
                    min-w-14.5
                    flex-col
                    items-center
                    justify-center
                    rounded-[17px]
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                    }
                  `}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.1 : 1.7} />

                  <span
                    className={`
                      mt-1
                      text-[9px]
                      font-medium
                      tracking-wide
                      ${isActive ? "text-black" : "text-zinc-700"}
                    `}
                  >
                    {link.name}
                  </span>
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

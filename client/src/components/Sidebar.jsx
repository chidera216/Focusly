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
    <aside
      className="
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
        border-white/6
        bg-[#0B0B0D]
      "
    >
      {/* Brand */}
      <div className="px-7 py-7">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl">
            <img
              src="icons.svg"
              alt="Focusly"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div>
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-semibold tracking-tight text-white">
              Focusly
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-700">Stay focused</p>
          </div>
        </NavLink>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/5" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="px-3 pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-700">
          Workspace
        </p>

        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
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
                        ? "bg-white/8 text-white"
                        : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2 : 1.7}
                      className={
                        isActive
                          ? "text-white"
                          : "text-zinc-700 transition-colors group-hover:text-zinc-400"
                      }
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
      <div className="border-t border-white/5 px-7 py-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-800">
          Focusly
        </p>

        <p className="mt-1 text-[11px] text-zinc-700">Focus on what matters.</p>
      </div>
    </aside>
  );
};

export default Sidebar;

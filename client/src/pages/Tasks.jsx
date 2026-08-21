import { useEffect, useState } from "react";
import { Check, Circle, Clock3, Plus, Trash2, Play, X } from "lucide-react";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const navigate = useNavigate();
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
  // LOAD TASKS
  // ============================================================

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");

        if (!ignore) {
          setTasks(res.data.tasks);
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchTasks();

    return () => {
      ignore = true;
    };
  }, []);

  // ============================================================
  // CREATE TASK
  // ============================================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    try {
      const res = await api.post("/tasks", {
        title: trimmedTitle,
      });

      setTasks((currentTasks) => [res.data.task, ...currentTasks]);
      setTitle("");
    } catch (error) {
      console.log("Error creating task:", error);
    }
  };

  // ============================================================
  // TOGGLE TASK
  // ============================================================

  const handleToggleTask = async (taskId) => {
    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
    } catch (error) {
      setTasks(previousTasks);
      console.log("Error updating task:", error);
    }
  };

  // ============================================================
  // DELETE TASK
  // ============================================================

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setIsDeleting(true);

      await api.delete(`/tasks/${taskToDelete._id}`);

      const savedTask = localStorage.getItem("selectedTask");

      if (savedTask) {
        try {
          const selectedTask = JSON.parse(savedTask);

          if (selectedTask._id === taskToDelete._id) {
            localStorage.removeItem("selectedTask");
            window.dispatchEvent(new Event("selectedTaskChanged"));
          }
        } catch {
          localStorage.removeItem("selectedTask");
        }
      }

      setTaskToDelete(null);

      await loadTasks();
    } catch (error) {
      console.log("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================================
  // FOCUS TASK
  // ============================================================

  const handleFocusTask = (task) => {
    localStorage.setItem("selectedTask", JSON.stringify(task));
    window.dispatchEvent(new Event("selectedTaskChanged"));
    navigate("/dashboard");
  };

  // ============================================================
  // TASK COUNTS
  // ============================================================

  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = tasks.filter((task) => !task.completed).length;

  const completionPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // ============================================================
  // COLORS / VISUAL SYSTEM
  // ============================================================

  const pageClass = isDark
    ? "bg-[#101113] text-white"
    : "bg-[#F5F6F4] text-[#161816]";

  const primaryText = isDark ? "text-[#F7F7F5]" : "text-[#171917]";

  const secondaryText = isDark ? "text-[#A1A3A1]" : "text-[#626761]";

  const mutedText = isDark ? "text-[#6F736F]" : "text-[#8A9089]";

  const surface = isDark
    ? "border-white/[0.085] bg-[#18191B]"
    : "border-black/[0.075] bg-white";

  const subtleSurface = isDark
    ? "border-white/[0.065] bg-[#151618]"
    : "border-black/[0.06] bg-[#FAFAF8]";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${pageClass}`}
    >
      <Sidebar theme={theme} />

      <main className="min-h-screen w-full pb-24 md:pl-60">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="px-5 pb-7 pt-7 sm:px-8 sm:pt-9 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    isDark
                      ? "border-white/[0.09] bg-white/[0.025] text-zinc-400"
                      : "border-black/[0.07] bg-white text-zinc-500"
                  }`}
                >
                  Workspace
                </div>

                <h1
                  className={`text-3xl font-bold tracking-[-0.045em] sm:text-4xl ${primaryText}`}
                >
                  Your tasks
                </h1>

                <p
                  className={`mt-2 max-w-md text-sm leading-6 ${secondaryText}`}
                >
                  Keep the list simple. Pick something worth focusing on.
                </p>
              </div>

              {/* TASK COUNT */}

              <div
                className={`hidden min-w-[100px] rounded-[22px] border px-5 py-4 text-right sm:block ${subtleSurface}`}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                >
                  Tasks
                </p>

                <p
                  className={`mt-1 font-num text-2xl font-bold tracking-[-0.05em] ${primaryText}`}
                >
                  {tasks.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8 md:px-10">
          {/* ====================================================
              TOP ROW
          ==================================================== */}

          <div className="grid gap-4 md:grid-cols-[1.65fr_0.8fr_0.8fr]">
            {/* ==================================================
                ADD TASK
            ================================================== */}

            <form
              onSubmit={handleCreateTask}
              className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-6 ${
                isDark
                  ? "border-white/[0.09] bg-[#1B1C1F]"
                  : "border-black/[0.075] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.035)]"
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-[#25272A] text-[#A8E6CF]"
                        : "bg-[#E5F5EB] text-[#327A55]"
                    }`}
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </div>

                  <div>
                    <p className={`text-sm font-bold ${primaryText}`}>
                      Add something to your list
                    </p>

                    <p className={`mt-0.5 text-xs ${secondaryText}`}>
                      One task at a time.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you want to focus on?"
                    className={`min-w-0 flex-1 rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition-all ${
                      isDark
                        ? "border-white/[0.09] bg-[#111214] text-white placeholder:text-zinc-600 focus:border-white/[0.2] focus:bg-[#0F1012]"
                        : "border-black/[0.08] bg-[#F8F9F7] text-[#171717] placeholder:text-zinc-400 focus:border-black/[0.16] focus:bg-white"
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={!title.trim()}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${
                      isDark
                        ? "bg-[#F5F5F2] text-[#111] hover:bg-white"
                        : "bg-[#171917] text-white hover:bg-black"
                    }`}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add task
                  </button>
                </div>
              </div>

              <div
                className={`pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full ${
                  isDark ? "bg-[#A8E6CF]/[0.035]" : "bg-[#A8E6CF]/20"
                }`}
              />
            </form>

            {/* ==================================================
                ACTIVE
            ================================================== */}

            <div className={`rounded-[28px] border p-5 sm:p-6 ${surface}`}>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-[#20272A] text-[#8FD3FF]"
                      : "bg-[#EAF5FA] text-[#34799D]"
                  }`}
                >
                  <Clock3 size={19} />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                    isDark
                      ? "bg-white/[0.045] text-zinc-500"
                      : "bg-[#F2F4F1] text-[#667068]"
                  }`}
                >
                  Active
                </span>
              </div>

              <p
                className={`mt-7 text-[10px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
              >
                To focus
              </p>

              <p
                className={`mt-1 text-3xl font-bold tracking-[-0.06em] ${primaryText}`}
              >
                {activeTasks}
              </p>

              <p className={`mt-1 text-xs ${secondaryText}`}>
                {activeTasks === 1 ? "task" : "tasks"} waiting
              </p>
            </div>

            {/* ==================================================
                COMPLETED
            ================================================== */}

            <div className={`rounded-[28px] border p-5 sm:p-6 ${surface}`}>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-[#29261F] text-[#FFE08A]"
                      : "bg-[#FFF5D0] text-[#8A6A17]"
                  }`}
                >
                  <Check size={19} strokeWidth={2.5} />
                </div>

                <span
                  className={`text-xs font-bold ${
                    isDark ? "text-[#D7B950]" : "text-[#80621A]"
                  }`}
                >
                  {completionPercentage}%
                </span>
              </div>

              <p
                className={`mt-7 text-[10px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
              >
                Completed
              </p>

              <p
                className={`mt-1 text-3xl font-bold tracking-[-0.06em] ${primaryText}`}
              >
                {completedTasks}
              </p>

              <div
                className={`mt-3 h-1.5 overflow-hidden rounded-full ${
                  isDark ? "bg-white/[0.07]" : "bg-black/[0.07]"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDark ? "bg-[#D9BB54]" : "bg-[#D5A900]"
                  }`}
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ====================================================
              TASK SECTION
          ==================================================== */}

          <div className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p
                  className={`text-lg font-bold tracking-[-0.025em] ${primaryText}`}
                >
                  Focus list
                </p>

                <p className={`mt-1 text-xs ${mutedText}`}>
                  Tap a task when you're ready to work on it.
                </p>
              </div>

              <p className={`font-num text-xs font-semibold ${mutedText}`}>
                {completedTasks}/{tasks.length}
              </p>
            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {tasks.length === 0 ? (
              <div
                className={`rounded-[28px] border p-8 sm:p-12 ${subtleSurface}`}
              >
                <div className="mx-auto max-w-md text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] ${
                      isDark
                        ? "bg-[#222428] text-zinc-500"
                        : "bg-[#F2F3F0] text-[#858B82]"
                    }`}
                  >
                    <Circle size={28} strokeWidth={1.8} />
                  </div>

                  <p className={`mt-5 text-base font-bold ${primaryText}`}>
                    Nothing here yet
                  </p>

                  <p
                    className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${secondaryText}`}
                  >
                    Add your first task above. Keep it specific enough that you
                    know exactly what to do when the timer starts.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task, index) => {
                  const accentStyles = [
                    {
                      light: "border-[#BDE9D0]",
                      dark: "border-[#A8E6CF]/15",
                      line: "bg-[#7FC99B]",
                    },
                    {
                      light: "border-[#B7DDF5]",
                      dark: "border-[#8FD3FF]/15",
                      line: "bg-[#76B9DD]",
                    },
                    {
                      light: "border-[#FFE49A]",
                      dark: "border-[#FFE08A]/15",
                      line: "bg-[#D9BB54]",
                    },
                    {
                      light: "border-[#F6C6BC]",
                      dark: "border-[#FFB7A8]/15",
                      line: "bg-[#D98E7B]",
                    },
                  ];

                  const accent = accentStyles[index % accentStyles.length];

                  return (
                    <div
                      key={task._id}
                      className={`group relative overflow-hidden rounded-[28px] border p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6 ${
                        task.completed
                          ? isDark
                            ? "border-white/[0.05] bg-[#151618] opacity-65"
                            : "border-black/[0.055] bg-[#FAFAF8] opacity-70"
                          : isDark
                            ? `bg-[#191A1C] ${accent.dark}`
                            : `bg-white ${accent.light} shadow-[0_8px_25px_rgba(0,0,0,0.025)]`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* CHECK */}

                        <button
                          type="button"
                          onClick={() => handleToggleTask(task._id)}
                          aria-label={
                            task.completed
                              ? "Mark task incomplete"
                              : "Mark task complete"
                          }
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                            task.completed
                              ? isDark
                                ? "border-[#A8E6CF] bg-[#A8E6CF] text-[#16221C]"
                                : "border-[#6BB88C] bg-[#6BB88C] text-white"
                              : isDark
                                ? "border-white/[0.15] bg-white/[0.02] text-transparent hover:border-white/[0.3]"
                                : "border-black/[0.1] bg-black/[0.015] text-transparent hover:border-black/[0.2]"
                          }`}
                        >
                          <Check size={17} strokeWidth={3} />
                        </button>

                        {/* TASK CONTENT */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                className={`wrap-break-word text-[15px] font-bold leading-6 tracking-[-0.015em] ${
                                  task.completed
                                    ? isDark
                                      ? "text-zinc-600 line-through"
                                      : "text-zinc-400 line-through"
                                    : primaryText
                                }`}
                              >
                                {task.title}
                              </p>

                              <p
                                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                                  task.completed ? mutedText : secondaryText
                                }`}
                              >
                                {task.completed
                                  ? "Completed"
                                  : "Ready to focus"}
                              </p>
                            </div>

                            <span
                              className={`font-num text-[10px] font-bold ${mutedText}`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          {/* ACTIONS */}

                          <div className="mt-5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleFocusTask(task)}
                              disabled={task.completed}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 ${
                                isDark
                                  ? "bg-[#F5F5F2] text-black hover:bg-white"
                                  : "bg-[#171917] text-white hover:bg-black"
                              }`}
                            >
                              <Play
                                size={13}
                                fill="currentColor"
                                strokeWidth={2}
                              />
                              Focus
                            </button>

                            <button
                              type="button"
                              onClick={() => setTaskToDelete(task)}
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                isDark
                                  ? "border-white/[0.07] bg-white/[0.02] text-zinc-600 hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-400"
                                  : "border-black/[0.07] bg-black/[0.015] text-zinc-500 hover:border-red-400/20 hover:bg-red-50 hover:text-red-500"
                              }`}
                              aria-label={`Delete ${task.title}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM ACCENT */}

                      {!task.completed && (
                        <div
                          className={`absolute bottom-0 left-0 h-[3px] w-full ${accent.line}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />

      {/* ========================================================
          DELETE MODAL
      ======================================================== */}

      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-[30px] border p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-7 ${
              isDark
                ? "border-white/[0.1] bg-[#191A1C]"
                : "border-black/[0.07] bg-[#FAFAF7]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isDark
                    ? "bg-red-400/10 text-red-400"
                    : "bg-[#FDE2DC] text-[#C15E49]"
                }`}
              >
                <Trash2 size={19} />
              </div>

              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                disabled={isDeleting}
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isDark
                    ? "text-zinc-600 hover:bg-white/5 hover:text-white"
                    : "text-zinc-400 hover:bg-black/5 hover:text-black"
                }`}
                aria-label="Close delete dialog"
              >
                <X size={17} />
              </button>
            </div>

            <h2
              className={`mt-5 text-xl font-bold tracking-[-0.03em] ${primaryText}`}
            >
              Delete this task?
            </h2>

            <p
              className={`mt-2 wrap-break-word text-sm leading-6 ${secondaryText}`}
            >
              You're about to remove "{taskToDelete.title}". This can't be
              undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                disabled={isDeleting}
                className={`rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
                  isDark
                    ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                    : "border-black/[0.07] bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="rounded-2xl bg-[#E96D57] px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#DD604A] active:scale-[0.98] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

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

  /*
   * ============================================================
   * THEME
   * ============================================================
   */

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  /*
   * ============================================================
   * LOAD TASKS
   * ============================================================
   */

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

  /*
   * ============================================================
   * CREATE TASK
   * ============================================================
   */

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

  /*
   * ============================================================
   * TOGGLE TASK
   * ============================================================
   */

  const handleToggleTask = async (taskId) => {
    // Save the current state in case the API fails
    const previousTasks = tasks;

    // Update UI immediately
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
    } catch (error) {
      // Roll back if request fails
      setTasks(previousTasks);

      console.log("Error updating task:", error);
    }
  };

  /*
   * ============================================================
   * DELETE TASK
   * ============================================================
   */

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

  /*
   * ============================================================
   * FOCUS TASK
   * ============================================================
   */

  const handleFocusTask = (task) => {
    localStorage.setItem("selectedTask", JSON.stringify(task));

    window.dispatchEvent(new Event("selectedTaskChanged"));

    navigate("/dashboard");
  };

  /*
   * ============================================================
   * TASK COUNTS
   * ============================================================
   */

  const completedTasks = tasks.filter((task) => task.completed).length;

  const activeTasks = tasks.filter((task) => !task.completed).length;

  const completionPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  /*
   * ============================================================
   * COLORS
   * ============================================================
   */

  const pageClass = isDark
    ? "bg-[#121214] text-white"
    : "bg-[#F4F6F3] text-[#171717]";

  const primaryText = isDark ? "text-white" : "text-[#171717]";

  const secondaryText = isDark ? "text-zinc-400" : "text-[#5D625C]";

  const mutedText = isDark ? "text-zinc-600" : "text-[#858B82]";

  // const borderClass = isDark ? "border-white/[0.08]" : "border-black/[0.07]";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${pageClass}`}
    >
      <Sidebar theme={theme} />

      <main className="min-h-screen w-full pb-24 md:pl-60">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="px-5 pb-6 pt-7 sm:px-8 sm:pt-9 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    isDark
                      ? "border-white/10 bg-white/[0.035] text-zinc-400"
                      : "border-black/[0.07] bg-white text-zinc-500 shadow-sm"
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
                className={`hidden rounded-[24px] border px-5 py-4 text-right sm:block ${
                  isDark
                    ? "border-white/10 bg-[#1A1A1D]"
                    : "border-black/[0.07] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                }`}
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
              BENTO TOP ROW
          ==================================================== */}

          <div className="grid gap-4 md:grid-cols-[1.65fr_0.8fr_0.8fr]">
            {/* ADD TASK */}

            <form
              onSubmit={handleCreateTask}
              className={`relative overflow-hidden rounded-[30px] border p-5 sm:p-6 ${
                isDark
                  ? "border-white/[0.08] bg-[#1A1A1D]"
                  : "border-black/[0.07] bg-[#DDF4E7] shadow-[0_14px_40px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-[#242428] text-[#A8E6CF]"
                        : "bg-[#BDE9D0] text-[#245B42]"
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
                        ? "border-white/10 bg-[#121214] text-white placeholder:text-zinc-600 focus:border-white/20"
                        : "border-black/[0.07] bg-white text-[#171717] placeholder:text-zinc-400 focus:border-black/15"
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={!title.trim()}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${
                      isDark
                        ? "bg-[#F7F7F5] text-black hover:bg-white"
                        : "bg-[#171717] text-white hover:bg-black"
                    }`}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add task
                  </button>
                </div>
              </div>

              {/* DECORATION */}

              <div
                className={`pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full ${
                  isDark ? "bg-[#A8E6CF]/5" : "bg-[#A8E6CF]/40"
                }`}
              />
            </form>

            {/* ACTIVE */}

            <div
              className={`rounded-[30px] border p-5 sm:p-6 ${
                isDark
                  ? "border-white/[0.08] bg-[#19191C]"
                  : "border-black/[0.07] bg-[#CFE9FA] shadow-[0_14px_40px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-[#242428] text-[#8FD3FF]"
                      : "bg-[#B7DDF5] text-[#275C78]"
                  }`}
                >
                  <Clock3 size={19} />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                    isDark
                      ? "bg-white/5 text-zinc-500"
                      : "bg-white/50 text-[#537083]"
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

            {/* COMPLETED */}

            <div
              className={`rounded-[30px] border p-5 sm:p-6 ${
                isDark
                  ? "border-white/[0.08] bg-[#19191C]"
                  : "border-black/[0.07] bg-[#FFF0B8] shadow-[0_14px_40px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-[#242428] text-[#FFE08A]"
                      : "bg-[#FFE49A] text-[#80621A]"
                  }`}
                >
                  <Check size={19} strokeWidth={2.5} />
                </div>

                <span className={` text-xs font-bold ${secondaryText}`}>
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
                className={`mt-3 h-2 overflow-hidden rounded-full ${
                  isDark ? "bg-white/[0.07]" : "bg-black/[0.07]"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDark ? "bg-[#FFE08A]" : "bg-[#D5A900]"
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

          <div className="mt-5">
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
                className={`rounded-[30px] border p-8 sm:p-12 ${
                  isDark
                    ? "border-white/[0.08] bg-[#19191C]"
                    : "border-black/[0.07] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div className="mx-auto max-w-md text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] ${
                      isDark
                        ? "bg-[#242428] text-zinc-500"
                        : "bg-[#F2D8D1] text-[#B76D5B]"
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
                    isDark
                      ? "bg-[#1C2421] border-[#A8E6CF]/10"
                      : "bg-[#E3F5EA] border-[#BDE9D0]",
                    isDark
                      ? "bg-[#1C2227] border-[#8FD3FF]/10"
                      : "bg-[#E2F2FC] border-[#B7DDF5]",
                    isDark
                      ? "bg-[#24201B] border-[#FFE08A]/10"
                      : "bg-[#FFF4C9] border-[#FFE49A]",
                    isDark
                      ? "bg-[#241E21] border-[#FFB7A8]/10"
                      : "bg-[#FDE6E0] border-[#F6C6BC]",
                  ];

                  const accent = accentStyles[index % accentStyles.length];

                  return (
                    <div
                      key={task._id}
                      className={`group relative overflow-hidden rounded-[30px] border p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6 ${
                        task.completed
                          ? isDark
                            ? "border-white/[0.05] bg-[#171719] opacity-70"
                            : "border-black/[0.05] bg-white opacity-70"
                          : accent
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
                                ? "border-white/15 bg-black/10 text-transparent hover:border-white/30"
                                : "border-black/10 bg-white/50 text-transparent hover:border-black/20"
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
                                  ? "bg-white text-black hover:bg-zinc-200"
                                  : "bg-[#171717] text-white hover:bg-black"
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
                                  ? "border-white/8 bg-black/10 text-zinc-600 hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-400"
                                  : "border-black/7 bg-white/40 text-zinc-500 hover:border-red-400/20 hover:bg-red-50 hover:text-red-500"
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
                          className={`absolute bottom-0 left-0 h-1 w-full ${
                            index % 4 === 0
                              ? "bg-[#8FD3A8]"
                              : index % 4 === 1
                                ? "bg-[#8CC7E8]"
                                : index % 4 === 2
                                  ? "bg-[#E7C75E]"
                                  : "bg-[#E6A08E]"
                          }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-[30px] border p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-7 ${
              isDark
                ? "border-white/10 bg-[#19191C]"
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

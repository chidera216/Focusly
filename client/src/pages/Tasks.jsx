import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const navigate = useNavigate();

  const isDark = theme === "dark";

  /*
    ==========================================
    THEME
    ==========================================
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
    ==========================================
    LOAD TASKS
    ==========================================
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
    ==========================================
    CREATE TASK
    ==========================================
  */

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await api.post("/tasks", {
        title: title.trim(),
      });

      setTitle("");
      loadTasks();
    } catch (error) {
      console.log("Error creating task:", error);
    }
  };

  /*
    ==========================================
    TOGGLE TASK
    ==========================================
  */

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`);

      loadTasks();
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  /*
    ==========================================
    DELETE TASK
    ==========================================
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
    ==========================================
    FOCUS TASK
    ==========================================
  */

  const handleFocusTask = (task) => {
    localStorage.setItem("selectedTask", JSON.stringify(task));

    window.dispatchEvent(new Event("selectedTaskChanged"));

    navigate("/dashboard");
  };

  /*
    ==========================================
    THEME CLASSES
    ==========================================
  */

  const pageClass = isDark
    ? "bg-[#0B0B0D] text-white"
    : "bg-[#F7F7F5] text-[#171717]";

  const borderClass = isDark ? "border-white/[0.06]" : "border-black/[0.08]";

  const primaryText = isDark ? "text-white" : "text-[#171717]";

  const secondaryText = isDark ? "text-zinc-500" : "text-zinc-600";

  const mutedText = isDark ? "text-zinc-600" : "text-zinc-500";

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${pageClass}`}
    >
      <Sidebar theme={theme} />

      <main className="min-h-screen w-full md:pl-60">
        {/* HEADER */}

        <header
          className={`border-b px-5 py-8 transition-colors duration-300 sm:px-8 md:px-10 ${borderClass}`}
        >
          <div className="mx-auto w-full max-w-5xl">
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}
            >
              Workspace
            </p>

            <h1
              className={`mt-3 text-3xl font-semibold tracking-[-0.03em] ${primaryText}`}
            >
              Tasks
            </h1>

            <p className={`mt-2 text-sm ${secondaryText}`}>
              Decide what deserves your attention.
            </p>
          </div>
        </header>

        {/* CONTENT */}

        <section className="mx-auto w-full max-w-5xl px-5 py-8 pb-28 sm:px-8 md:px-10 md:pb-10">
          {/* ADD TASK */}

          <form
            onSubmit={handleCreateTask}
            className={`flex flex-col gap-3 border-b pb-8 sm:flex-row ${borderClass}`}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to focus on?"
              className={`min-w-0 flex-1 rounded-xl border px-4 py-3.5 text-sm outline-none transition-all duration-200 ${
                isDark
                  ? "border-white/7 bg-[#111114] text-white placeholder:text-zinc-700 focus:border-white/16 focus:bg-[#131316]"
                  : "border-black/8 bg-white text-[#171717] shadow-sm placeholder:text-zinc-400 focus:border-black/16 focus:shadow-md"
              }`}
            />

            <button
              type="submit"
              className={`rounded-xl px-7 py-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.99] ${
                isDark
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-[#171717] text-white shadow-sm hover:bg-black"
              }`}
            >
              Add task
            </button>
          </form>

          {/* TASK HEADING */}

          <div className="flex items-center justify-between py-7">
            <div>
              <p className={`text-sm font-medium ${primaryText}`}>Your tasks</p>

              <p className={`mt-1 text-xs ${mutedText}`}>
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          {/* TASKS */}

          {tasks.length === 0 ? (
            <div
              className={`rounded-2xl border py-16 text-center ${
                isDark
                  ? "border-white/6 bg-[#111114]"
                  : "border-black/[0.07] bg-white shadow-sm"
              }`}
            >
              <p className={`text-sm ${secondaryText}`}>Nothing here yet.</p>

              <p className={`mt-2 text-xs ${mutedText}`}>
                Add a task above to get started.
              </p>
            </div>
          ) : (
            <div
              className={`overflow-hidden rounded-2xl border ${
                isDark
                  ? "border-white/6 bg-[#111114]"
                  : "border-black/[0.07] bg-white shadow-sm"
              }`}
            >
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`group flex min-w-0 flex-col gap-4 border-b px-5 py-5 transition-colors last:border-b-0 sm:flex-row sm:items-center sm:justify-between ${
                    isDark
                      ? "border-white/6 hover:bg-white/1.5"
                      : "border-black/6 hover:bg-black/1.5"
                  }`}
                >
                  {/* LEFT */}

                  <div className="flex min-w-0 items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task._id)}
                      aria-label={
                        task.completed
                          ? "Mark task incomplete"
                          : "Mark task complete"
                      }
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        task.completed
                          ? isDark
                            ? "border-white bg-white"
                            : "border-[#171717] bg-[#171717]"
                          : isDark
                            ? "border-zinc-700 hover:border-zinc-400"
                            : "border-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {task.completed && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isDark ? "bg-black" : "bg-white"
                          }`}
                        />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`wrap-break-word text-sm ${
                          task.completed
                            ? isDark
                              ? "text-zinc-600 line-through"
                              : "text-zinc-400 line-through"
                            : isDark
                              ? "text-zinc-200"
                              : "text-zinc-800"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          task.completed
                            ? isDark
                              ? "text-zinc-700"
                              : "text-zinc-400"
                            : mutedText
                        }`}
                      >
                        {task.completed ? "Completed" : "Not completed"}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2 pl-9 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleFocusTask(task)}
                      disabled={task.completed}
                      className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                        isDark
                          ? "border-white/7 bg-[#151518] text-zinc-400 hover:border-white/14 hover:text-white disabled:border-white/4 disabled:bg-transparent disabled:text-zinc-700"
                          : "border-black/8 bg-white text-zinc-600 shadow-sm hover:border-black/14 hover:text-black disabled:border-black/5 disabled:bg-transparent disabled:text-zinc-400"
                      }`}
                    >
                      Focus
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      className={`rounded-lg px-3 py-2 text-xs transition-all duration-200 ${
                        isDark
                          ? "text-zinc-600 hover:bg-red-500/6 hover:text-red-400"
                          : "text-zinc-500 hover:bg-red-500/6 hover:text-red-500"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* DELETE MODAL */}

        {taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div
              className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isDark
                  ? "border-white/6 bg-[#111114]"
                  : "border-black/6 bg-white"
              }`}
            >
              <h2 className={`text-lg font-semibold ${primaryText}`}>
                Delete task?
              </h2>

              <p
                className={`mt-3 wrap-break-word text-sm leading-relaxed ${secondaryText}`}
              >
                Are you sure you want to delete "{taskToDelete.title}"?
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  disabled={isDeleting}
                  className={`rounded-lg px-5 py-2.5 text-sm transition-colors ${
                    isDark
                      ? "text-zinc-500 hover:bg-white/4 hover:text-white"
                      : "text-zinc-600 hover:bg-black/4 hover:text-black"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Tasks;

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

  const navigate = useNavigate();

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

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`);

      loadTasks();
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setIsDeleting(true);

      await api.delete(`/tasks/${taskToDelete._id}`);

      // Remove deleted task from localStorage
      const savedTask = localStorage.getItem("selectedTask");

      if (savedTask) {
        const selectedTask = JSON.parse(savedTask);

        if (selectedTask._id === taskToDelete._id) {
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

  const handleFocusTask = (task) => {
    localStorage.setItem("selectedTask", JSON.stringify(task));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0B0D] text-white">
      <Sidebar />

      <main className="min-h-screen w-full md:pl-60">
        {/* Header */}
        <header className="border-b border-white/6 px-5 py-8 sm:px-8 md:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-xs text-zinc-600">Workspace</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Tasks
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Decide what deserves your attention.
            </p>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto w-full max-w-5xl px-5 py-8 pb-28 sm:px-8 md:px-10 md:pb-10">
          {/* Add task */}
          <form
            onSubmit={handleCreateTask}
            className="
            flex flex-col gap-3
            border-b border-white/6
            pb-8
            sm:flex-row
          "
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to focus on?"
              className="
              min-w-0
              flex-1
              rounded-lg
              border border-white/[0.07]
              bg-[#111114]
              px-4
              py-3.5
              text-sm
              text-white
              outline-none
              placeholder:text-zinc-700
              transition-colors
              focus:border-white/15
            "
            />

            <button
              type="submit"
              className="
              rounded-lg
              bg-white
              px-7
              py-3.5
              text-sm
              font-medium
              text-black
              transition-colors
              hover:bg-zinc-200
            "
            >
              Add task
            </button>
          </form>

          {/* Task heading */}
          <div className="flex items-center justify-between py-7">
            <div>
              <p className="text-sm font-medium text-zinc-300">Your tasks</p>

              <p className="mt-1 text-xs text-zinc-600">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <div className="border-y border-white/6 py-16 text-center">
              <p className="text-sm text-zinc-500">Nothing here yet.</p>

              <p className="mt-2 text-xs text-zinc-700">
                Add a task above to get started.
              </p>
            </div>
          ) : (
            <div className="border-t border-white/6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="
                  group
                  flex
                  min-w-0
                  flex-col
                  gap-4
                  border-b
                  border-white/6
                  py-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
                >
                  {/* Left */}
                  <div className="flex min-w-0 items-center gap-4">
                    <button
                      onClick={() => handleToggleTask(task._id)}
                      aria-label={
                        task.completed
                          ? "Mark task incomplete"
                          : "Mark task complete"
                      }
                      className={`
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-colors
                      ${
                        task.completed
                          ? "border-white bg-white"
                          : "border-zinc-700 hover:border-zinc-400"
                      }
                    `}
                    >
                      {task.completed && (
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`
                        wrap-break-word
                        text-sm
                        ${
                          task.completed
                            ? "text-zinc-600 line-through"
                            : "text-zinc-200"
                        }
                      `}
                      >
                        {task.title}
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-700">
                        {task.completed ? "Completed" : "Not completed"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pl-9 sm:pl-0">
                    <button
                      onClick={() => handleFocusTask(task)}
                      disabled={task.completed}
                      className="
                      rounded-md
                      border border-white/[0.07]
                      bg-[#111114]
                      px-4
                      py-2
                      text-xs
                      font-medium
                      text-zinc-400
                      transition-colors
                      hover:border-white/[0.14]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:border-white/4
                      disabled:text-zinc-700
                    "
                    >
                      Focus
                    </button>

                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="
                      rounded-md
                      px-3
                      py-2
                      text-xs
                      text-zinc-600
                      transition-colors
                      hover:bg-red-500/6
                      hover:text-red-400
                    "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Delete modal */}
        {taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md border border-white/[0.07] bg-[#111114] p-6 shadow-2xl">
              <h2 className="text-lg font-semibold">Delete task?</h2>

              <p className="mt-3 wrap-break-word text-sm leading-relaxed text-zinc-500">
                Are you sure you want to delete "{taskToDelete.title}"?
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setTaskToDelete(null)}
                  disabled={isDeleting}
                  className="
                  rounded-lg
                  px-5
                  py-2.5
                  text-sm
                  text-zinc-500
                  transition-colors
                  hover:bg-white/4
                  hover:text-white
                "
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="
                  rounded-lg
                  bg-red-500
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-red-600
                  disabled:opacity-50
                "
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

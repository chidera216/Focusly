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
    <div className="min-h-screen flex text-white">
      <Sidebar />

      <main className="flex-1 min-w-0 w-full px-4 sm:px-6 py-10 pb-24 md:pb-10">
        <div className="w-full max-w-2xl mx-auto min-w-0">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>

          <p className="text-gray-400 mb-8">What do you want to focus on?</p>

          <form onSubmit={handleCreateTask} className="flex gap-3 mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a task..."
              className="flex-1 bg-[#23242D] rounded-lg px-4 py-3 outline-none"
            />

            <button
              type="submit"
              className="bg-white text-black px-6 rounded-lg font-medium"
            >
              Add
            </button>
          </form>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="w-full min-w-0 overflow-hidden bg-[#23242D] rounded-lg px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <span
                  className={`min-w-0 wrap-break-word ${
                    task.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleTask(task._id)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleFocusTask(task)}
                    disabled={task.completed}
                    className="text-sm text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  >
                    Focus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#23242D] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">Delete task?</h2>

            <p className="mt-3 text-gray-400">
              Are you sure you want to delete{" "}
              <span className="wrap-break-word">"{taskToDelete.title}"</span> ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg px-5 py-2 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Tasks;

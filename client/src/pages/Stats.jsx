import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import api from "../service/api";

const Stats = () => {
  const [range, setRange] = useState("week");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const ranges = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/sessions/stats/${range}`);

        setStats(res.data);
      } catch (error) {
        console.log("Statistics error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  /*
    Convert minutes into a readable decimal value.

    Examples:

    10 minutes  → 10.00 min
    45 minutes  → 45.00 min
    60 minutes  → 1.00 hrs
    90 minutes  → 1.50 hrs
    125 minutes → 2.08 hrs
  */
  const formatTime = (minutes) => {
    const numericMinutes = Number(minutes) || 0;

    if (numericMinutes < 60) {
      return `${numericMinutes.toFixed(2)} min`;
    }

    const hours = numericMinutes / 60;

    return `${hours.toFixed(2)} hrs`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      <main className="flex-1 min-w-0 w-full px-4 sm:px-6 py-10 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto min-w-0">
          <h1 className="text-3xl font-bold mb-2">Statistics</h1>

          <p className="text-gray-400 mb-8">
            Track your focus and productivity.
          </p>

          {/* Range selector */}
          <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
            {ranges.map((item) => (
              <button
                key={item.value}
                onClick={() => setRange(item.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  range === item.value
                    ? "bg-white text-black"
                    : "bg-[#23242D] text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-gray-500 text-sm mb-4">Updating statistics...</p>
          )}

          {stats ? (
            <>
              {/* Total focus */}
              <div className="bg-[#23242D] rounded-2xl p-6 mb-8 min-w-0 overflow-hidden">
                <p className="text-gray-400 mb-2">Total focused</p>

                <h2 className="text-4xl font-bold break-words">
                  {formatTime(stats.totalMinutes)}
                </h2>
              </div>

              {/* Task statistics */}
              <div className="min-w-0">
                <h2 className="text-xl font-semibold mb-4">Focus by Task</h2>

                {stats.taskStats.length === 0 ? (
                  <p className="text-gray-500">No task sessions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.taskStats.map((task) => (
                      <div
                        key={task.taskId}
                        className="bg-[#23242D] rounded-xl px-4 py-4 flex items-center justify-between gap-4 min-w-0 overflow-hidden"
                      >
                        {/* Task title */}
                        <p className="text-white min-w-0 flex-1 break-words">
                          {task.title}
                        </p>

                        {/* Focus time */}
                        <p className="text-gray-400 shrink-0 whitespace-nowrap text-sm sm:text-base">
                          {formatTime(task.totalMinutes)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            !loading && (
              <p className="text-gray-400">Unable to load statistics.</p>
            )
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomNav />
    </div>
  );
};

export default Stats;

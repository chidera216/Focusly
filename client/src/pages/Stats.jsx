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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0B0D] text-white">
      <Sidebar />

      <main className="min-h-screen w-full md:pl-60">
        {/* Header */}
        <header className="border-b border-white/6 px-5 py-8 sm:px-8 md:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-xs text-zinc-600">Overview</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Statistics
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              See where your focus time is going.
            </p>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto w-full max-w-5xl px-5 py-8 pb-28 sm:px-8 md:px-10 md:pb-10">
          {/* Range selector */}
          <div className="mb-8 flex w-full overflow-x-auto border-b border-white/6">
            {ranges.map((item) => (
              <button
                key={item.value}
                onClick={() => setRange(item.value)}
                className={`
                relative
                shrink-0
                px-5
                py-3
                text-xs
                font-medium
                transition-colors
                ${
                  range === item.value
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-300"
                }
              `}
              >
                {item.label}

                {range === item.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="mb-6 flex items-center gap-3 text-xs text-zinc-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
              Updating statistics...
            </div>
          )}

          {stats ? (
            <>
              {/* Main statistic */}
              <div className="border-y border-white/6 py-10">
                <p className="text-xs text-zinc-600">Total focused</p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="font-num text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                    {formatTime(stats.totalMinutes)}
                  </h2>

                  <p className="max-w-xs text-xs leading-relaxed text-zinc-600 sm:text-right">
                    Time spent in completed focus sessions during this period.
                  </p>
                </div>
              </div>

              {/* Task statistics */}
              <div className="mt-10">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Focus by task
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Your most focused work
                    </p>
                  </div>

                  <span className="text-xs text-zinc-700">
                    {stats.taskStats.length}{" "}
                    {stats.taskStats.length === 1 ? "task" : "tasks"}
                  </span>
                </div>

                {stats.taskStats.length === 0 ? (
                  <div className="border-y border-white/6 py-14 text-center">
                    <p className="text-sm text-zinc-500">
                      No focus sessions yet.
                    </p>

                    <p className="mt-2 text-xs text-zinc-700">
                      Complete a focus session to start seeing your data.
                    </p>
                  </div>
                ) : (
                  <div className="border-t border-white/6">
                    {stats.taskStats.map((task) => (
                      <div
                        key={task.taskId}
                        className="
                        grid
                        grid-cols-[minmax(0,1fr)_auto]
                        items-center
                        gap-5
                        border-b
                        border-white/6
                        py-5
                      "
                      >
                        {/* Task */}
                        <div className="min-w-0">
                          <p className="truncate text-sm text-zinc-300">
                            {task.title}
                          </p>

                          <div className="mt-3 h-0.5 w-full max-w-xl overflow-hidden bg-zinc-900">
                            <div
                              className="h-full bg-zinc-500"
                              style={{
                                width: `${
                                  stats.totalMinutes > 0
                                    ? Math.min(
                                        100,
                                        (Number(task.totalMinutes) /
                                          Number(stats.totalMinutes)) *
                                          100,
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Time */}
                        <p className="font-num whitespace-nowrap text-sm text-zinc-500">
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
              <div className="border-y border-white/6 py-14 text-center">
                <p className="text-sm text-zinc-500">
                  Unable to load statistics.
                </p>

                <p className="mt-2 text-xs text-zinc-700">
                  Try selecting another period.
                </p>
              </div>
            )
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;

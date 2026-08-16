import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import api from "../service/api";

const Stats = () => {
  const [range, setRange] = useState("week");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const isDark = theme === "dark";

  const ranges = [
    { label: "Today", value: "today" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
    { label: "This year", value: "year" },
  ];

  /*
   * ------------------------------------------------------------
   * THEME
   * ------------------------------------------------------------
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
   * ------------------------------------------------------------
   * FETCH STATS
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/sessions/stats/${range}`);

        if (!cancelled) {
          setStats(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Statistics error:",
            error.response?.data || error.message,
          );

          setStats(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [range]);

  /*
   * ------------------------------------------------------------
   * FORMATTERS
   * ------------------------------------------------------------
   */

  const formatTime = (minutes) => {
    const value = Number(minutes) || 0;

    if (value < 60) {
      return `${Math.round(value)} min`;
    }

    return `${(value / 60).toFixed(1)} hrs`;
  };

  const formatDetailedTime = (minutes) => {
    const value = Number(minutes) || 0;

    if (value < 60) {
      return `${Math.round(value)} min`;
    }

    const hours = Math.floor(value / 60);
    const remainingMinutes = Math.round(value % 60);

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  /*
   * ------------------------------------------------------------
   * DATA
   * ------------------------------------------------------------
   */

  const totalMinutes = Number(stats?.totalMinutes) || 0;

  const taskStats = useMemo(() => {
    if (!Array.isArray(stats?.taskStats)) {
      return [];
    }

    return [...stats.taskStats]
      .map((task) => ({
        ...task,
        totalMinutes: Number(task.totalMinutes) || 0,
      }))
      .sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [stats]);

  const topTask = taskStats[0] || null;

  const taskCount = taskStats.length;

  const averageTaskMinutes = taskCount > 0 ? totalMinutes / taskCount : 0;

  /*
   * ------------------------------------------------------------
   * THEME CLASSES
   * ------------------------------------------------------------
   */

  const pageClass = isDark
    ? "bg-[#0B0B0D] text-white"
    : "bg-[#F5F5F2] text-[#171717]";

  const borderClass = isDark ? "border-white/[0.07]" : "border-black/[0.075]";

  const primaryText = isDark ? "text-white" : "text-[#171717]";

  const secondaryText = isDark ? "text-zinc-400" : "text-[#555550]";

  const mutedText = isDark ? "text-zinc-600" : "text-[#777770]";

  const subtleText = isDark ? "text-zinc-700" : "text-[#999990]";

  const panelClass = isDark
    ? "border-white/[0.07] bg-[#111114]"
    : "border-black/[0.075] bg-white";

  const tableHeadClass = isDark ? "bg-white/[0.025]" : "bg-[#FAFAF7]";

  const tableHoverClass = isDark
    ? "hover:bg-white/[0.018]"
    : "hover:bg-[#FAFAF7]";

  const trackClass = isDark ? "bg-white/[0.06]" : "bg-[#E7E7E1]";

  const barClass = isDark ? "bg-white" : "bg-[#242421]";

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${pageClass}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full md:pl-60">
        {/* HEADER */}

        <header className={`border-b ${borderClass}`}>
          <div className="mx-auto flex min-h-24 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8 md:px-10">
            <div>
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}
              >
                Overview
              </p>

              <h1
                className={`mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl ${primaryText}`}
              >
                Statistics
              </h1>

              <p className={`mt-1.5 text-sm ${secondaryText}`}>
                A clear view of where your focus is going.
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.16em] ${subtleText}`}
              >
                Viewing
              </p>

              <p className={`mt-1 text-sm font-medium ${secondaryText}`}>
                {ranges.find((item) => item.value === range)?.label}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <section className="mx-auto w-full max-w-6xl px-5 py-8 pb-28 sm:px-8 md:px-10 md:pb-12">
          {/* RANGE */}

          <div
            className={`mb-8 inline-flex max-w-full rounded-lg border p-1 ${panelClass}`}
          >
            {ranges.map((item) => {
              const active = range === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRange(item.value)}
                  className={`shrink-0 rounded-md px-2.5 py-2 text-[11px] font-medium transition-colors sm:px-4 sm:text-xs ${
                    active
                      ? isDark
                        ? "bg-white text-black"
                        : "bg-[#171717] text-white"
                      : isDark
                        ? "text-zinc-500 hover:bg-white/4 hover:text-zinc-300"
                        : "text-[#777770] hover:bg-[#F1F1ED] hover:text-[#222]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* LOADING */}

          {loading && (
            <div
              className={`mb-6 flex items-center gap-3 border-b border-t px-1 py-3 text-xs ${borderClass} ${mutedText}`}
            >
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                  isDark ? "bg-zinc-400" : "bg-zinc-500"
                }`}
              />
              Updating statistics...
            </div>
          )}

          {stats ? (
            <>
              {/* SUMMARY */}

              <div
                className={`overflow-hidden rounded-xl border ${panelClass}`}
              >
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {/* TOTAL */}

                  <div
                    className={`border-b border-r px-5 py-6 lg:border-b-0 ${borderClass}`}
                  >
                    <p
                      className={`text-[10px] font-medium uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Total focus
                    </p>

                    <p
                      className={`mt-3 font-num text-3xl font-semibold tracking-[-0.055em] ${primaryText}`}
                    >
                      {formatTime(totalMinutes)}
                    </p>

                    <p className={`mt-1.5 text-xs ${mutedText}`}>
                      Completed sessions
                    </p>
                  </div>

                  {/* TASKS */}

                  <div
                    className={`border-b px-5 py-6 lg:border-b-0 lg:border-r ${borderClass}`}
                  >
                    <p
                      className={`text-[10px] font-medium uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Focused tasks
                    </p>

                    <p
                      className={`mt-3 font-num text-3xl font-semibold tracking-[-0.055em] ${primaryText}`}
                    >
                      {taskCount}
                    </p>

                    <p className={`mt-1.5 text-xs ${mutedText}`}>
                      Tasks with activity
                    </p>
                  </div>

                  {/* TOP TASK */}

                  <div className={`border-r px-5 py-6 ${borderClass}`}>
                    <p
                      className={`text-[10px] font-medium uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Top task
                    </p>

                    <p
                      className={`mt-3 truncate text-base font-semibold tracking-tight ${primaryText}`}
                    >
                      {topTask?.title || "No data"}
                    </p>

                    <p className={`mt-1.5 text-xs ${mutedText}`}>
                      {topTask
                        ? formatDetailedTime(topTask.totalMinutes)
                        : "Start a focus session"}
                    </p>
                  </div>

                  {/* AVERAGE */}

                  <div className="px-5 py-6">
                    <p
                      className={`text-[10px] font-medium uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Average
                    </p>

                    <p
                      className={`mt-3 font-num text-3xl font-semibold tracking-[-0.055em] ${primaryText}`}
                    >
                      {formatTime(averageTaskMinutes)}
                    </p>

                    <p className={`mt-1.5 text-xs ${mutedText}`}>
                      Focus per task
                    </p>
                  </div>
                </div>
              </div>

              {/* TABLE */}

              <div
                className={`mt-8 overflow-hidden rounded-xl border ${panelClass}`}
              >
                <div
                  className={`flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${borderClass}`}
                >
                  <div>
                    <h2 className={`text-sm font-semibold ${primaryText}`}>
                      Focus breakdown
                    </h2>

                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Your focus time by task.
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={`text-[10px] uppercase tracking-[0.14em] ${subtleText}`}
                    >
                      Total
                    </p>

                    <p
                      className={`mt-1 font-num text-sm font-medium ${secondaryText}`}
                    >
                      {formatDetailedTime(totalMinutes)}
                    </p>
                  </div>
                </div>

                {taskStats.length === 0 ? (
                  <div className="px-6 py-20 text-center">
                    <p className={`text-sm font-medium ${secondaryText}`}>
                      No focus data yet
                    </p>

                    <p
                      className={`mx-auto mt-2 max-w-sm text-xs leading-relaxed ${mutedText}`}
                    >
                      Complete a focus session and your activity will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* DESKTOP */}

                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr
                            className={`border-b ${borderClass} ${tableHeadClass}`}
                          >
                            <th
                              className={`w-16 px-6 py-3 text-left text-[10px] font-medium uppercase tracking-[0.14em] ${subtleText}`}
                            >
                              #
                            </th>

                            <th
                              className={`px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.14em] ${subtleText}`}
                            >
                              Task
                            </th>

                            <th
                              className={`px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.14em] ${subtleText}`}
                            >
                              Focus time
                            </th>

                            <th
                              className={`px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.14em] ${subtleText}`}
                            >
                              Share
                            </th>

                            <th
                              className={`w-65 px-6 py-3 text-right text-[10px] font-medium uppercase tracking-[0.14em] ${subtleText}`}
                            >
                              Distribution
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {taskStats.map((task, index) => {
                            const percentage =
                              totalMinutes > 0
                                ? Math.min(
                                    100,
                                    (task.totalMinutes / totalMinutes) * 100,
                                  )
                                : 0;

                            return (
                              <tr
                                key={task.taskId || task.title || index}
                                className={`group border-b last:border-b-0 ${borderClass} ${tableHoverClass}`}
                              >
                                <td className="px-6 py-5">
                                  <span
                                    className={`font-num text-xs ${
                                      index === 0 ? primaryText : subtleText
                                    }`}
                                  >
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                </td>

                                <td className="min-w-60 px-4 py-5">
                                  <p
                                    className={`max-w-[320px] truncate text-sm font-medium ${
                                      isDark
                                        ? "text-zinc-300 group-hover:text-white"
                                        : "text-[#33332F] group-hover:text-[#111]"
                                    }`}
                                  >
                                    {task.title || "Untitled task"}
                                  </p>

                                  <p
                                    className={`mt-1 text-[11px] ${subtleText}`}
                                  >
                                    Focus activity
                                  </p>
                                </td>

                                <td className="whitespace-nowrap px-4 py-5">
                                  <span
                                    className={`font-num text-sm font-medium ${
                                      isDark
                                        ? "text-zinc-300"
                                        : "text-[#454540]"
                                    }`}
                                  >
                                    {formatDetailedTime(task.totalMinutes)}
                                  </span>
                                </td>

                                <td className="whitespace-nowrap px-4 py-5">
                                  <span
                                    className={`font-num text-sm ${secondaryText}`}
                                  >
                                    {percentage.toFixed(0)}%
                                  </span>
                                </td>

                                <td className="px-6 py-5">
                                  <div className="flex items-center justify-end gap-3">
                                    <div
                                      className={`h-1.5 w-36 overflow-hidden rounded-full ${trackClass}`}
                                    >
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                                        style={{
                                          width: `${percentage}%`,
                                        }}
                                      />
                                    </div>

                                    <span
                                      className={`w-8 text-right text-[10px] ${subtleText}`}
                                    >
                                      {percentage.toFixed(0)}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE */}

                    <div className={`divide-y md:hidden ${borderClass}`}>
                      {taskStats.map((task, index) => {
                        const percentage =
                          totalMinutes > 0
                            ? Math.min(
                                100,
                                (task.totalMinutes / totalMinutes) * 100,
                              )
                            : 0;

                        return (
                          <div
                            key={task.taskId || task.title || index}
                            className="px-5 py-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex min-w-0 items-start gap-3">
                                <span
                                  className={`pt-0.5 font-num text-[10px] ${subtleText}`}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>

                                <div className="min-w-0">
                                  <p
                                    className={`truncate text-sm font-medium ${
                                      isDark
                                        ? "text-zinc-300"
                                        : "text-[#33332F]"
                                    }`}
                                  >
                                    {task.title || "Untitled task"}
                                  </p>

                                  <p
                                    className={`mt-1 text-[11px] ${mutedText}`}
                                  >
                                    {percentage.toFixed(0)}% of total focus
                                  </p>
                                </div>
                              </div>

                              <p
                                className={`shrink-0 font-num text-sm font-medium ${secondaryText}`}
                              >
                                {formatDetailedTime(task.totalMinutes)}
                              </p>
                            </div>

                            <div
                              className={`mt-4 h-1.5 overflow-hidden rounded-full ${trackClass}`}
                            >
                              <div
                                className={`h-full rounded-full ${barClass}`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* INSIGHT */}

              {topTask && (
                <div
                  className={`mt-6 border-b border-t px-1 py-5 ${borderClass}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-[10px] font-medium uppercase tracking-[0.15em] ${subtleText}`}
                      >
                        Focus insight
                      </p>

                      <p className={`mt-2 text-sm ${secondaryText}`}>
                        Your most focused task was{" "}
                        <span className={`font-medium ${primaryText}`}>
                          {topTask.title}
                        </span>
                        .
                      </p>
                    </div>

                    <p
                      className={`font-num text-sm font-medium ${secondaryText}`}
                    >
                      {formatDetailedTime(topTask.totalMinutes)}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div
                className={`rounded-xl border px-6 py-20 text-center ${panelClass}`}
              >
                <p className={`text-sm font-medium ${secondaryText}`}>
                  Unable to load statistics
                </p>

                <p className={`mt-2 text-xs ${mutedText}`}>
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

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Clock3,
  Flame,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

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
    { label: " week", value: "week" },
    { label: " month", value: "month" },
    { label: "year", value: "year" },
  ];

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
  // FETCH STATS
  // ============================================================

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

  // ============================================================
  // FORMATTERS
  // ============================================================

  const formatTime = (minutes) => {
    const value = Number(minutes) || 0;

    if (value < 60) {
      return `${Math.round(value)} min`;
    }

    const hours = Math.floor(value / 60);
    const remainingMinutes = Math.round(value % 60);

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const formatLargeTime = (minutes) => {
    const value = Number(minutes) || 0;

    if (value < 60) {
      return `${Math.round(value)}m`;
    }

    return `${(value / 60).toFixed(1)}h`;
  };

  // ============================================================
  // DATA
  // ============================================================

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

  // ============================================================
  // COLORS
  // ============================================================

  const pageClass = isDark
    ? "bg-[#121214] text-white"
    : "bg-[#F4F6F3] text-[#171817]";

  const cardBase = isDark
    ? "border-white/[0.07] shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    : "border-black/[0.06] shadow-[0_18px_50px_rgba(53,64,56,0.07)]";

  const darkCard = "bg-[#19191C]";
  const darkMint = "bg-[#17221F]";
  const darkBlue = "bg-[#181E26]";
  const darkCoral = "bg-[#251A1B]";
  const darkYellow = "bg-[#242118]";

  const primaryText = isDark ? "text-white" : "text-[#171817]";

  const secondaryText = isDark ? "text-zinc-300" : "text-[#555A55]";

  const mutedText = isDark ? "text-zinc-500" : "text-[#747A74]";

  // ============================================================
  // BENTO CARD
  // ============================================================

  const cardClass = (background) =>
    `rounded-[28px] border ${cardBase} ${background}`;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${pageClass}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full pb-28 md:pl-60 md:pb-12">
        <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-7 sm:py-7 md:px-10">
          {/* ==================================================
              TOP BAR
          ================================================== */}

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-xs font-semibold tracking-tight ${mutedText}`}
              >
                Your progress
              </p>

              <h1
                className={`mt-1 text-2xl font-bold tracking-[-0.045em] sm:text-3xl ${primaryText}`}
              >
                Statistics
              </h1>
            </div>

            <div
              className={`hidden rounded-full border px-4 py-2 text-xs font-semibold sm:block ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-zinc-300"
                  : "border-black/[0.06] bg-white text-zinc-600"
              }`}
            >
              {ranges.find((item) => item.value === range)?.label}
            </div>
          </div>

          {/* ==================================================
              RANGE SWITCHER
          ================================================== */}

          <div
            className={`mb-6 flex w-full flex-wrap items-center gap-1.5 rounded-[22px] border p-1.5 sm:w-fit ${cardBase} ${
              isDark ? "bg-[#19191C]" : "bg-white"
            }`}
          >
            {ranges.map((item) => {
              const active = range === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRange(item.value)}
                  className={`flex-1 rounded-[16px] px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:flex-none ${
                    active
                      ? isDark
                        ? "bg-white text-black shadow-sm"
                        : "bg-[#171817] text-white shadow-sm"
                      : isDark
                        ? "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                        : "text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* ==================================================
              BENTO GRID
          ================================================== */}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`h-52 animate-pulse rounded-[28px] border ${
                    isDark
                      ? "border-white/[0.05] bg-white/[0.03]"
                      : "border-black/[0.05] bg-white"
                  } ${item === 1 ? "lg:col-span-7" : "lg:col-span-5"}`}
                />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
              {/* ==================================================
                  FOCUS OVERVIEW
              ================================================== */}

              <div
                className={`relative min-h-[260px] overflow-hidden p-6 sm:p-7 lg:col-span-7 ${cardClass(
                  isDark ? darkMint : "bg-[#DDEFE6]",
                )}`}
              >
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          isDark
                            ? "bg-[#24352F] text-[#9FE3C4]"
                            : "bg-[#C7E5D6] text-[#2D7255]"
                        }`}
                      >
                        <Target size={18} strokeWidth={2} />
                      </div>

                      <span className={`text-xs font-bold ${secondaryText}`}>
                        FOCUS OVERVIEW
                      </span>
                    </div>

                    <h2
                      className={`mt-6 max-w-md text-3xl font-bold leading-[1.05] tracking-[-0.055em] sm:text-4xl ${primaryText}`}
                    >
                      You're building
                      <br />a good rhythm.
                    </h2>

                    <p
                      className={`mt-3 max-w-sm text-sm leading-6 ${secondaryText}`}
                    >
                      Keep showing up. Your focus sessions are adding up over
                      time.
                    </p>
                  </div>

                  <div className="mt-8">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${secondaryText}`}
                      >
                        Total focus
                      </span>

                      <span className={`text-xs font-semibold ${primaryText}`}>
                        {formatLargeTime(totalMinutes)}
                      </span>
                    </div>

                    <div
                      className={`h-3 overflow-hidden rounded-full ${
                        isDark ? "bg-white/[0.08]" : "bg-black/[0.07]"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          isDark ? "bg-[#9FE3C4]" : "bg-[#4E9B78]"
                        }`}
                        style={{
                          width: totalMinutes > 0 ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute -right-12 -top-16 h-48 w-48 rounded-full border-[26px] ${
                    isDark ? "border-[#9FE3C4]/10" : "border-[#4E9B78]/10"
                  }`}
                />

                <div
                  className={`absolute -bottom-24 -right-8 h-52 w-52 rounded-full ${
                    isDark ? "bg-[#9FE3C4]/[0.04]" : "bg-white/40"
                  }`}
                />
              </div>

              {/* ==================================================
                  TOTAL FOCUS
              ================================================== */}

              <div
                className={`min-h-[260px] p-6 sm:p-7 lg:col-span-5 ${cardClass(
                  isDark ? darkBlue : "bg-[#DCEAF7]",
                )}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        isDark
                          ? "bg-[#263342] text-[#9BCBFF]"
                          : "bg-[#C5DFF3] text-[#3777A9]"
                      }`}
                    >
                      <Clock3 size={20} />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                        isDark
                          ? "bg-white/[0.06] text-zinc-400"
                          : "bg-white/60 text-zinc-500"
                      }`}
                    >
                      {ranges.find((item) => item.value === range)?.label}
                    </span>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${secondaryText}`}>
                      Total focus time
                    </p>

                    <p
                      className={`mt-2 text-5xl font-bold tracking-[0.005em] sm:text-6xl ${primaryText}`}
                    >
                      {formatLargeTime(totalMinutes)}
                    </p>

                    <p className={`mt-2 text-xs ${mutedText}`}>
                      Time you've spent in focus sessions.
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  TOP TASK
              ================================================== */}

              <div
                className={`min-h-[220px] p-6 sm:p-7 lg:col-span-4 ${cardClass(
                  isDark ? darkCoral : "bg-[#F7DDE0]",
                )}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        isDark
                          ? "bg-[#382527] text-[#FF9CA5]"
                          : "bg-[#F2C3C8] text-[#B94E5A]"
                      }`}
                    >
                      <Trophy size={20} />
                    </div>

                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-[#FF9CA5]" : "text-[#B94E5A]"
                      }`}
                    >
                      #1
                    </span>
                  </div>

                  <div>
                    <p className={`text-xs font-semibold ${secondaryText}`}>
                      MOST FOCUSED TASK
                    </p>

                    <p
                      className={`mt-2 truncate text-xl font-bold tracking-[-0.035em] ${primaryText}`}
                    >
                      {topTask?.title || "No task yet"}
                    </p>

                    <p className={`mt-1 text-sm ${mutedText}`}>
                      {topTask
                        ? `${formatTime(topTask.totalMinutes)} focused`
                        : "Start a session to see your top task."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  TASK COUNT
              ================================================== */}

              <div
                className={`min-h-[220px] p-6 sm:p-7 lg:col-span-4 ${cardClass(
                  isDark ? darkYellow : "bg-[#F5EDC9]",
                )}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-[#38331F] text-[#FFE28A]"
                        : "bg-[#EBDD9B] text-[#8C7523]"
                    }`}
                  >
                    <BarChart3 size={20} />
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${secondaryText}`}>
                      Focused tasks
                    </p>

                    <p
                      className={`mt-1 text-5xl font-bold tracking-[-0.07em] ${primaryText}`}
                    >
                      {taskCount}
                    </p>

                    <p className={`mt-2 text-xs ${mutedText}`}>
                      {taskCount === 1
                        ? "Task with focus activity"
                        : "Tasks with focus activity"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  AVERAGE
              ================================================== */}

              <div
                className={`min-h-[220px] p-6 sm:p-7 lg:col-span-4 ${cardClass(
                  isDark ? darkCard : "bg-[#E6E0F5]",
                )}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-[#302A3C] text-[#C9B5FF]"
                        : "bg-[#D6CCED] text-[#765BA8]"
                    }`}
                  >
                    <TrendingUp size={20} />
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${secondaryText}`}>
                      Average per task
                    </p>

                    <p
                      className={`mt-1 text-5xl font-bold tracking-[-0.07em] ${primaryText}`}
                    >
                      {formatTime(averageTaskMinutes)}
                    </p>

                    <p className={`mt-2 text-xs ${mutedText}`}>
                      Your average focus time across tasks.
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  TASK BREAKDOWN
              ================================================== */}

              <div
                className={`overflow-hidden p-0 lg:col-span-8 ${cardClass(
                  isDark ? darkCard : "bg-white",
                )}`}
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2
                        className={`text-xl font-bold tracking-[-0.04em] ${primaryText}`}
                      >
                        Focus breakdown
                      </h2>

                      <p className={`mt-1 text-xs ${mutedText}`}>
                        How your time is distributed.
                      </p>
                    </div>

                    <div
                      className={`hidden rounded-full px-3 py-1.5 text-[10px] font-bold sm:block ${
                        isDark
                          ? "bg-white/[0.05] text-zinc-400"
                          : "bg-[#F4F5F1] text-zinc-500"
                      }`}
                    >
                      {taskCount} {taskCount === 1 ? "task" : "tasks"}
                    </div>
                  </div>

                  {taskStats.length === 0 ? (
                    <div className="py-14 text-center">
                      <p className={`text-sm font-semibold ${secondaryText}`}>
                        No focus data yet
                      </p>

                      <p className={`mt-2 text-xs ${mutedText}`}>
                        Complete a focus session to start building your stats.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-7 space-y-5">
                      {taskStats.map((task, index) => {
                        const percentage =
                          totalMinutes > 0
                            ? Math.min(
                                100,
                                (task.totalMinutes / totalMinutes) * 100,
                              )
                            : 0;

                        const accentClasses = [
                          isDark ? "bg-[#9FE3C4]" : "bg-[#4E9B78]",
                          isDark ? "bg-[#9BCBFF]" : "bg-[#5E9AD0]",
                          isDark ? "bg-[#FF9CA5]" : "bg-[#D56B76]",
                          isDark ? "bg-[#FFE28A]" : "bg-[#C5A82F]",
                        ];

                        return (
                          <div key={task.taskId || task.title || index}>
                            <div className="mb-2.5 flex items-center justify-between gap-4">
                              <div className="flex min-w-0 items-center gap-3">
                                <span
                                  className={`font-num text-xs font-bold ${mutedText}`}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>

                                <p
                                  className={`truncate text-sm font-semibold ${primaryText}`}
                                >
                                  {task.title || "Untitled task"}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <span
                                  className={`font-num text-xs font-semibold ${secondaryText}`}
                                >
                                  {formatTime(task.totalMinutes)}
                                </span>

                                <span
                                  className={`font-num text-[10px] ${mutedText}`}
                                >
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                            </div>

                            <div
                              className={`h-3 overflow-hidden rounded-full ${
                                isDark ? "bg-white/[0.06]" : "bg-[#EEF0EB]"
                              }`}
                            >
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  accentClasses[index % accentClasses.length]
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  STREAK / MOTIVATION CARD
              ================================================== */}

              <div
                className={`relative min-h-[280px] overflow-hidden p-6 sm:p-7 lg:col-span-4 ${cardClass(
                  isDark ? "bg-[#201C18]" : "bg-[#F5E0B8]",
                )}`}
              >
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-[#392C20] text-[#FFB56B]"
                        : "bg-[#EACD99] text-[#A86D20]"
                    }`}
                  >
                    <Flame size={22} />
                  </div>

                  <div>
                    <p
                      className={`text-xs font-bold ${
                        isDark ? "text-orange-200/70" : "text-[#8A682C]"
                      }`}
                    >
                      KEEP THE MOMENTUM
                    </p>

                    <h3
                      className={`mt-2 text-2xl font-bold leading-tight tracking-[-0.045em] ${primaryText}`}
                    >
                      One session at a time.
                    </h3>

                    <p
                      className={`mt-3 max-w-xs text-xs leading-5 ${secondaryText}`}
                    >
                      Consistency matters more than having a perfect day.
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-20 -right-14 h-52 w-52 rounded-full blur-[2px] ${
                    isDark ? "bg-orange-400/[0.05]" : "bg-white/40"
                  }`}
                />

                <Flame
                  size={95}
                  strokeWidth={1}
                  className={`absolute -bottom-4 -right-3 rotate-12 ${
                    isDark ? "text-orange-300/[0.08]" : "text-orange-700/[0.08]"
                  }`}
                />
              </div>
            </div>
          ) : (
            !loading && (
              <div
                className={`rounded-[28px] border p-12 text-center ${cardClass(
                  isDark ? darkCard : "bg-white",
                )}`}
              >
                <p className={`text-sm font-semibold ${secondaryText}`}>
                  Couldn't load your statistics.
                </p>

                <p className={`mt-2 text-xs ${mutedText}`}>
                  Try selecting another time period.
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

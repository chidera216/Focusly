import { useCallback, useEffect, useState } from "react";
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Clock3,
  Coffee,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import BottomNavbar from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingModal";
import api from "../service/api";

const TIMER_STORAGE_KEY = "pomodoroTimer";

const getSavedTimer = () => {
  const saved = localStorage.getItem(TIMER_STORAGE_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem(TIMER_STORAGE_KEY);
    return null;
  }
};

const getStoredNumber = (key, fallback) => {
  const value = Number(localStorage.getItem(key));

  return value > 0 ? value : fallback;
};

const Dashboard = ({ isInstalled, onInstall }) => {
  // ============================================================
  // TIMER SETTINGS
  // ============================================================

  const [focusMinutes, setFocusMinutes] = useState(() =>
    getStoredNumber("focusMinutes", 25),
  );

  const [breakMinutes, setBreakMinutes] = useState(() =>
    getStoredNumber("breakMinutes", 8),
  );

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // ============================================================
  // TIMER STATE
  // ============================================================

  const [isRunning, setIsRunning] = useState(() => {
    const savedTimer = getSavedTimer();

    return savedTimer?.isRunning === true;
  });

  const [mode, setMode] = useState(() => {
    const savedTimer = getSavedTimer();

    return savedTimer?.mode || "focus";
  });

  const getDurationForMode = useCallback(
    (currentMode = mode) => {
      if (currentMode === "focus") {
        return focusMinutes * 60;
      }

      return breakMinutes * 60;
    },
    [mode, focusMinutes, breakMinutes],
  );

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimer = getSavedTimer();

    if (savedTimer?.timeLeft > 0) {
      return savedTimer.timeLeft;
    }

    return getStoredNumber("focusMinutes", 25) * 60;
  });

  // ============================================================
  // SELECTED TASK
  // ============================================================

  const [selectedTask, setSelectedTask] = useState(() => {
    const savedTask = localStorage.getItem("selectedTask");

    if (!savedTask) return null;

    try {
      return JSON.parse(savedTask);
    } catch {
      return null;
    }
  });

  // ============================================================
  // USER NAME
  // ============================================================

  const [userName, setUserName] = useState(() => {
    return (
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      ""
    );
  });

  // ============================================================
  // SETTINGS MODAL
  // ============================================================

  const [showSettings, setShowSettings] = useState(false);

  // ============================================================
  // THEME
  // ============================================================

  useEffect(() => {
    localStorage.setItem("theme", theme);

    window.dispatchEvent(new Event("themeChanged"));
  }, [theme]);

  // ============================================================
  // SAVE TIMER SETTINGS
  // ============================================================

  useEffect(() => {
    localStorage.setItem("focusMinutes", String(focusMinutes));
  }, [focusMinutes]);

  useEffect(() => {
    localStorage.setItem("breakMinutes", String(breakMinutes));
  }, [breakMinutes]);

  // ============================================================
  // SYNC SETTINGS FROM SETTINGS MODAL
  // ============================================================

  useEffect(() => {
    const handleSettingsChange = () => {
      const savedFocusMinutes = getStoredNumber("focusMinutes", 25);
      const savedBreakMinutes = getStoredNumber("breakMinutes", 8);
      const savedTheme = localStorage.getItem("theme") || "dark";

      setFocusMinutes(savedFocusMinutes);
      setBreakMinutes(savedBreakMinutes);
      setTheme(savedTheme);

      if (!isRunning) {
        const newDuration =
          mode === "focus" ? savedFocusMinutes * 60 : savedBreakMinutes * 60;

        setTimeLeft(newDuration);

        localStorage.setItem(
          TIMER_STORAGE_KEY,
          JSON.stringify({
            isRunning: false,
            mode,
            timeLeft: newDuration,
          }),
        );
      }
    };

    window.addEventListener("timerSettingsChanged", handleSettingsChange);

    return () => {
      window.removeEventListener("timerSettingsChanged", handleSettingsChange);
    };
  }, [mode, isRunning]);

  // ============================================================
  // SYNC USER NAME
  // ============================================================

  useEffect(() => {
    const handleUserSettingsChange = () => {
      const savedName =
        localStorage.getItem("userName") ||
        localStorage.getItem("name") ||
        localStorage.getItem("username") ||
        "";

      setUserName(savedName);
    };

    window.addEventListener("userSettingsChanged", handleUserSettingsChange);

    window.addEventListener("settingsChanged", handleUserSettingsChange);

    return () => {
      window.removeEventListener(
        "userSettingsChanged",
        handleUserSettingsChange,
      );

      window.removeEventListener("settingsChanged", handleUserSettingsChange);
    };
  }, []);

  // ============================================================
  // SELECTED TASK CHANGE
  // ============================================================

  useEffect(() => {
    const handleTaskChange = () => {
      const savedTask = localStorage.getItem("selectedTask");

      if (savedTask) {
        try {
          setSelectedTask(JSON.parse(savedTask));
        } catch (error) {
          console.log("Error reading selected task:", error);
          setSelectedTask(null);
        }
      } else {
        setSelectedTask(null);
        setMode("focus");
        setIsRunning(false);

        const duration = focusMinutes * 60;

        setTimeLeft(duration);

        localStorage.setItem(
          TIMER_STORAGE_KEY,
          JSON.stringify({
            isRunning: false,
            mode: "focus",
            timeLeft: duration,
          }),
        );
      }
    };

    window.addEventListener("selectedTaskChanged", handleTaskChange);

    return () => {
      window.removeEventListener("selectedTaskChanged", handleTaskChange);
    };
  }, [focusMinutes]);

  // ============================================================
  // SAVE SESSION
  // ============================================================

  const saveSession = useCallback(
    async (focusDuration) => {
      try {
        const res = await api.post("/sessions", {
          mode: "focus",
          duration: focusDuration / 60,
          task: selectedTask?._id || null,
        });

        console.log("Session saved:", res.data);
      } catch (error) {
        console.log(
          "Error saving session:",
          error.response?.data || error.message,
        );
      }
    },
    [selectedTask],
  );

  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = async () => {
      const savedTimer = getSavedTimer();

      if (!savedTimer?.isRunning || !savedTimer?.endTime) {
        return;
      }

      const remaining = Math.max(
        0,
        Math.ceil((savedTimer.endTime - Date.now()) / 1000),
      );

      setTimeLeft(remaining);

      // ========================================================
      // TIMER FINISHED
      // ========================================================

      if (remaining <= 0) {
        setIsRunning(false);

        // ======================================================
        // FOCUS FINISHED
        // Switch to break but DO NOT automatically start it.
        // ======================================================

        if (mode === "focus") {
          await saveSession(focusMinutes * 60);

          const nextMode = "short-break";
          const nextTime = breakMinutes * 60;

          setMode(nextMode);
          setTimeLeft(nextTime);

          localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify({
              isRunning: false,
              mode: nextMode,
              timeLeft: nextTime,
            }),
          );

          return;
        }

        // ======================================================
        // BREAK FINISHED
        // Switch back to focus but DO NOT automatically start.
        // ======================================================

        const nextMode = "focus";
        const nextTime = focusMinutes * 60;

        setMode(nextMode);
        setTimeLeft(nextTime);

        localStorage.setItem(
          TIMER_STORAGE_KEY,
          JSON.stringify({
            isRunning: false,
            mode: nextMode,
            timeLeft: nextTime,
          }),
        );
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, focusMinutes, breakMinutes, saveSession]);

  // ============================================================
  // TIMER VALUES
  // ============================================================

  const totalTime = getDurationForMode();

  const progress = totalTime > 0 ? timeLeft / totalTime : 0;

  const elapsedProgress = 1 - progress;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ============================================================
  // MODE
  // ============================================================

  const isBreakMode = mode === "short-break";

  const description = isBreakMode
    ? "Take a break and recharge."
    : selectedTask?.title || "What do you want to work on?";

  // ============================================================
  // TOGGLE TIMER
  // ============================================================

  const handleToggleTimer = () => {
    // ----------------------------------------------------------
    // PAUSE
    // ----------------------------------------------------------

    if (isRunning) {
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          isRunning: false,
          mode,
          timeLeft,
        }),
      );

      setIsRunning(false);

      return;
    }

    // ----------------------------------------------------------
    // START
    // ----------------------------------------------------------

    const endTime = Date.now() + timeLeft * 1000;

    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify({
        isRunning: true,
        mode,
        endTime,
      }),
    );

    setIsRunning(true);
  };

  // ============================================================
  // RESET TIMER
  // ============================================================

  const handleReset = () => {
    setIsRunning(false);

    const resetTime = getDurationForMode();

    setTimeLeft(resetTime);

    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify({
        isRunning: false,
        mode,
        timeLeft: resetTime,
      }),
    );
  };

  // ============================================================
  // ACCESSIBLE THEME CLASSES
  // ============================================================

  const isDark = theme === "dark";

  const pageClass = isDark
    ? "bg-[#121214] text-white"
    : "bg-[#F4F6F3] text-[#171918]";

  const primaryText = isDark ? "text-white" : "text-[#171918]";

  const secondaryText = isDark ? "text-zinc-300" : "text-zinc-700";

  const mutedText = isDark ? "text-zinc-300" : "text-zinc-700";

  const borderClass = isDark ? "border-white/[0.14]" : "border-black/[0.14]";

  const mainCard = isDark
    ? "border-white/[0.14] bg-[#19191C]"
    : "border-black/[0.12] bg-white";

  const softCard = isDark
    ? "border-white/[0.12] bg-[#171719]"
    : "border-black/[0.12] bg-white";

  // ============================================================
  // PERSONALIZED GREETING
  // ============================================================

  const greeting = userName ? `Hi, ${userName}!` : "Hi, Productive Friend!";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${pageClass}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full pb-24 md:pl-60" id="main-content">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-xl ${borderClass} ${
            isDark ? "bg-[#121214]/90" : "bg-[#F4F6F3]/90"
          }`}
        >
          <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between px-4 sm:px-7 md:px-10">
            <div className=" pt-6">
              <NavLink
                to="/dashboard"
                className="group flex items-center gap-3 rounded-2xl px-2 py-2"
              >
                <div
                  className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border ${
                    isDark
                      ? "border-white/[0.08] bg-[#171719]"
                      : "border-black/[0.06] bg-white shadow-sm"
                  }`}
                >
                  <img
                    src="/icons.svg"
                    alt="Focusly"
                    className="h-full w-full object-contain p-1.5"
                  />

                  <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-orange-400/[0.04]" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`font-['Plus_Jakarta_Sans'] text-[15px] font-bold tracking-[-0.03em] ${
                      isDark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Focusly
                  </p>

                  <p
                    className={`mt-0.5 text-[10px] ${
                      isDark ? "text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    Stay focused
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="flex items-center gap-2">
              {!isInstalled && (
                <button
                  type="button"
                  onClick={onInstall}
                  aria-label="Install Pomodoro app"
                  className={`
  flex
  h-9
  items-center
  rounded-xl
  border
  px-3
  text-xs
  font-medium
  transition-all
  duration-200
  focus:outline-none
  focus-visible:ring-4
  focus-visible:ring-orange-400/60
  focus-visible:ring-offset-2
  ${borderClass}
  ${
    isDark
      ? "bg-white/[0.035] text-zinc-300 hover:bg-white/[0.07] hover:text-white focus-visible:ring-offset-[#121214]"
      : "bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-offset-[#F4F6F3]"
  }
`}
                >
                  Install
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                aria-label="Open settings"
                title="Open settings"
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 ${borderClass} ${
                  isDark
                    ? "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white focus-visible:ring-offset-[#121214]"
                    : "bg-white text-zinc-700 shadow-sm hover:text-black focus-visible:ring-offset-[#F4F6F3]"
                }`}
              >
                <Settings size={17} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <section
          className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 sm:px-7 sm:py-8 md:px-10"
          aria-label="Pomodoro dashboard"
        >
          {/* ====================================================
              TOP BANNER
          ==================================================== */}

          <div
            className={`relative mb-4 overflow-hidden rounded-[32px] border p-6 sm:p-8 ${mainCard}`}
          >
            <div
              aria-hidden="true"
              className={`absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl ${
                isBreakMode
                  ? isDark
                    ? "bg-sky-500/[0.08]"
                    : "bg-sky-300/[0.22]"
                  : isDark
                    ? "bg-orange-500/[0.08]"
                    : "bg-orange-300/[0.22]"
              }`}
            />

            <div
              aria-hidden="true"
              className={`absolute -bottom-20 left-1/3 h-40 w-40 rounded-full blur-3xl ${
                isDark ? "bg-yellow-500/[0.04]" : "bg-yellow-200/[0.18]"
              }`}
            />

            <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                  >
                    {isBreakMode ? "Recovery space" : "Your focus space"}
                  </span>
                </div>

                <h1
                  className={`max-w-2xl text-3xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-4xl ${primaryText}`}
                >
                  {isBreakMode
                    ? "Take a breather."
                    : selectedTask?.title || greeting}
                </h1>

                <p
                  className={`mt-3 max-w-xl text-sm leading-6 ${secondaryText}`}
                >
                  {description}
                </p>
              </div>

              {/* CURRENT PACE */}

              <div
                className={`flex shrink-0 items-center gap-4 rounded-[24px] border px-5 py-4 ${borderClass} ${
                  isDark ? "bg-white/[0.025]" : "bg-[#FAF9F6]"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${
                    isBreakMode
                      ? isDark
                        ? "bg-sky-500/10 text-sky-400"
                        : "bg-[#E0F1FA] text-sky-500"
                      : isRunning
                        ? isDark
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-orange-100 text-orange-500"
                        : isDark
                          ? "bg-white/[0.04] text-zinc-300"
                          : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {isBreakMode ? (
                    <Coffee size={24} aria-hidden="true" />
                  ) : (
                    <Flame
                      size={24}
                      aria-hidden="true"
                      className={isRunning ? "animate-pulse" : ""}
                    />
                  )}
                </div>

                <div>
                  <p className={`text-[10px] ${mutedText}`}>Current pace</p>

                  <p className={`mt-1 text-sm font-bold ${primaryText}`}>
                    {isBreakMode
                      ? isRunning
                        ? "Taking a break"
                        : "Break ready"
                      : isRunning
                        ? "In the zone"
                        : "Ready to focus"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              MAIN BENTO GRID
          ==================================================== */}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* ==================================================
                TIMER CARD
            ================================================== */}

            <div
              className={`relative min-h-[600px] overflow-hidden rounded-[32px] border ${mainCard}`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl ${
                  isBreakMode
                    ? isDark
                      ? "bg-sky-500/[0.08]"
                      : "bg-sky-300/[0.18]"
                    : isDark
                      ? "bg-orange-500/[0.08]"
                      : "bg-orange-300/[0.18]"
                }`}
              />

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl ${
                  isDark ? "bg-yellow-500/[0.05]" : "bg-yellow-200/[0.2]"
                }`}
              />

              <div className="relative flex min-h-[600px] flex-col items-center justify-center px-5 py-10">
                {/* STATUS */}

                <div
                  className={`absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${borderClass} ${
                    isBreakMode
                      ? isDark
                        ? "bg-sky-500/[0.06] text-sky-300"
                        : "bg-sky-50 text-sky-700"
                      : isDark
                        ? "bg-white/[0.035] text-zinc-300"
                        : "bg-black/[0.025] text-zinc-700"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      isRunning
                        ? isBreakMode
                          ? "animate-pulse bg-sky-400"
                          : "animate-pulse bg-orange-400"
                        : isBreakMode
                          ? "bg-sky-400"
                          : isDark
                            ? "bg-zinc-300"
                            : "bg-zinc-600"
                    }`}
                  />

                  {isBreakMode
                    ? isRunning
                      ? "Break in progress"
                      : "Break ready"
                    : isRunning
                      ? "In progress"
                      : "Ready"}
                </div>

                {/* ==================================================
                    FLAME / COFFEE VISUAL
                ================================================== */}

                <div
                  className="relative mt-8 flex h-[230px] w-[180px] items-end justify-center"
                  aria-hidden="true"
                >
                  {isBreakMode ? (
                    <div
                      className={`relative z-10 flex h-[190px] w-[190px] items-center justify-center rounded-full transition-all duration-1000 ${
                        isRunning ? "scale-110" : "scale-100"
                      }`}
                    >
                      <div
                        className={`absolute rounded-full blur-[50px] ${
                          isRunning ? "bg-sky-400/25" : "bg-sky-400/10"
                        }`}
                        style={{
                          width: "130px",
                          height: "130px",
                        }}
                      />

                      <div
                        className={`relative z-10 flex h-32 w-32 items-center justify-center rounded-full ${
                          isDark
                            ? "bg-sky-500/10 text-sky-400"
                            : "bg-[#E0F1FA] text-sky-500"
                        }`}
                      >
                        <Coffee size={64} strokeWidth={1.5} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`absolute bottom-0 rounded-full blur-[60px] transition-all duration-1000 ${
                          isRunning ? "bg-orange-500/30" : "bg-orange-500/10"
                        }`}
                        style={{
                          width: `${100 + progress * 100}px`,
                          height: `${100 + progress * 100}px`,
                        }}
                      />

                      <div
                        className={`absolute bottom-6 rounded-full blur-[35px] transition-all duration-1000 ${
                          isRunning ? "bg-yellow-400/30" : "bg-yellow-400/10"
                        }`}
                        style={{
                          width: `${70 + progress * 70}px`,
                          height: `${70 + progress * 70}px`,
                        }}
                      />

                      <div
                        className={`relative z-10 h-[275px] w-[205px] transition-all duration-1000 ease-out ${
                          isRunning ? "animate-pulse" : ""
                        }`}
                        style={{
                          transform: `scale(${0.68 + progress * 0.32})`,
                          transformOrigin: "bottom center",
                          filter: isRunning
                            ? "drop-shadow(0 0 20px rgba(255,120,20,0.35))"
                            : "drop-shadow(0 0 10px rgba(255,120,20,0.12))",
                        }}
                      >
                        <svg
                          viewBox="0 0 120 160"
                          className="h-full w-full overflow-visible"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient
                              id="dashboardOuterFlame"
                              x1="60"
                              y1="10"
                              x2="60"
                              y2="158"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0" stopColor="#FFFDE7" />
                              <stop offset="0.22" stopColor="#FFE082" />
                              <stop offset="0.48" stopColor="#FFB300" />
                              <stop offset="0.72" stopColor="#FF6D00" />
                              <stop offset="1" stopColor="#F4511E" />
                            </linearGradient>

                            <linearGradient
                              id="dashboardInnerFlame"
                              x1="60"
                              y1="70"
                              x2="60"
                              y2="150"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0" stopColor="#FFFFFF" />
                              <stop offset="0.35" stopColor="#FFF9C4" />
                              <stop offset="0.7" stopColor="#FFD54F" />
                              <stop offset="1" stopColor="#FF9800" />
                            </linearGradient>

                            <filter
                              id="dashboardFlameGlow"
                              x="-100%"
                              y="-100%"
                              width="300%"
                              height="300%"
                            >
                              <feGaussianBlur
                                stdDeviation="3.5"
                                result="blur"
                              />

                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          <path
                            d="
                              M60 158
                              C39 158 19 145 17 121
                              C15 99 28 85 36 69
                              C43 55 42 39 36 22
                              C36 22 58 35 67 59
                              C73 49 75 36 71 20
                              C71 20 98 45 104 73
                              C111 101 103 120 94 134
                              C85 149 73 158 60 158
                              Z
                            "
                            fill="url(#dashboardOuterFlame)"
                            filter="url(#dashboardFlameGlow)"
                          />

                          <path
                            d="
                              M61 150
                              C47 150 36 140 37 124
                              C38 109 50 99 53 82
                              C53 82 67 92 71 108
                              C77 99 79 88 75 77
                              C90 96 94 112 88 128
                              C83 142 72 150 61 150
                              Z
                            "
                            fill="url(#dashboardInnerFlame)"
                          />

                          <path
                            d="
                              M61 143
                              C54 143 49 137 50 130
                              C51 124 56 119 59 112
                              C65 118 69 125 68 132
                              C67 139 65 143 61 143
                              Z
                            "
                            fill="#FFFDE7"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </div>

                {/* ==================================================
                    TIMER
                ================================================== */}

                <div
                  className={`mt-2 whitespace-nowrap text-[clamp(4.8rem,10vw,7.4rem)] font-bold leading-none tracking-[-0.04em] ${primaryText}`}
                  role="timer"
                  aria-live="off"
                  aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
                >
                  {String(minutes).padStart(2, "0")}

                  <span
                    aria-hidden="true"
                    className={`mx-1 ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    :
                  </span>

                  {String(seconds).padStart(2, "0")}
                </div>

                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mt-6 flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    {isBreakMode ? (
                      <Coffee
                        size={13}
                        aria-hidden="true"
                        className={
                          isRunning
                            ? "text-sky-400"
                            : isDark
                              ? "text-zinc-300"
                              : "text-zinc-500"
                        }
                      />
                    ) : (
                      <Flame
                        size={13}
                        aria-hidden="true"
                        className={
                          isRunning
                            ? "animate-pulse text-orange-400"
                            : isDark
                              ? "text-zinc-300"
                              : "text-zinc-600"
                        }
                      />
                    )}

                    <div
                      className={`h-2 w-40 overflow-hidden rounded-full ${
                        isDark ? "bg-white/[0.12]" : "bg-black/[0.12]"
                      }`}
                      role="progressbar"
                      aria-label={
                        isBreakMode
                          ? "Break progress"
                          : "Pomodoro session progress"
                      }
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(elapsedProgress * 100)}
                      aria-valuetext={`${Math.round(
                        progress * 100,
                      )} percent remaining`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBreakMode
                            ? "bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-300"
                            : "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300"
                        }`}
                        style={{
                          width: `${Math.max(2, elapsedProgress * 100)}%`,
                        }}
                      />
                    </div>

                    {isBreakMode ? (
                      <Coffee
                        size={13}
                        aria-hidden="true"
                        className={
                          elapsedProgress > 0
                            ? "text-sky-400"
                            : isDark
                              ? "text-zinc-300"
                              : "text-zinc-500"
                        }
                      />
                    ) : (
                      <Flame
                        size={13}
                        aria-hidden="true"
                        className={
                          elapsedProgress > 0
                            ? "text-orange-400"
                            : isDark
                              ? "text-zinc-300"
                              : "text-zinc-500"
                        }
                      />
                    )}
                  </div>

                  <p
                    className={`mt-2 text-[9px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                  >
                    {Math.round(progress * 100)}% remaining
                  </p>
                </div>

                {/* ==================================================
                    CONTROLS
                ================================================== */}

                <div className="mt-7 flex w-full max-w-[370px] gap-3">
                  <button
                    type="button"
                    onClick={handleToggleTimer}
                    className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-[20px] text-sm font-bold transition-all active:scale-[0.98] ${
                      isRunning
                        ? isBreakMode
                          ? "bg-[#5BA9D6] text-white shadow-[0_12px_30px_rgba(91,169,214,0.2)] hover:bg-[#4d9dcb]"
                          : "bg-[#F47B5D] text-white shadow-[0_12px_30px_rgba(244,123,93,0.2)] hover:bg-[#ed6d4f]"
                        : isBreakMode
                          ? "bg-[#A8D8EE] text-[#16303D] shadow-[0_12px_30px_rgba(168,216,238,0.16)] hover:bg-[#9ccfe8]"
                          : "bg-[#A8D5BA] text-[#18251D] shadow-[0_12px_30px_rgba(168,213,186,0.16)] hover:bg-[#9dceb0]"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause size={17} fill="currentColor" />

                        {isBreakMode ? "Pause break" : "Pause"}
                      </>
                    ) : (
                      <>
                        <Play size={17} fill="currentColor" />

                        {isBreakMode ? "Take break" : "Start focus"}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset timer"
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border transition-all active:scale-[0.96] ${borderClass} ${
                      isDark
                        ? "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                        : "bg-[#FAF9F6] text-zinc-500 hover:bg-white hover:text-black"
                    }`}
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* ==================================================
                SIDE BENTO
            ================================================== */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {/* FOCUS */}

              {/* FOCUS */}
              <div
                className={`relative min-h-[190px] overflow-hidden rounded-[28px] border p-5 ${softCard}`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${
                    isDark ? "bg-orange-500/10" : "bg-[#F7C7B7]/50"
                  }`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isDark
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-[#FCE2D8] text-orange-500"
                      }`}
                    >
                      <Flame size={17} />
                    </span>

                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Focus
                    </span>
                  </div>

                  <p
                    className={`mt-7 text-4xl font-bold tracking-[-0.06em] ${primaryText}`}
                  >
                    {focusMinutes}
                  </p>

                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    minute session
                  </p>

                  {/* Focus progress only appears during focus mode */}
                  <div
                    className={`mt-5 h-2 overflow-hidden rounded-full ${
                      isDark ? "bg-white/[0.12]" : "bg-black/[0.12]"
                    }`}
                    role="progressbar"
                    aria-label="Focus session progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(
                      mode === "focus" ? elapsedProgress * 100 : 0,
                    )}
                  >
                    <div
                      className="h-full rounded-full bg-[#F29A7D] transition-all duration-500"
                      style={{
                        width:
                          mode === "focus" ? `${elapsedProgress * 100}%` : "0%",
                      }}
                    />
                  </div>

                  {/* Status */}
                  <p
                    className={`mt-3 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      mode === "focus"
                        ? isRunning
                          ? "text-orange-400"
                          : mutedText
                        : mutedText
                    }`}
                  >
                    {mode === "focus"
                      ? isRunning
                        ? "Currently focusing"
                        : "Focus session"
                      : "Waiting for focus"}
                  </p>
                </div>
              </div>

              {/* BREAK */}
              <div
                className={`relative min-h-[190px] overflow-hidden rounded-[28px] border p-5 ${softCard}`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute -bottom-8 -right-8 h-28 w-28 rounded-full blur-2xl ${
                    isDark ? "bg-sky-500/10" : "bg-[#BFDFF1]/60"
                  }`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isDark
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-[#E0F1FA] text-sky-500"
                      }`}
                    >
                      <Coffee size={17} />
                    </span>

                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
                    >
                      Break
                    </span>
                  </div>

                  <p
                    className={`mt-7 text-4xl font-bold tracking-[-0.06em] ${primaryText}`}
                  >
                    {breakMinutes}
                  </p>

                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    minute recovery
                  </p>

                  {/* Break progress */}
                  <div
                    className={`mt-5 h-2 overflow-hidden rounded-full ${
                      isDark ? "bg-white/[0.12]" : "bg-black/[0.12]"
                    }`}
                    role="progressbar"
                    aria-label="Break progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(
                      mode === "short-break" ? elapsedProgress * 100 : 0,
                    )}
                  >
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-500"
                      style={{
                        width:
                          mode === "short-break"
                            ? `${elapsedProgress * 100}%`
                            : "0%",
                      }}
                    />
                  </div>

                  {/* Status */}
                  <p
                    className={`mt-3 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      mode === "short-break"
                        ? isRunning
                          ? "text-sky-400"
                          : mutedText
                        : mutedText
                    }`}
                  >
                    {mode === "short-break"
                      ? isRunning
                        ? "Currently taking a break"
                        : "Break ready"
                      : "Waiting for break"}
                  </p>
                </div>
              </div>

              {/* SESSION STATUS */}

              <div
                className={`col-span-2 rounded-[28px] border p-5 lg:col-span-1 ${softCard}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.16em] ${mutedText}`}
                    >
                      Session status
                    </p>

                    <p
                      className={`mt-2 text-xl font-bold tracking-[-0.03em] ${primaryText}`}
                      aria-live="polite"
                    >
                      {isBreakMode
                        ? isRunning
                          ? "Enjoy your break."
                          : "Your break is ready."
                        : isRunning
                          ? "Stay focused."
                          : "Ready when you are."}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isBreakMode
                        ? isRunning
                          ? "bg-sky-500 text-white"
                          : isDark
                            ? "bg-sky-500/10 text-sky-400"
                            : "bg-[#E0F1FA] text-sky-500"
                        : isRunning
                          ? "bg-[#F29A7D] text-white"
                          : isDark
                            ? "bg-white/[0.06] text-zinc-300"
                            : "bg-[#FFF2C7] text-[#8A6915]"
                    }`}
                  >
                    {isBreakMode ? <Coffee size={19} /> : <Clock3 size={19} />}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div
                    className={`rounded-2xl p-3 ${
                      isDark ? "bg-white/[0.035]" : "bg-[#F4F6F3]"
                    }`}
                  >
                    <p className={`text-[9px] ${mutedText}`}>Mode</p>

                    <p className={`mt-1 text-xs font-bold ${primaryText}`}>
                      {isBreakMode ? "Break" : "Focus"}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl p-3 ${
                      isDark ? "bg-white/[0.035]" : "bg-[#F4F6F3]"
                    }`}
                  >
                    <p className={`text-[9px] ${mutedText}`}>Focus</p>

                    <p className={`mt-1 text-xs font-bold ${primaryText}`}>
                      {focusMinutes}m
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl p-3 ${
                      isDark ? "bg-white/[0.035]" : "bg-[#F4F6F3]"
                    }`}
                  >
                    <p className={`text-[9px] ${mutedText}`}>Break</p>

                    <p className={`mt-1 text-xs font-bold ${primaryText}`}>
                      {breakMinutes}m
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              SESSION INFO
          ==================================================== */}

          <div
            className={`mt-4 overflow-hidden rounded-[28px] border ${softCard}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <div
                className={`border-r px-5 py-5 sm:px-7 ${
                  isDark ? "border-white/[0.12]" : "border-black/[0.12]"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Focus
                </p>

                <p className={`mt-2 text-sm font-bold ${primaryText}`}>
                  {focusMinutes} {focusMinutes === 1 ? "minute" : "minutes"}
                </p>
              </div>

              <div
                className={`border-r px-5 py-5 sm:px-7 ${
                  isDark ? "border-white/[0.12]" : "border-black/[0.12]"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Break
                </p>

                <p className={`mt-2 text-sm font-bold ${primaryText}`}>
                  {breakMinutes} {breakMinutes === 1 ? "minute" : "minutes"}
                </p>
              </div>

              <div className="hidden px-5 py-5 sm:block sm:px-7">
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Status
                </p>

                <p
                  className={`mt-2 text-sm font-bold ${primaryText}`}
                  aria-live="polite"
                >
                  {isBreakMode
                    ? isRunning
                      ? "Break running"
                      : "Break ready"
                    : isRunning
                      ? "Running"
                      : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavbar />

      {/* ========================================================
          SETTINGS MODAL
      ======================================================== */}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        focusMinutes={focusMinutes}
        setFocusMinutes={setFocusMinutes}
        breakMinutes={breakMinutes}
        setBreakMinutes={setBreakMinutes}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default Dashboard;

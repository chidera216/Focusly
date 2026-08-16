import { useCallback, useEffect, useState } from "react";
import { Settings, Play, Pause, RotateCcw } from "lucide-react";

import BottomNavbar from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingModal";
import api from "../service/api";

const Dashboard = ({ isInstalled, onInstall }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  /*
    ============================================================
    TIMER SETTINGS
    ============================================================
  */

  const [focusMinutes, setFocusMinutes] = useState(() => {
    const saved = Number(localStorage.getItem("focusMinutes"));

    return saved > 0 ? saved : 25;
  });

  const [breakMinutes, setBreakMinutes] = useState(() => {
    const saved = Number(localStorage.getItem("breakMinutes"));

    return saved > 0 ? saved : 8;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [mode, setMode] = useState("focus");

  /*
    ============================================================
    SELECTED TASK
    ============================================================
  */

  const [selectedTask, setSelectedTask] = useState(() => {
    const savedTask = localStorage.getItem("selectedTask");

    if (!savedTask) return null;

    try {
      return JSON.parse(savedTask);
    } catch {
      return null;
    }
  });

  /*
    ============================================================
    CURRENT TIMER
    ============================================================
  */

  const getDurationForMode = (currentMode = mode) => {
    if (currentMode === "focus") {
      return focusMinutes * 60;
    }

    return breakMinutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = Number(localStorage.getItem("focusMinutes"));

    return (saved > 0 ? saved : 25) * 60;
  });

  /*
    ============================================================
    THEME
    ============================================================
  */

  useEffect(() => {
    localStorage.setItem("theme", theme);

    window.dispatchEvent(new Event("themeChanged"));
  }, [theme]);

  /*
    ============================================================
    SAVE TIMER SETTINGS
    ============================================================
  */

  useEffect(() => {
    localStorage.setItem("focusMinutes", String(focusMinutes));
  }, [focusMinutes]);

  useEffect(() => {
    localStorage.setItem("breakMinutes", String(breakMinutes));
  }, [breakMinutes]);

  /*
    ============================================================
    SELECTED TASK CHANGE
    ============================================================
  */

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
        setTimeLeft(focusMinutes * 60);
      }
    };

    window.addEventListener("selectedTaskChanged", handleTaskChange);

    return () => {
      window.removeEventListener("selectedTaskChanged", handleTaskChange);
    };
  }, [focusMinutes]);

  /*
    ============================================================
    TIMER SETTINGS CHANGED
    ============================================================
  */

  useEffect(() => {
    const handleSettingsChange = () => {
      const savedFocusMinutes =
        Number(localStorage.getItem("focusMinutes")) || 25;

      const savedBreakMinutes =
        Number(localStorage.getItem("breakMinutes")) || 8;

      setFocusMinutes(savedFocusMinutes);
      setBreakMinutes(savedBreakMinutes);

      if (!isRunning) {
        if (mode === "focus") {
          setTimeLeft(savedFocusMinutes * 60);
        } else {
          setTimeLeft(savedBreakMinutes * 60);
        }
      }
    };

    window.addEventListener("timerSettingsChanged", handleSettingsChange);

    return () => {
      window.removeEventListener("timerSettingsChanged", handleSettingsChange);
    };
  }, [isRunning, mode]);

  /*
    ============================================================
    SAVE SESSION
    ============================================================
  */

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

  /*
    ============================================================
    TIMER
    ============================================================
  */

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous > 1) {
          return previous - 1;
        }

        clearInterval(interval);

        setIsRunning(false);

        /*
          Focus finished
        */

        if (mode === "focus") {
          saveSession(focusMinutes * 60);

          setMode("short-break");
          setTimeLeft(breakMinutes * 60);

          return 0;
        }

        /*
          Break finished
        */

        setMode("focus");
        setTimeLeft(focusMinutes * 60);

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, focusMinutes, breakMinutes, saveSession]);

  /*
    ============================================================
    TIMER VALUES
    ============================================================
  */

  const totalTime = getDurationForMode();

  const progress = totalTime > 0 ? timeLeft / totalTime : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  /*
    ============================================================
    MODE
    ============================================================
  */

  const modeTitle = mode === "focus" ? "Focus session" : "Break";

  const description =
    mode === "focus"
      ? selectedTask?.title || "What do you want to work on?"
      : "Take a break and recharge.";

  /*
    ============================================================
    RESET
    ============================================================
  */

  const handleReset = () => {
    setIsRunning(false);

    setTimeLeft(getDurationForMode());
  };

  /*
    ============================================================
    MANUAL TIMER CHANGE
    ============================================================
  */

  const handleFocusMinutesChange = (value) => {
    const minutes = Number(value);

    setFocusMinutes(minutes);

    if (!isRunning && mode === "focus") {
      setTimeLeft(minutes * 60);
    }
  };

  const handleBreakMinutesChange = (value) => {
    const minutes = Number(value);

    setBreakMinutes(minutes);

    if (!isRunning && mode !== "focus") {
      setTimeLeft(minutes * 60);
    }
  };

  /*
    ============================================================
    THEME
    ============================================================
  */

  const isDark = theme === "dark";

  const pageClass = isDark
    ? "bg-[#090909] text-white"
    : "bg-[#F7F7F5] text-[#171717]";

  const headerClass = isDark ? "border-white/[0.06]" : "border-black/[0.07]";

  const primaryText = isDark ? "text-white" : "text-[#171717]";

  const secondaryText = isDark ? "text-zinc-500" : "text-zinc-600";

  const mutedText = isDark ? "text-zinc-600" : "text-zinc-500";

  /*
    ============================================================
    RENDER
    ============================================================
  */

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${pageClass}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full pb-24 md:pl-60">
        {/* HEADER */}

        <header
          className={`flex h-19 items-center justify-between border-b px-5 sm:px-8 md:px-10 ${headerClass}`}
        >
          <div className="min-w-0">
            <p className={`text-[13px] font-medium ${primaryText}`}>
              {modeTitle}
            </p>

            <p className={`mt-1 max-w-70 truncate text-xs ${secondaryText}`}>
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isInstalled && (
              <button
                type="button"
                onClick={onInstall}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isDark
                    ? "border-white/9 bg-white/3.5 text-zinc-300 hover:border-white/15 hover:bg-white/6 hover:text-white"
                    : "border-black/8 bg-white text-zinc-700 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-black/14 hover:text-black"
                }`}
              >
                Install
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                isDark
                  ? "border-white/8 bg-white/2.5 text-zinc-500 hover:border-white/14 hover:bg-white/6 hover:text-white"
                  : "border-black/8 bg-white text-zinc-600 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-black/14 hover:text-black"
              }`}
            >
              <Settings size={17} strokeWidth={1.7} />
            </button>
          </div>
        </header>

        {/* MAIN */}

        <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 md:px-10 md:py-14">
          {/* TASK HEADER */}

          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-3">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isRunning
                    ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                    : isDark
                      ? "bg-zinc-700"
                      : "bg-zinc-400"
                }`}
              />

              <p
                className={`text-[10px] font-medium uppercase tracking-[0.22em] ${mutedText}`}
              >
                {modeTitle}
              </p>
            </div>

            <h1
              className={`mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl md:text-5xl ${primaryText}`}
            >
              {selectedTask?.title || "What do you want to work on?"}
            </h1>

            <p className={`mt-3 max-w-xl text-sm leading-6 ${secondaryText}`}>
              {description}
            </p>
          </div>

          {/* TIMER HERO */}

          <div
            className={`relative overflow-hidden rounded-[36px] border ${
              isDark
                ? "border-white/7.5 bg-[#101010] shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
                : "border-black/6.5 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.06)]"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
                isDark ? "bg-white/12" : "bg-black/5"
              }`}
            />

            <div className="relative flex min-h-170 flex-col items-center justify-center px-5 py-16 sm:px-10">
              {/* STATUS */}

              <div
                className={`mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] ${mutedText}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isRunning
                      ? "animate-pulse bg-white"
                      : isDark
                        ? "bg-zinc-700"
                        : "bg-zinc-400"
                  }`}
                />

                {isRunning ? "In progress" : "Ready"}
              </div>

              {/* FLAME */}

              <div className="relative mt-2 flex h-82.5 w-82.5 items-end justify-center sm:h-90 sm:w-90">
                <div
                  className={`pointer-events-none absolute bottom-0 rounded-full blur-[90px] transition-all duration-1000 ${
                    progress > 0 ? "bg-orange-500/20" : "opacity-0"
                  }`}
                  style={{
                    width: `${110 + progress * 150}px`,
                    height: `${110 + progress * 150}px`,
                  }}
                />

                <div
                  className={`pointer-events-none absolute bottom-8 rounded-full blur-[45px] transition-all duration-1000 ${
                    progress > 0 ? "bg-yellow-400/20" : "opacity-0"
                  }`}
                  style={{
                    width: `${80 + progress * 100}px`,
                    height: `${80 + progress * 100}px`,
                  }}
                />

                <div
                  className="relative z-10 flex h-75 w-57.5 items-end justify-center transition-transform duration-1000 ease-out sm:h-82.5 sm:w-62.5"
                  style={{
                    transform: `scale(${0.25 + progress * 0.75})`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <svg
                    viewBox="0 0 120 160"
                    className="h-75 w-57.5 overflow-visible sm:h-82.5 sm:w-62.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="outerFlame"
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
                        id="innerFlame"
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
                        id="flameGlow"
                        x="-100%"
                        y="-100%"
                        width="300%"
                        height="300%"
                      >
                        <feGaussianBlur stdDeviation="3.5" result="blur" />

                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <path
                      className={isRunning && progress > 0 ? "flame-outer" : ""}
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
                      fill="url(#outerFlame)"
                      filter="url(#flameGlow)"
                    />

                    <path
                      className={isRunning && progress > 0 ? "flame-inner" : ""}
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
                      fill="url(#innerFlame)"
                    />

                    <path
                      className={isRunning && progress > 0 ? "flame-core" : ""}
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
              </div>

              {/* TIMER */}

              <div
                className={`font-num mt-1 text-[clamp(5.5rem,14vw,9rem)] font-semibold leading-[0.85] tracking-[-0.095em] ${primaryText}`}
              >
                {String(minutes).padStart(2, "0")}

                <span
                  className={
                    isDark ? "px-2 text-zinc-700" : "px-2 text-zinc-300"
                  }
                >
                  :
                </span>

                {String(seconds).padStart(2, "0")}
              </div>

              <p
                className={`mt-7 text-[11px] font-medium uppercase tracking-[0.18em] ${mutedText}`}
              >
                {Math.round(progress * 100)}% remaining
              </p>

              {/* CONTROLS */}

              <div className="mt-9 flex w-full max-w-90 gap-3">
                <button
                  type="button"
                  onClick={() => setIsRunning((previous) => !previous)}
                  className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-[#171717] text-white hover:bg-black"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause size={16} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" />
                      Start focus
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset timer"
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200 ${
                    isDark
                      ? "border-white/8 bg-white/2.5 text-zinc-500 hover:border-white/15 hover:bg-white/6 hover:text-white"
                      : "border-black/8 bg-[#FAFAF8] text-zinc-500 hover:border-black/14 hover:text-black"
                  }`}
                >
                  <RotateCcw size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* SESSION INFORMATION */}

          <div
            className={`mt-8 overflow-hidden rounded-3xl border ${
              isDark
                ? "border-white/6.5 bg-white/1.5"
                : "border-black/6 bg-white/70"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <div
                className={`border-r px-5 py-6 sm:px-7 ${
                  isDark ? "border-white/6" : "border-black/6"
                }`}
              >
                <p
                  className={`text-[9px] font-medium uppercase tracking-[0.2em] ${mutedText}`}
                >
                  Focus
                </p>

                <p className={`mt-2 text-sm font-medium ${primaryText}`}>
                  {focusMinutes} {focusMinutes === 1 ? "minute" : "minutes"}
                </p>
              </div>

              <div
                className={`border-r px-5 py-6 sm:px-7 ${
                  isDark ? "border-white/6" : "border-black/6"
                }`}
              >
                <p
                  className={`text-[9px] font-medium uppercase tracking-[0.2em] ${mutedText}`}
                >
                  Break
                </p>

                <p className={`mt-2 text-sm font-medium ${primaryText}`}>
                  {breakMinutes} {breakMinutes === 1 ? "minute" : "minutes"}
                </p>
              </div>

              <div className="hidden px-5 py-6 sm:block sm:px-7">
                <p
                  className={`text-[9px] font-medium uppercase tracking-[0.2em] ${mutedText}`}
                >
                  Status
                </p>

                <p className={`mt-2 text-sm font-medium ${primaryText}`}>
                  {isRunning ? "Running" : "Ready"}
                </p>
              </div>
            </div>
          </div>

          {/* QUICK CUSTOMIZATION */}

          <div
            className={`mt-8 rounded-3xl border px-5 py-6 sm:px-7 ${
              isDark
                ? "border-white/6.5 bg-white/1.5"
                : "border-black/6 bg-white/70"
            }`}
          >
            <div className="flex flex-col gap-6">
              <div>
                <p className={`text-sm font-medium ${primaryText}`}>
                  Timer duration
                </p>

                <p className={`mt-1 text-xs ${mutedText}`}>
                  Drag the controls to choose exactly how long you want to focus
                  or rest.
                </p>
              </div>

              {/* FOCUS SLIDER */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className={`text-xs font-medium ${secondaryText}`}>
                    Focus
                  </label>

                  <span
                    className={`font-num text-sm font-semibold ${primaryText}`}
                  >
                    {focusMinutes} min
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="180"
                  step="1"
                  value={focusMinutes}
                  disabled={isRunning}
                  onChange={(e) => handleFocusMinutesChange(e.target.value)}
                  className="h-2 w-full cursor-pointer accent-black disabled:cursor-not-allowed disabled:opacity-40 dark:accent-white"
                />

                <div
                  className={`mt-2 flex justify-between text-[10px] ${mutedText}`}
                >
                  <span>1 min</span>
                  <span>90 min</span>
                  <span>180 min</span>
                </div>
              </div>

              {/* BREAK SLIDER */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className={`text-xs font-medium ${secondaryText}`}>
                    Break
                  </label>

                  <span
                    className={`font-num text-sm font-semibold ${primaryText}`}
                  >
                    {breakMinutes} min
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={breakMinutes}
                  disabled={isRunning}
                  onChange={(e) => handleBreakMinutesChange(e.target.value)}
                  className="h-2 w-full cursor-pointer accent-black disabled:cursor-not-allowed disabled:opacity-40 dark:accent-white"
                />

                <div
                  className={`mt-2 flex justify-between text-[10px] ${mutedText}`}
                >
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <p className={`text-[11px] leading-5 ${mutedText}`}>
                You can choose any duration from 1–180 minutes for focus and
                1–60 minutes for breaks.
              </p>
            </div>
          </div>

          {/* SETTINGS */}

          <div
            className={`mt-8 flex items-center justify-between rounded-3xl border px-5 py-5 sm:px-7 ${
              isDark
                ? "border-white/6.5 bg-white/1.5"
                : "border-black/6 bg-white/70"
            }`}
          >
            <div>
              <p className={`text-sm font-medium ${primaryText}`}>
                Timer settings
              </p>

              <p className={`mt-1 text-xs ${mutedText}`}>
                Adjust your timer and appearance settings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                isDark
                  ? "border-white/8 bg-white/2.5 text-zinc-400 hover:border-white/14 hover:bg-white/6 hover:text-white"
                  : "border-black/8 bg-white text-zinc-600 shadow-sm hover:border-black/14 hover:text-black"
              }`}
            >
              <Settings size={14} />
              Settings
            </button>
          </div>
        </section>
      </main>

      <BottomNavbar />

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

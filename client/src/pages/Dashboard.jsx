import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import BottomNavbar from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingModal";
import api from "../service/api";

const Dashboard = ({ isInstalled, onInstall }) => {
  const [isRunning, setIsRunning] = useState(false);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Focus setting
  const [focusType, setFocusType] = useState(() => {
    return localStorage.getItem("focusType") || "short";
  });

  // Break setting
  const [breakType, setBreakType] = useState(() => {
    return localStorage.getItem("breakType") || "short";
  });

  // Current timer mode
  const [mode, setMode] = useState("focus");

  // Selected task
  const [selectedTask, setSelectedTask] = useState(() => {
    const savedTask = localStorage.getItem("selectedTask");

    return savedTask ? JSON.parse(savedTask) : null;
  });

  /*
    ==========================================
    TIMER DURATIONS
    ==========================================
  */

  const focusDurations = {
    short: 25 * 60,
    long: 60 * 60,
  };

  const breakDurations = {
    short: 8 * 60,
    long: 10 * 60,
  };

  const focusTime = focusDurations[focusType];

  const totalTime =
    mode === "focus"
      ? focusTime
      : mode === "short-break"
        ? breakDurations.short
        : breakDurations.long;

  const [timeLeft, setTimeLeft] = useState(focusTime);

  /*
    ==========================================
    SELECTED TASK LISTENER
    ==========================================
  */

  useEffect(() => {
    const handleTaskChange = () => {
      const savedTask = localStorage.getItem("selectedTask");

      if (savedTask) {
        try {
          const parsedTask = JSON.parse(savedTask);

          setSelectedTask(parsedTask);
        } catch (error) {
          console.log("Error reading selected task:", error);

          setSelectedTask(null);
        }
      } else {
        setSelectedTask(null);
        setMode("focus");
        setIsRunning(false);
        setTimeLeft(focusDurations[focusType]);
      }
    };

    window.addEventListener("selectedTaskChanged", handleTaskChange);

    return () => {
      window.removeEventListener("selectedTaskChanged", handleTaskChange);
    };
  }, [focusType]);

  /*
    ==========================================
    TIMER SETTINGS LISTENER
    ==========================================
  */

  useEffect(() => {
    const handleSettingsChange = () => {
      const savedFocusType = localStorage.getItem("focusType") || "short";

      const savedBreakType = localStorage.getItem("breakType") || "short";

      setFocusType(savedFocusType);
      setBreakType(savedBreakType);

      if (!isRunning) {
        if (mode === "focus") {
          setTimeLeft(focusDurations[savedFocusType]);
        } else if (mode === "short-break") {
          setTimeLeft(breakDurations.short);
        } else {
          setTimeLeft(breakDurations.long);
        }
      }
    };

    window.addEventListener("timerSettingsChanged", handleSettingsChange);

    return () => {
      window.removeEventListener("timerSettingsChanged", handleSettingsChange);
    };
  }, [isRunning, mode]);

  /*
    ==========================================
    SAVE FOCUS SESSION
    ==========================================
  */

  const saveSession = async (focusDuration) => {
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
  };

  /*
    ==========================================
    TIMER
    ==========================================
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
          saveSession(focusTime);

          if (breakType === "long") {
            setMode("long-break");

            setTimeLeft(breakDurations.long);
          } else {
            setMode("short-break");

            setTimeLeft(breakDurations.short);
          }
        } else if (mode === "short-break") {
          /*
          Short break finished
        */
          setMode("focus");

          setTimeLeft(focusDurations[focusType]);
        } else if (mode === "long-break") {
          /*
          Long break finished
        */
          setMode("focus");

          setTimeLeft(focusDurations[focusType]);
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, focusTime, focusType, breakType]);

  /*
    ==========================================
    PROGRESS
    ==========================================
  */

  const progress = totalTime > 0 ? timeLeft / totalTime : 0;

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  /*
    ==========================================
    MODE TITLE
    ==========================================
  */

  const modeTitle =
    mode === "focus"
      ? "Focus Mode"
      : mode === "short-break"
        ? "Short Break"
        : "Long Break";

  /*
    ==========================================
    DESCRIPTION
    ==========================================
  */

  const description =
    mode === "focus"
      ? selectedTask?.title || "What do you want to work on?"
      : mode === "short-break"
        ? "Take a short break"
        : "Take a long break";

  /*
    ==========================================
    RESET
    ==========================================
  */

  const handleReset = () => {
    setIsRunning(false);

    if (mode === "focus") {
      setTimeLeft(focusTime);
    } else if (mode === "short-break") {
      setTimeLeft(breakDurations.short);
    } else {
      setTimeLeft(breakDurations.long);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0B0D] text-white">
      {/* =====================================
          SIDEBAR
      ====================================== */}

      <Sidebar />

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="min-h-screen w-full md:pl-60">
        {/* =====================================
            TOP BAR
        ====================================== */}

        <header className="flex h-20 items-center justify-between border-b border-white/[0.06] px-5 sm:px-8 md:px-10">
          {/* Left */}

          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-300">
              {mode === "focus" ? "Focus session" : "Break"}
            </p>

            <p className="mt-1 max-w-[220px] truncate text-xs text-zinc-600 sm:max-w-md">
              {description}
            </p>
          </div>

          {/* Right */}

          <div className="flex shrink-0 items-center gap-2">
            {/* Install */}

            {!isInstalled && (
              <button
                onClick={onInstall}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#15151A]  px-4 py-2  text-xs font-medium  text-zinc-300  shadow-[0_8px_30px_rgba(0,0,0,0.25)]  transition-all duration-200  hover:border-white/[0.14]  hover:bg-[#1B1B21] hover:text-white active:scale-[0.98]"
              >
                Install App
              </button>
            )}

            {/* Settings */}

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-white/[0.07]
                bg-[#111114]
                text-zinc-500
                transition-colors
                hover:border-white/[0.12]
                hover:text-white
              "
            >
              <Settings size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {/* =====================================
            CONTENT
        ====================================== */}

        <section className="mx-auto flex w-full max-w-5xl flex-col px-5 py-10 sm:px-8 md:px-10 md:py-14">
          {/* Intro */}

          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              {modeTitle}
            </p>

            <h1 className="mt-3 max-w-3xl break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {selectedTask?.title || "What do you want to work on?"}
            </h1>
          </div>

          {/* =================================
              TIMER
          ================================== */}

          <div className="border-y border-white/[0.06] py-14 sm:py-20">
            <div className="text-center">
              {/* Time */}

              <div
                className="
                  font-num
                  text-[clamp(5rem,15vw,9rem)]
                  font-semibold
                  leading-none
                  tracking-[-0.08em]
                  text-white
                "
              >
                {String(minutes).padStart(2, "0")}

                <span className="px-2 text-zinc-700">:</span>

                {String(seconds).padStart(2, "0")}
              </div>

              {/* Status */}

              <p className="mt-6 text-sm text-zinc-600">
                {isRunning ? "Session in progress" : "Ready to start"}
              </p>
            </div>

            {/* =================================
                PROGRESS
            ================================== */}

            <div className="mx-auto mt-12 w-full max-w-2xl">
              <div className="h-[3px] w-full overflow-hidden bg-zinc-800">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-linear"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-[11px] text-zinc-600">
                <span>Progress</span>

                <span className="font-num">{Math.round(progress * 100)}%</span>
              </div>
            </div>

            {/* =================================
                CONTROLS
            ================================== */}

            <div className="mx-auto mt-10 flex w-full max-w-sm gap-3">
              <button
                type="button"
                onClick={() => setIsRunning((previous) => !previous)}
                className="
                  flex-1
                  rounded-lg
                  bg-white
                  py-3.5
                  text-sm
                  font-medium
                  text-black
                  transition-colors
                  hover:bg-zinc-200
                "
              >
                {isRunning ? "Pause" : "Start"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="
                  flex-1
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-[#111114]
                  py-3.5
                  text-sm
                  font-medium
                  text-zinc-400
                  transition-colors
                  hover:border-white/[0.14]
                  hover:text-white
                "
              >
                Reset
              </button>
            </div>
          </div>

          {/* =================================
              SESSION DETAILS
          ================================== */}

          <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-b border-white/[0.06]">
            <div className="py-6 pr-5">
              <p className="text-xs text-zinc-600">Focus</p>

              <p className="mt-2 text-sm font-medium text-zinc-300">
                {focusType === "short" ? "25 minutes" : "60 minutes"}
              </p>
            </div>

            <div className="py-6 pl-5">
              <p className="text-xs text-zinc-600">Break</p>

              <p className="mt-2 text-sm font-medium text-zinc-300">
                {breakType === "short" ? "8 minutes" : "10 minutes"}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================
          MOBILE NAVIGATION
      ====================================== */}

      <BottomNavbar />

      {/* =====================================
          SETTINGS MODAL
      ====================================== */}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        focusType={focusType}
        setFocusType={setFocusType}
        breakType={breakType}
        setBreakType={setBreakType}
      />
    </div>
  );
};

export default Dashboard;

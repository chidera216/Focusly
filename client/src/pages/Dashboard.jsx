import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import BottomNavbar from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingModal";
import api from "../service/api";

const Dashboard = () => {
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

  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  /*
    ==========================================
    TIMER DURATIONS
    ==========================================

    These are seconds for testing.

    Later change them to:

    const focusDurations = {
      short: 25 * 60,
      long: 50 * 60,
    };

    const breakDurations = {
      short: 5 * 60,
      long: 15 * 60,
    };
  */

  const focusDurations = {
    short: 25 * 60,
    long: 60 * 60,
  };

  const breakDurations = {
    short: 5 * 60,
    long: 10 * 60,
  };

  /*
    The currently selected focus duration.
  */
  const focusTime = focusDurations[focusType];

  /*
    The currently selected break duration.
  */
  const breakTime = breakDurations[breakType];

  /*
    Get the duration for the current mode.
  */
  const totalTime = mode === "focus" ? focusTime : breakTime;

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
        /*
          Task was deleted.

          Reset the dashboard back to
          Focus Mode with no selected task.
        */
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

      /*
        Don't interrupt a timer that is already running.

        The new duration will be used
        when the next session starts.
      */
      if (!isRunning) {
        if (mode === "focus") {
          setTimeLeft(focusDurations[savedFocusType]);
        } else {
          setTimeLeft(breakDurations[savedBreakType]);
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
        /*
          Timer still has time.
        */
        if (previous > 1) {
          return previous - 1;
        }

        /*
          Timer finished.
        */
        clearInterval(interval);

        setIsRunning(false);

        /*
          ======================================
          FOCUS FINISHED
          ======================================
        */

        if (mode === "focus") {
          /*
            Save the completed focus session.
          */
          saveSession(focusTime);

          /*
            Move to the selected break.

            If the user selected:

            Short → Short Break

            Long → Long Break
          */
          if (breakType === "long") {
            setMode("long-break");
            setTimeLeft(breakDurations.long);
          } else {
            setMode("short-break");
            setTimeLeft(breakDurations.short);
          }
        } else if (mode === "short-break") {
          /*
          ======================================
          SHORT BREAK FINISHED
          ======================================
        */
          setMode("focus");
          setTimeLeft(focusDurations[focusType]);
        } else if (mode === "long-break") {
          /*
          ======================================
          LONG BREAK FINISHED
          ======================================
        */
          setMode("focus");
          setTimeLeft(focusDurations[focusType]);
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, focusTime, breakTime, focusType, breakType]);

  /*
    ==========================================
    PROGRESS
    ==========================================
  */

  const progress = timeLeft / totalTime;

  const strokeDashoffset = circumference - progress * circumference;

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
      ? selectedTask?.title || "No task selected"
      : mode === "short-break"
        ? "Take a short break"
        : "Take a long break";

  /*
    ==========================================
    RESET TIMER
    ==========================================
  */

  const handleReset = () => {
    setIsRunning(false);

    if (mode === "focus") {
      setTimeLeft(focusTime);
    } else {
      setTimeLeft(breakTime);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* =====================================
          DESKTOP SIDEBAR
      ====================================== */}

      <Sidebar />

      {/* =====================================
          SETTINGS BUTTON
      ====================================== */}

      <button
        onClick={() => setShowSettings(true)}
        aria-label="Open settings"
        className="absolute top-6 right-6 z-20 p-3 rounded-xl bg-[#23242D] text-gray-400 hover:text-white hover:bg-[#2D2E38] transition"
      >
        <Settings size={20} />
      </button>

      {/* =====================================
          MAIN DASHBOARD
      ====================================== */}

      <main className="flex-1 w-full min-w-0 flex flex-col items-center justify-center px-4 sm:px-8 py-10 mb-20 md:mb-0">
        {/* Mode title */}

        <p className="uppercase tracking-[6px] text-gray-400 mb-10">
          {modeTitle}
        </p>

        {/* =================================
            TIMER
        ================================== */}

        <div className="relative w-[340px] h-[340px]">
          <svg className="-rotate-90" width="340" height="340">
            {/* Background circle */}

            <circle
              cx="170"
              cy="170"
              r={radius}
              stroke="#2A2B35"
              strokeWidth="6"
              fill="none"
            />

            {/* Progress circle */}

            <circle
              cx="170"
              cy="170"
              r={radius}
              stroke="#FFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 1s linear",
              }}
            />
          </svg>

          {/* Timer content */}

          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-7xl font-bold font-num">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </h1>

            <p className="mt-3 text-gray-400 text-center max-w-[240px] break-words">
              {description}
            </p>
          </div>
        </div>

        {/* =================================
            CONTROLS
        ================================== */}

        <div className="flex gap-5 mt-12">
          {/* Start / Pause */}

          <button
            onClick={() => setIsRunning((previous) => !previous)}
            className="bg-white text-black px-8 py-3 rounded-lg font-medium"
          >
            {isRunning ? "Pause" : "Start"}
          </button>

          {/* Reset */}

          <button
            onClick={handleReset}
            className="bg-[#23242D] px-8 py-3 rounded-lg font-medium"
          >
            Reset
          </button>
        </div>

        {/* =================================
            CURRENT SETTINGS
        ================================== */}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Focus: {focusType === "short" ? "Short" : "Long"}</p>

          <p>Break: {breakType === "short" ? "Short" : "Long"}</p>
        </div>
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

import { useState } from "react";
import { X, Minus, Plus, Moon, Sun } from "lucide-react";

const SettingsModal = ({
  isOpen,
  onClose,
  focusMinutes,
  setFocusMinutes,
  breakMinutes,
  setBreakMinutes,
  theme,
  setTheme,
}) => {
  const [draftFocus, setDraftFocus] = useState(focusMinutes);
  const [draftBreak, setDraftBreak] = useState(breakMinutes);

  if (!isOpen) return null;

  const isDark = theme === "dark";

  const updateFocus = (value) => {
    const minutes = Number(value);

    setDraftFocus(minutes);
    setFocusMinutes(minutes);

    localStorage.setItem("focusMinutes", minutes);
    window.dispatchEvent(new Event("timerSettingsChanged"));
  };

  const updateBreak = (value) => {
    const minutes = Number(value);

    setDraftBreak(minutes);
    setBreakMinutes(minutes);

    localStorage.setItem("breakMinutes", minutes);
    window.dispatchEvent(new Event("timerSettingsChanged"));
  };

  const changeFocus = (amount) => {
    const next = Math.min(180, Math.max(1, draftFocus + amount));
    updateFocus(next);
  };

  const changeBreak = (amount) => {
    const next = Math.min(60, Math.max(1, draftBreak + amount));
    updateBreak(next);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);

    window.dispatchEvent(new Event("themeChanged"));
  };

  const handleClose = () => {
    setDraftFocus(focusMinutes);
    setDraftBreak(breakMinutes);
    onClose();
  };

  const formatMinutes = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (remaining === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remaining} min`;
  };

  const colors = {
    overlay: "bg-black/60",
    modal: isDark
      ? "border-white/[0.07] bg-[#19191C]"
      : "border-black/[0.06] bg-[#FFFFFF]",
    card: isDark
      ? "border-white/[0.06] bg-white/[0.025]"
      : "border-black/[0.05] bg-[#F8FAF7]",
    text: isDark ? "text-white" : "text-[#171918]",
    secondary: isDark ? "text-zinc-400" : "text-zinc-600",
    muted: isDark ? "text-zinc-500" : "text-zinc-500",
    border: isDark ? "border-white/[0.07]" : "border-black/[0.06]",
    button: isDark
      ? "border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
      : "border-black/[0.06] bg-[#FAF9F6] text-zinc-500 hover:bg-white hover:text-black",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 backdrop-blur-md transition-colors duration-300 ${colors.overlay}`}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[32px] border shadow-[0_30px_100px_rgba(0,0,0,0.3)] ${colors.modal}`}
      >
        {/* Header */}

        <div
          className={`shrink-0 border-b px-5 py-5 sm:px-7 sm:py-6 ${colors.border}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${colors.muted}`}
                >
                  Focusly
                </p>

                <h2
                  className={`mt-1 text-xl font-bold tracking-[-0.04em] ${colors.text}`}
                >
                  Timer settings
                </h2>

                <p className={`mt-1 text-xs ${colors.muted}`}>
                  Make the timer fit the way you work.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close settings"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition active:scale-95 ${colors.border} ${colors.button}`}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
          <div className="space-y-4">
            {/* Appearance */}

            <section className={`rounded-[28px] border p-5 ${colors.card}`}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className={`text-sm font-bold ${colors.text}`}>
                    Appearance
                  </p>

                  <p className={`mt-1 text-xs ${colors.muted}`}>
                    Choose how Focusly looks.
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isDark
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-[#FFF2C7] text-[#B28B28]"
                  }`}
                >
                  {isDark ? <Moon size={17} /> : <Sun size={17} />}
                </div>
              </div>

              <div
                className={`grid grid-cols-2 gap-1.5 rounded-2xl border p-1.5 ${colors.border} ${
                  isDark ? "bg-white/[0.025]" : "bg-[#F4F6F3]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    theme === "dark"
                      ? "bg-[#29292D] text-white shadow-sm"
                      : colors.muted
                  }`}
                >
                  <Moon size={14} />
                  Dark
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    theme === "light"
                      ? "bg-white text-[#171918] shadow-sm"
                      : colors.muted
                  }`}
                >
                  <Sun size={14} />
                  Light
                </button>
              </div>
            </section>

            {/* Focus Duration */}

            <section className={`rounded-[28px] border p-5 ${colors.card}`}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className={`text-sm font-bold ${colors.text}`}>
                    Focus duration
                  </p>

                  <p className={`mt-1 text-xs ${colors.muted}`}>
                    Choose how long each focus session lasts.
                  </p>
                </div>

                <span
                  className={`font-num whitespace-nowrap text-lg font-semibold ${colors.text}`}
                >
                  {formatMinutes(draftFocus)}
                </span>
              </div>

              <div
                className={`rounded-[24px] border p-4 sm:p-5 ${colors.border} ${
                  isDark ? "bg-white/[0.02]" : "bg-[#F8FAF7]"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeFocus(-1)}
                    disabled={draftFocus <= 1}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${colors.border} ${colors.button}`}
                  >
                    <Minus size={16} />
                  </button>

                  <div className="text-center">
                    <p
                      className={`font-num text-4xl font-semibold tracking-[-0.06em] ${colors.text}`}
                    >
                      {draftFocus}
                    </p>

                    <p
                      className={`mt-1 text-[9px] font-bold uppercase tracking-[0.16em] ${colors.muted}`}
                    >
                      minutes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeFocus(1)}
                    disabled={draftFocus >= 180}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${colors.border} ${colors.button}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <input
                  type="range"
                  min="1"
                  max="180"
                  step="1"
                  value={draftFocus}
                  onChange={(e) => updateFocus(e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full accent-orange-500"
                />

                <div
                  className={`mt-2 flex justify-between text-[9px] font-medium ${colors.muted}`}
                >
                  <span>1 min</span>
                  <span>3 hours</span>
                </div>
              </div>
            </section>

            {/* Break Duration */}

            <section className={`rounded-[28px] border p-5 ${colors.card}`}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className={`text-sm font-bold ${colors.text}`}>
                    Break duration
                  </p>

                  <p className={`mt-1 text-xs ${colors.muted}`}>
                    Set your own break length.
                  </p>
                </div>

                <span
                  className={`font-num whitespace-nowrap text-lg font-semibold ${colors.text}`}
                >
                  {formatMinutes(draftBreak)}
                </span>
              </div>

              <div
                className={`rounded-[24px] border p-4 sm:p-5 ${colors.border} ${
                  isDark ? "bg-white/[0.02]" : "bg-[#F6FAFC]"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeBreak(-1)}
                    disabled={draftBreak <= 1}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${colors.border} ${colors.button}`}
                  >
                    <Minus size={16} />
                  </button>

                  <div className="text-center">
                    <p
                      className={`font-num text-4xl font-semibold tracking-[-0.06em] ${colors.text}`}
                    >
                      {draftBreak}
                    </p>

                    <p
                      className={`mt-1 text-[9px] font-bold uppercase tracking-[0.16em] ${colors.muted}`}
                    >
                      minutes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeBreak(1)}
                    disabled={draftBreak >= 60}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${colors.border} ${colors.button}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={draftBreak}
                  onChange={(e) => updateBreak(e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full accent-sky-500"
                />

                <div
                  className={`mt-2 flex justify-between text-[9px] font-medium ${colors.muted}`}
                >
                  <span>1 min</span>
                  <span>1 hour</span>
                </div>
              </div>
            </section>

            {/* Quick Presets */}

            <section className={`rounded-[28px] border p-5 ${colors.card}`}>
              <div className="mb-4">
                <p className={`text-sm font-bold ${colors.text}`}>
                  Quick presets
                </p>

                <p className={`mt-1 text-xs ${colors.muted}`}>
                  Jump straight to a common setup.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { focus: 15, break: 5, label: "15 / 5" },
                  { focus: 25, break: 5, label: "25 / 5" },
                  { focus: 45, break: 10, label: "45 / 10" },
                  { focus: 60, break: 10, label: "60 / 10" },
                ].map((preset) => {
                  const active =
                    draftFocus === preset.focus && draftBreak === preset.break;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        updateFocus(preset.focus);
                        updateBreak(preset.break);
                      }}
                      className={`rounded-2xl border px-3 py-3.5 text-xs font-bold transition active:scale-[0.98] ${
                        active
                          ? isDark
                            ? "border-orange-400/20 bg-orange-500/10 text-orange-400"
                            : "border-orange-200 bg-[#FCE2D8] text-orange-600"
                          : `${colors.border} ${
                              isDark
                                ? "bg-white/[0.02] text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                                : "bg-[#FAF9F6] text-zinc-500 hover:bg-white hover:text-black"
                            }`
                      }`}
                    >
                      <span className="font-num">{preset.focus}</span>
                      <span className={colors.muted}> / </span>
                      <span className="font-num">{preset.break}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}

        <div className={`shrink-0 border-t px-5 py-5 sm:px-7 ${colors.border}`}>
          <button
            type="button"
            onClick={handleClose}
            className={`w-full rounded-2xl py-3.5 text-xs font-bold transition active:scale-[0.99] ${
              isDark
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-[#171918] text-white hover:bg-black"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

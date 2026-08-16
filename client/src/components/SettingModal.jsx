import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#101012] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        {/* Header */}

        <div className="flex shrink-0 items-start justify-between border-b border-white/6 px-6 py-6 sm:px-7">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Focusly
            </p>

            <h2 className="text-xl font-semibold tracking-[-0.02em] text-white">
              Timer settings
            </h2>

            <p className="mt-1.5 text-sm text-zinc-500">
              Make the timer fit the way you work.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings */}

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-7">
          <div className="space-y-8">
            {/* Appearance */}

            <section>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-white">Appearance</h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Choose how Focusly looks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-white/6 bg-[#151517] p-1.5">
                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`rounded-xl px-4 py-3 text-sm transition-all ${
                    theme === "dark"
                      ? "bg-white font-medium text-black shadow-sm"
                      : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                  }`}
                >
                  Dark
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`rounded-xl px-4 py-3 text-sm transition-all ${
                    theme === "light"
                      ? "bg-white font-medium text-black shadow-sm"
                      : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                  }`}
                >
                  Light
                </button>
              </div>
            </section>

            {/* Focus Duration */}

            <section>
              <div className="mb-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Focus duration
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Choose exactly how long you want to focus.
                    </p>
                  </div>

                  <span className="font-num text-lg font-semibold text-white">
                    {formatMinutes(draftFocus)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-[#151517] p-5">
                {/* Number controls */}

                <div className="mb-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeFocus(-1)}
                    disabled={draftFocus <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="text-center">
                    <p className="font-num text-4xl font-semibold tracking-tighter text-white">
                      {draftFocus}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                      minutes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeFocus(1)}
                    disabled={draftFocus >= 180}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Slider */}

                <input
                  type="range"
                  min="1"
                  max="180"
                  step="1"
                  value={draftFocus}
                  onChange={(e) => updateFocus(e.target.value)}
                  className="w-full cursor-pointer accent-white"
                />

                <div className="mt-2 flex justify-between text-[10px] text-zinc-700">
                  <span>1 min</span>
                  <span>3 hours</span>
                </div>
              </div>
            </section>

            {/* Break Duration */}

            <section>
              <div className="mb-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Break duration
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Set your own break length.
                    </p>
                  </div>

                  <span className="font-num text-lg font-semibold text-white">
                    {formatMinutes(draftBreak)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-[#151517] p-5">
                {/* Number controls */}

                <div className="mb-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeBreak(-1)}
                    disabled={draftBreak <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="text-center">
                    <p className="font-num text-4xl font-semibold tracking-tighter text-white">
                      {draftBreak}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                      minutes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeBreak(1)}
                    disabled={draftBreak >= 60}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Slider */}

                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={draftBreak}
                  onChange={(e) => updateBreak(e.target.value)}
                  className="w-full cursor-pointer accent-white"
                />

                <div className="mt-2 flex justify-between text-[10px] text-zinc-700">
                  <span>1 min</span>
                  <span>1 hour</span>
                </div>
              </div>
            </section>

            {/* Quick presets */}

            <section>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-white">
                  Quick presets
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Or jump straight to a common setup.
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
                      className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                        active
                          ? "border-white/10 bg-white text-black"
                          : "border-white/6 bg-white/2 text-zinc-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}

        <div className="shrink-0 border-t border-white/6 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

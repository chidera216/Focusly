import { X } from "lucide-react";

const SettingsModal = ({
  isOpen,
  onClose,
  focusType,
  setFocusType,
  breakType,
  setBreakType,
}) => {
  if (!isOpen) return null;

  const handleFocusChange = (type) => {
    setFocusType(type);
    localStorage.setItem("focusType", type);

    window.dispatchEvent(new Event("timerSettingsChanged"));
  };

  const handleBreakChange = (type) => {
    setBreakType(type);
    localStorage.setItem("breakType", type);

    window.dispatchEvent(new Event("timerSettingsChanged"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/8 bg-[#101012] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/6 px-6 py-6 sm:px-7">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-700">
              Focusly
            </p>

            <h2 className="text-xl font-semibold tracking-[-0.02em] text-white">
              Settings
            </h2>

            <p className="mt-1.5 text-sm text-zinc-600">
              Adjust how your focus sessions work.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            text-zinc-600
            transition
            hover:bg-white/5
            hover:text-white
          "
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-8 px-6 py-7 sm:px-7">
          {/* Focus duration */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white">Focus duration</h3>

              <p className="mt-1 text-xs text-zinc-700">
                Choose how long you want each focus session to last.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/6 bg-[#151517] p-1.5">
              <button
                onClick={() => handleFocusChange("short")}
                className={`rounded-xl px-4 py-3 text-sm transition-all ${
                  focusType === "short"
                    ? "bg-white font-medium text-black shadow-sm"
                    : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                }`}
              >
                <span className="block">Short</span>
                <span
                  className={`mt-1 block text-[11px] ${
                    focusType === "short" ? "text-zinc-500" : "text-zinc-700"
                  }`}
                >
                  25 minutes
                </span>
              </button>

              <button
                onClick={() => handleFocusChange("long")}
                className={`rounded-xl px-4 py-3 text-sm transition-all ${
                  focusType === "long"
                    ? "bg-white font-medium text-black shadow-sm"
                    : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                }`}
              >
                <span className="block">Long</span>
                <span
                  className={`mt-1 block text-[11px] ${
                    focusType === "long" ? "text-zinc-500" : "text-zinc-700"
                  }`}
                >
                  60 minutes
                </span>
              </button>
            </div>
          </div>

          {/* Break duration */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white">Break duration</h3>

              <p className="mt-1 text-xs text-zinc-700">
                Give yourself enough time to reset between sessions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/6 bg-[#151517] p-1.5">
              <button
                onClick={() => handleBreakChange("short")}
                className={`rounded-xl px-4 py-3 text-sm transition-all ${
                  breakType === "short"
                    ? "bg-white font-medium text-black shadow-sm"
                    : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                }`}
              >
                <span className="block">Short</span>
                <span
                  className={`mt-1 block text-[11px] ${
                    breakType === "short" ? "text-zinc-500" : "text-zinc-700"
                  }`}
                >
                  5 minutes
                </span>
              </button>

              <button
                onClick={() => handleBreakChange("long")}
                className={`rounded-xl px-4 py-3 text-sm transition-all ${
                  breakType === "long"
                    ? "bg-white font-medium text-black shadow-sm"
                    : "text-zinc-600 hover:bg-white/4 hover:text-zinc-300"
                }`}
              >
                <span className="block">Long</span>
                <span
                  className={`mt-1 block text-[11px] ${
                    breakType === "long" ? "text-zinc-500" : "text-zinc-700"
                  }`}
                >
                  10 minutes
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/6 px-6 py-5 sm:px-7">
          <button
            onClick={onClose}
            className="
            w-full
            rounded-xl
            bg-white
            py-3.5
            text-sm
            font-medium
            text-black
            transition
            hover:bg-zinc-200
          "
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

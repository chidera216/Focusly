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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#181820] border border-white/5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>

            <p className="text-sm text-gray-500 mt-1">
              Customize your focus sessions
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-6">
          {/* Focus */}
          <div>
            <p className="text-sm font-medium text-white mb-3">
              Focus duration
            </p>

            <div className="flex bg-[#23242D] rounded-xl p-1">
              <button
                onClick={() => handleFocusChange("short")}
                className={`flex-1 py-2.5 rounded-lg text-sm transition ${
                  focusType === "short"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Short Focus
              </button>

              <button
                onClick={() => handleFocusChange("long")}
                className={`flex-1 py-2.5 rounded-lg text-sm transition ${
                  focusType === "long"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Long Focus
              </button>
            </div>
          </div>

          {/* Break */}
          <div>
            <p className="text-sm font-medium text-white mb-3">
              Break duration
            </p>

            <div className="flex bg-[#23242D] rounded-xl p-1">
              <button
                onClick={() => handleBreakChange("short")}
                className={`flex-1 py-2.5 rounded-lg text-sm transition ${
                  breakType === "short"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Short Break
              </button>

              <button
                onClick={() => handleBreakChange("long")}
                className={`flex-1 py-2.5 rounded-lg text-sm transition ${
                  breakType === "long"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Long Break
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

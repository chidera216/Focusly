import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";

const App = () => {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      const isInstalled = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;

      if (isInstalled) {
        return;
      }

      const dismissedUntil = localStorage.getItem(
        "focuslyInstallDismissedUntil",
      );

      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }

      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const handleDismissInstall = () => {
    const oneday = 24 * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      "focuslyInstallDismissedUntil",
      String(Date.now() + oneday),
    );

    setInstallPrompt(null);
  };

  return (
    <div className="text-white bg-[#0b0b0f] bg-linear-to-b from-[#161426] via-[#0b0b0f] via-20% to-[#0b0b0f]">
      {" "}
      <BrowserRouter>
        {" "}
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Dashboard />} />{" "}
        </Routes>{" "}
      </BrowserRouter>
      {installPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#16161c] p-8 text-center shadow-2xl">
            <h2 className="mb-3 text-xl font-bold text-white">
              Install Focusly
            </h2>

            <p className="mb-6 text-sm text-[#a0a0aa]">
              Install Focusly on your device for a faster and more convenient
              experience.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDismissInstall}
                className="w-full rounded-full border border-white/20 py-2 font-medium text-white"
              >
                Not now
              </button>

              <button
                type="button"
                onClick={handleInstall}
                className="w-full rounded-full bg-white py-2 font-medium text-black"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

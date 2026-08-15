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
  const [isInstalled, setIsInstalled] = useState(false);

  /*
    ==========================================
    PWA INSTALLATION
    ==========================================
  */

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      setIsInstalled(standalone);

      /*
        If the app is installed,
        there is no reason to keep the
        browser install prompt around.
      */
      if (standalone) {
        setInstallPrompt(null);
      }
    };

    checkInstalled();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    mediaQuery.addEventListener("change", checkInstalled);

    /*
      Browser fires this after the app
      has successfully been installed.
    */
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    /*
      Browser fires this when the website
      can be installed as a PWA.
    */
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      if (standalone) {
        return;
      }

      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener("change", checkInstalled);

      window.removeEventListener("appinstalled", handleAppInstalled);

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  /*
    ==========================================
    INSTALL APP
    ==========================================
  */

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();

        const { outcome } = await installPrompt.userChoice;

        if (outcome === "accepted") {
          setInstallPrompt(null);
        }
      } catch (error) {
        console.error("Installation error:", error);
      }

      return;
    }

    console.log("Native install prompt is not available.");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <BrowserRouter>
        <Routes>
          {/* Authentication */}

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard */}

          <Route
            path="/"
            element={
              <Dashboard
                installPrompt={installPrompt}
                isInstalled={isInstalled}
                onInstall={handleInstall}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                installPrompt={installPrompt}
                isInstalled={isInstalled}
                onInstall={handleInstall}
              />
            }
          />

          {/* Other pages */}

          <Route path="/tasks" element={<Tasks />} />

          <Route path="/stats" element={<Stats />} />

          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

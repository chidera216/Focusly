import { useEffect, useState } from "react";
import { User, Mail, LogOut, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import api from "../service/api";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  /*
   * ==========================================
   * THEME
   * ==========================================
   */

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  /*
   * ==========================================
   * COLORS
   * ==========================================
   */

  const page = isDark
    ? "bg-[#0D0D0F] text-[#F5F5F5]"
    : "bg-[#F7F7F5] text-[#171717]";

  const border = isDark ? "border-[#242428]" : "border-[#E5E5E1]";

  const subtleBorder = isDark ? "border-[#1E1E22]" : "border-[#ECECE8]";

  const primary = isDark ? "text-[#F5F5F5]" : "text-[#171717]";

  const secondary = isDark ? "text-[#A1A1AA]" : "text-[#666666]";

  const muted = isDark ? "text-[#66666D]" : "text-[#999999]";

  const surface = isDark ? "bg-[#141416]" : "bg-white";

  /*
   * ==========================================
   * FETCH USER
   * ==========================================
   */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        const currentUser = res.data.user;

        setUser(currentUser);
        setName(currentUser.name);
      } catch (error) {
        console.log(
          "Error fetching profile:",
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /*
   * ==========================================
   * UPDATE PROFILE
   * ==========================================
   */

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    try {
      setSaving(true);

      const res = await api.patch("/auth/me", {
        name: trimmedName,
      });

      setUser(res.data.user);
      setName(res.data.user.name);

      setIsEditing(false);
    } catch (error) {
      console.log(
        "Error updating profile:",
        error.response?.data || error.message,
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      localStorage.removeItem("selectedTask");

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className={`min-h-screen ${page}`}>
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center md:pl-60">
          <p className={`text-sm ${secondary}`}>Loading...</p>
        </main>

        <BottomNav />
      </div>
    );
  }

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${page}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full pb-20 md:pl-60">
        {/* ==================================
            HEADER
        ================================== */}

        <header className={`border-b ${border}`}>
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 md:px-10">
            <p
              className={`text-[11px] font-medium uppercase tracking-[0.16em] ${muted}`}
            >
              Account
            </p>

            <h1
              className={`mt-2 text-[28px] font-semibold tracking-[-0.035em] ${primary}`}
            >
              Profile
            </h1>
          </div>
        </header>

        {/* ==================================
            CONTENT
        ================================== */}

        <section className="mx-auto w-full max-w-4xl px-5 py-10 pb-28 sm:px-8 md:px-10 md:pb-12">
          {/* ==================================
              IDENTITY
          ================================== */}

          <section className={`border-b pb-10 ${border}`}>
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                {/* Avatar */}

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border ${border} ${
                    isDark ? "bg-[#1A1A1D]" : "bg-[#EFEFEB]"
                  }`}
                >
                  <span className={`text-xl font-semibold ${primary}`}>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="min-w-0">
                  <h2
                    className={`truncate text-xl font-semibold tracking-tight ${primary}`}
                  >
                    {user?.name}
                  </h2>

                  <p className={`mt-1 truncate text-sm ${secondary}`}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(true);
                }}
                className={`inline-flex w-fit items-center gap-2 border px-4 py-2.5 text-xs font-medium transition-colors ${
                  isDark
                    ? "border-[#303034] text-[#A1A1AA] hover:border-[#444448] hover:text-white"
                    : "border-[#DCDCD7] bg-white text-[#555555] hover:border-[#C8C8C2] hover:text-black"
                }`}
              >
                <Pencil size={14} />
                Edit profile
              </button>
            </div>
          </section>

          {/* ==================================
              ACCOUNT
          ================================== */}

          <section className="pt-10">
            <div className="mb-5">
              <h2 className={`text-sm font-semibold ${primary}`}>
                Account details
              </h2>

              <p className={`mt-1 text-xs ${secondary}`}>
                Basic information associated with your account.
              </p>
            </div>

            <div className={`overflow-hidden border ${border} ${surface}`}>
              {/* NAME */}

              <div className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[180px_1fr] sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <User size={16} strokeWidth={1.7} className={muted} />

                  <span className={`text-xs ${secondary}`}>Full name</span>
                </div>

                <p className={`text-sm font-medium ${primary}`}>{user?.name}</p>
              </div>

              <div className={`border-t ${subtleBorder}`} />

              {/* EMAIL */}

              <div className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[180px_1fr] sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} strokeWidth={1.7} className={muted} />

                  <span className={`text-xs ${secondary}`}>Email address</span>
                </div>

                <div className="min-w-0">
                  <p className={`break-all text-sm font-medium ${primary}`}>
                    {user?.email}
                  </p>

                  <p className={`mt-1 text-[11px] ${muted}`}>
                    This can't be changed at the moment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================
              SESSION
          ================================== */}

          <section className="pt-12">
            <div className="mb-5">
              <h2 className={`text-sm font-semibold ${primary}`}>Session</h2>

              <p className={`mt-1 text-xs ${secondary}`}>
                Manage access to your Focusly account.
              </p>
            </div>

            <div
              className={`flex flex-col gap-4 border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                isDark
                  ? "border-[#302124] bg-[#171113]"
                  : "border-[#E8D8D8] bg-[#FFF9F9]"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-[#F0B5B5]" : "text-[#A83D3D]"
                  }`}
                >
                  Sign out
                </p>

                <p className={`mt-1 text-xs ${secondary}`}>
                  You'll need to sign in again to access this account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className={`inline-flex w-fit items-center gap-2 border px-4 py-2.5 text-xs font-medium transition-colors ${
                  isDark
                    ? "border-[#4A292D] text-[#D77A7A] hover:bg-[#28171A]"
                    : "border-[#E4CACA] bg-white text-[#B24B4B] hover:bg-[#FFF4F4]"
                }`}
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </section>
        </section>
      </main>

      <BottomNav />

      {/* ==================================
          EDIT MODAL
      ================================== */}

      {isEditing && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${
            isDark ? "bg-black/70" : "bg-black/25"
          }`}
        >
          <div
            className={`w-full max-w-md border ${
              isDark
                ? "border-[#29292D] bg-[#141416]"
                : "border-[#DDDDD8] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${border}`}
            >
              <div>
                <p
                  className={`text-[10px] uppercase tracking-[0.16em] ${muted}`}
                >
                  Profile
                </p>

                <h2 className={`mt-1 text-lg font-semibold ${primary}`}>
                  Edit your name
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(false);
                }}
                disabled={saving}
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  isDark
                    ? "text-zinc-600 hover:text-white"
                    : "text-zinc-400 hover:text-black"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-6">
              <label className={`mb-2 block text-xs ${secondary}`}>
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className={`w-full border px-4 py-3 text-sm outline-none transition-colors ${
                  isDark
                    ? "border-[#303034] bg-[#0D0D0F] text-white placeholder:text-[#55555B] focus:border-[#55555B]"
                    : "border-[#DCDCD7] bg-[#FAFAF8] text-[#171717] placeholder:text-[#AAAAA5] focus:border-[#999994]"
                }`}
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  className={`px-4 py-2.5 text-xs font-medium ${
                    isDark
                      ? "text-zinc-500 hover:text-white"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className={`px-5 py-2.5 text-xs font-medium disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-[#171717] text-white hover:bg-black"
                  }`}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================
          LOGOUT MODAL
      ================================== */}

      {showLogoutModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${
            isDark ? "bg-black/70" : "bg-black/25"
          }`}
        >
          <div
            className={`w-full max-w-md border ${
              isDark
                ? "border-[#29292D] bg-[#141416]"
                : "border-[#DDDDD8] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${border}`}
            >
              <div>
                <p
                  className={`text-[10px] uppercase tracking-[0.16em] ${muted}`}
                >
                  Session
                </p>

                <h2 className={`mt-1 text-lg font-semibold ${primary}`}>
                  Log out?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className={`flex h-8 w-8 items-center justify-center ${
                  isDark
                    ? "text-zinc-600 hover:text-white"
                    : "text-zinc-400 hover:text-black"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-6">
              <p className={`text-sm leading-relaxed ${secondary}`}>
                Are you sure you want to sign out of your Focusly account?
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className={`px-4 py-2.5 text-xs font-medium ${
                    isDark
                      ? "text-zinc-500 hover:text-white"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-[#B94A4A] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#A83F3F] disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

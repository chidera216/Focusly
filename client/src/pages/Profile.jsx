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

  // ============================================================
  // THEME
  // ============================================================

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

  // ============================================================
  // COLORS
  // ============================================================

  const pageClass = isDark
    ? "bg-[#121214] text-white"
    : "bg-[#F4F6F3] text-[#171918]";

  const primaryText = isDark ? "text-white" : "text-[#171918]";

  const secondaryText = isDark ? "text-zinc-400" : "text-zinc-600";

  const mutedText = isDark ? "text-zinc-500" : "text-zinc-500";

  const borderClass = isDark ? "border-white/[0.07]" : "border-black/[0.06]";

  const mainCard = isDark
    ? "border-white/[0.07] bg-[#19191C]"
    : "border-black/[0.06] bg-white";

  const softCard = isDark
    ? "border-white/[0.06] bg-[#171719]"
    : "border-black/[0.06] bg-white";

  // ============================================================
  // FETCH USER
  // ============================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

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

  // ============================================================
  // UPDATE PROFILE
  // ============================================================

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

  // ============================================================
  // LOGOUT
  // ============================================================

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

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className={`min-h-screen ${pageClass}`}>
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center md:pl-60">
          <div className="flex flex-col items-center gap-3">
            <div
              className={`h-2 w-2 animate-pulse rounded-full ${
                isDark ? "bg-orange-400" : "bg-orange-500"
              }`}
            />

            <p className={`text-sm ${secondaryText}`}>Loading profile...</p>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${pageClass}`}
    >
      <Sidebar />

      <main className="min-h-screen w-full pb-24 md:pl-60">
        {/* ======================================================
            HEADER
        ======================================================= */}

        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-xl ${borderClass} ${
            isDark ? "bg-[#121214]/90" : "bg-[#F4F6F3]/90"
          }`}
        >
          <div className="mx-auto flex h-[76px] w-full max-w-5xl items-center justify-between px-4 sm:px-7 md:px-10">
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${mutedText}`}
              >
                Account
              </p>

              <h1
                className={`mt-1 text-xl font-bold tracking-[-0.04em] ${primaryText}`}
              >
                Profile
              </h1>
            </div>

            <div
              className={`flex h-10 items-center gap-2 rounded-2xl border px-3 ${borderClass} ${
                isDark ? "bg-white/[0.035]" : "bg-white shadow-sm"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedText}`}
              >
                Account
              </span>
            </div>
          </div>
        </header>

        {/* ======================================================
            CONTENT
        ======================================================= */}

        <section className="mx-auto w-full max-w-5xl px-4 py-6 pb-28 sm:px-7 sm:py-8 md:px-10 md:pb-12">
          {/* ====================================================
              PROFILE HERO
          ===================================================== */}

          <section
            className={`relative mb-4 overflow-hidden rounded-[32px] border p-6 sm:p-8 ${mainCard}`}
          >
            <div
              className={`pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl ${
                isDark ? "bg-orange-500/[0.08]" : "bg-orange-300/[0.22]"
              }`}
            />

            <div
              className={`pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full blur-3xl ${
                isDark ? "bg-yellow-500/[0.04]" : "bg-yellow-200/[0.18]"
              }`}
            />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                {/* Avatar */}

                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] border ${
                    borderClass
                  } ${isDark ? "bg-orange-500/10" : "bg-[#FCE2D8]"}`}
                >
                  <span
                    className={`text-2xl font-bold tracking-[-0.05em] ${
                      isDark ? "text-orange-300" : "text-orange-600"
                    }`}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                  >
                    Your profile
                  </p>

                  <h2
                    className={`mt-2 truncate text-2xl font-bold tracking-[-0.05em] sm:text-3xl ${primaryText}`}
                  >
                    {user?.name}
                  </h2>

                  <p className={`mt-1.5 truncate text-sm ${secondaryText}`}>
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
                className={`inline-flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-bold transition-all active:scale-[0.98] ${borderClass} ${
                  isDark
                    ? "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                    : "bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-black"
                }`}
              >
                <Pencil size={14} strokeWidth={1.8} />
                Edit profile
              </button>
            </div>
          </section>

          {/* ====================================================
              BENTO GRID
          ===================================================== */}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* ==================================================
                ACCOUNT DETAILS
            =================================================== */}

            <section
              className={`overflow-hidden rounded-[30px] border ${softCard}`}
            >
              <div className="p-6 sm:p-7">
                <div className="mb-6">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                  >
                    Account
                  </p>

                  <h2
                    className={`mt-2 text-xl font-bold tracking-[-0.04em] ${primaryText}`}
                  >
                    Account details
                  </h2>

                  <p className={`mt-1.5 text-xs ${secondaryText}`}>
                    Basic information associated with your account.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* NAME */}

                  <div
                    className={`rounded-[22px] border p-4 ${
                      isDark
                        ? "border-white/[0.05] bg-white/[0.025]"
                        : "border-black/[0.05] bg-[#F8FAF7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          isDark
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-[#FCE2D8] text-orange-500"
                        }`}
                      >
                        <User size={16} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedText}`}
                        >
                          Full name
                        </p>

                        <p
                          className={`mt-1 truncate text-sm font-bold ${primaryText}`}
                        >
                          {user?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div
                    className={`rounded-[22px] border p-4 ${
                      isDark
                        ? "border-white/[0.05] bg-white/[0.025]"
                        : "border-black/[0.05] bg-[#F6FAFC]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          isDark
                            ? "bg-sky-500/10 text-sky-400"
                            : "bg-[#E0F1FA] text-sky-500"
                        }`}
                      >
                        <Mail size={16} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedText}`}
                        >
                          Email address
                        </p>

                        <p
                          className={`mt-1 break-all text-sm font-bold ${primaryText}`}
                        >
                          {user?.email}
                        </p>

                        <p
                          className={`mt-1.5 text-[10px] leading-4 ${mutedText}`}
                        >
                          This can't be changed at the moment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================
                PROFILE SUMMARY
            =================================================== */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <div
                className={`relative overflow-hidden rounded-[28px] border p-5 ${softCard}`}
              >
                <div
                  className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${
                    isDark ? "bg-orange-500/10" : "bg-[#F7C7B7]/50"
                  }`}
                />

                <div className="relative">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-orange-500/10 text-orange-400"
                        : "bg-[#FCE2D8] text-orange-500"
                    }`}
                  >
                    <User size={17} />
                  </div>

                  <p
                    className={`mt-6 text-[10px] font-bold uppercase tracking-[0.16em] ${mutedText}`}
                  >
                    Member
                  </p>

                  <p
                    className={`mt-2 truncate text-lg font-bold tracking-[-0.04em] ${primaryText}`}
                  >
                    {user?.name}
                  </p>

                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Personal account
                  </p>
                </div>
              </div>

              <div
                className={`relative overflow-hidden rounded-[28px] border p-5 ${softCard}`}
              >
                <div
                  className={`absolute -bottom-8 -right-8 h-28 w-28 rounded-full blur-2xl ${
                    isDark ? "bg-sky-500/10" : "bg-[#BFDFF1]/60"
                  }`}
                />

                <div className="relative">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-sky-500/10 text-sky-400"
                        : "bg-[#E0F1FA] text-sky-500"
                    }`}
                  >
                    <Mail size={17} />
                  </div>

                  <p
                    className={`mt-6 text-[10px] font-bold uppercase tracking-[0.16em] ${mutedText}`}
                  >
                    Contact
                  </p>

                  <p
                    className={`mt-2 truncate text-sm font-bold ${primaryText}`}
                  >
                    {user?.email}
                  </p>

                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Account email
                  </p>
                </div>
              </div>

              {/* SESSION */}

              <section
                className={`col-span-2 rounded-[28px] border p-5 lg:col-span-1 ${softCard}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.16em] ${mutedText}`}
                    >
                      Session
                    </p>

                    <p
                      className={`mt-2 text-lg font-bold tracking-[-0.03em] ${primaryText}`}
                    >
                      Manage access
                    </p>

                    <p className={`mt-1 text-xs leading-5 ${secondaryText}`}>
                      Sign out of your Focusly account.
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-red-500/10 text-red-400"
                        : "bg-[#FFF0EE] text-[#C45A50]"
                    }`}
                  >
                    <LogOut size={17} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border text-xs font-bold transition-all active:scale-[0.98] ${
                    isDark
                      ? "border-red-500/20 bg-red-500/[0.08] text-red-400 hover:bg-red-500/[0.13]"
                      : "border-[#EBCFCC] bg-[#FFF5F3] text-[#B24B4B] hover:bg-[#FFEDEA]"
                  }`}
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </section>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />

      {/* ========================================================
          EDIT PROFILE MODAL
      ========================================================= */}

      {isEditing && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md ${
            isDark ? "bg-black/70" : "bg-black/25"
          }`}
        >
          <div
            className={`w-full max-w-md overflow-hidden rounded-[30px] border shadow-[0_30px_100px_rgba(0,0,0,0.35)] ${
              isDark
                ? "border-white/[0.08] bg-[#171719]"
                : "border-black/[0.07] bg-white"
            }`}
          >
            {/* Header */}

            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${borderClass}`}
            >
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Profile
                </p>

                <h2
                  className={`mt-1.5 text-lg font-bold tracking-[-0.03em] ${primaryText}`}
                >
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
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isDark
                    ? "text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                    : "text-zinc-400 hover:bg-black/[0.05] hover:text-black"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}

            <div className="p-6">
              <label
                className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] ${mutedText}`}
              >
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className={`h-12 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all ${
                  isDark
                    ? "border-white/[0.08] bg-[#101012] text-white placeholder:text-zinc-700 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10"
                    : "border-black/[0.07] bg-[#F7F8F5] text-[#171717] placeholder:text-zinc-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                }`}
              />

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  className={`h-11 flex-1 rounded-2xl border text-xs font-bold transition ${
                    isDark
                      ? "border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                      : "border-black/[0.07] bg-[#F5F6F3] text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="h-11 flex-1 rounded-2xl bg-[#A8D5BA] text-xs font-bold text-[#18251D] shadow-[0_12px_30px_rgba(168,213,186,0.16)] transition hover:bg-[#9DCEB0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          LOGOUT MODAL
      ========================================================= */}

      {showLogoutModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md ${
            isDark ? "bg-black/70" : "bg-black/25"
          }`}
        >
          <div
            className={`w-full max-w-md overflow-hidden rounded-[30px] border shadow-[0_30px_100px_rgba(0,0,0,0.35)] ${
              isDark
                ? "border-white/[0.08] bg-[#171719]"
                : "border-black/[0.07] bg-white"
            }`}
          >
            {/* Header */}

            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${borderClass}`}
            >
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Session
                </p>

                <h2
                  className={`mt-1.5 text-lg font-bold tracking-[-0.03em] ${primaryText}`}
                >
                  Log out?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isDark
                    ? "text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                    : "text-zinc-400 hover:bg-black/[0.05] hover:text-black"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}

            <div className="p-6">
              <div
                className={`rounded-[22px] border p-4 ${
                  isDark
                    ? "border-red-500/10 bg-red-500/[0.05]"
                    : "border-[#F0D8D5] bg-[#FFF7F5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-red-500/10 text-red-400"
                        : "bg-[#FFE7E3] text-[#C45A50]"
                    }`}
                  >
                    <LogOut size={16} />
                  </div>

                  <p className={`text-sm leading-6 ${secondaryText}`}>
                    Are you sure you want to sign out of your Focusly account?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className={`h-11 flex-1 rounded-2xl border text-xs font-bold transition ${
                    isDark
                      ? "border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                      : "border-black/[0.07] bg-[#F5F6F3] text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="h-11 flex-1 rounded-2xl bg-[#F47B5D] text-xs font-bold text-white shadow-[0_12px_30px_rgba(244,123,93,0.18)] transition hover:bg-[#ED6D4F] disabled:cursor-not-allowed disabled:opacity-50"
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

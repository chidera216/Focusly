import { useEffect, useState } from "react";

import { User, Mail, LogOut, Pencil, X, ShieldCheck } from "lucide-react";

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

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const isDark = theme === "dark";

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
        setName(currentUser.name || "");
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
      setName(res.data.user.name || "");
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

      window.dispatchEvent(new Event("selectedTaskChanged"));

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  // ============================================================
  // COLORS
  // ============================================================

  const pageClass = isDark
    ? "bg-[#101113] text-white"
    : "bg-[#F5F6F4] text-[#161816]";

  const primaryText = isDark ? "text-[#F7F7F5]" : "text-[#171917]";

  const secondaryText = isDark ? "text-[#A1A3A1]" : "text-[#626761]";

  const mutedText = isDark ? "text-[#6F736F]" : "text-[#8A9089]";

  const surface = isDark
    ? "border-white/[0.085] bg-[#18191B]"
    : "border-black/[0.075] bg-white";

  const subtleSurface = isDark
    ? "border-white/[0.065] bg-[#151618]"
    : "border-black/[0.06] bg-[#FAFAF8]";

  const divider = isDark ? "border-white/[0.065]" : "border-black/[0.06]";

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className={`min-h-screen ${pageClass}`}>
        <Sidebar theme={theme} />

        <main className="flex min-h-screen items-center justify-center md:pl-60">
          <div className="flex flex-col items-center gap-3">
            <div
              className={`h-2 w-2 animate-pulse rounded-full ${
                isDark ? "bg-[#A8E6CF]" : "bg-[#4E9B78]"
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
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${pageClass}`}
    >
      <Sidebar theme={theme} />

      <main className="min-h-screen w-full pb-24 md:pl-60">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="px-5 pb-7 pt-7 sm:px-8 sm:pt-9 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    isDark
                      ? "border-white/[0.09] bg-white/[0.025] text-zinc-400"
                      : "border-black/[0.07] bg-white text-zinc-500"
                  }`}
                >
                  Account
                </div>

                <h1
                  className={`text-3xl font-bold tracking-[-0.045em] sm:text-4xl ${primaryText}`}
                >
                  Your profile
                </h1>

                <p
                  className={`mt-2 max-w-md text-sm leading-6 ${secondaryText}`}
                >
                  Manage your account details and session.
                </p>
              </div>

              {/* MEMBER NUMBER / STATUS */}

              <div
                className={`hidden min-w-[120px] rounded-[22px] border px-5 py-4 text-right sm:block ${subtleSurface}`}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                >
                  Status
                </p>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isDark ? "bg-[#A8E6CF]" : "bg-[#6BB88C]"
                    }`}
                  />

                  <span className={`text-sm font-bold ${primaryText}`}>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <section className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8 md:px-10">
          {/* ====================================================
              PROFILE HEADER
          ===================================================== */}

          <section
            className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-6 ${surface}`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* USER */}

              <div className="flex min-w-0 items-center gap-4">
                {/* AVATAR */}

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border ${
                    isDark
                      ? "border-[#A8E6CF]/15 bg-[#20272A] text-[#A8E6CF]"
                      : "border-[#BDE9D0] bg-[#E5F5EB] text-[#327A55]"
                  }`}
                >
                  <span className="text-xl font-bold tracking-[-0.04em]">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                {/* NAME */}

                <div className="min-w-0">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${mutedText}`}
                  >
                    Account owner
                  </p>

                  <h2
                    className={`mt-1 truncate text-xl font-bold tracking-[-0.035em] sm:text-2xl ${primaryText}`}
                  >
                    {user?.name || "Unnamed user"}
                  </h2>

                  <p className={`mt-1 truncate text-sm ${secondaryText}`}>
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* EDIT */}

              <button
                type="button"
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(true);
                }}
                className={`inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all active:scale-[0.97] ${
                  isDark
                    ? "border-white/[0.08] bg-white/[0.025] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                    : "border-black/[0.07] bg-white text-zinc-700 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                <Pencil size={14} strokeWidth={2} />
                Edit name
              </button>
            </div>

            {/* BOTTOM ACCENT */}

            <div
              className={`absolute bottom-0 left-0 h-[3px] w-full ${
                isDark ? "bg-[#A8E6CF]" : "bg-[#6BB88C]"
              }`}
            />
          </section>

          {/* ====================================================
              ACCOUNT SECTION
          ===================================================== */}

          <div className="mt-8">
            <div className="mb-4">
              <p
                className={`text-lg font-bold tracking-[-0.025em] ${primaryText}`}
              >
                Account details
              </p>

              <p className={`mt-1 text-xs ${mutedText}`}>
                Information connected to your Focusly account.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* NAME */}

              <section
                className={`rounded-[28px] border p-5 sm:p-6 ${surface}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-[#25272A] text-[#A8E6CF]"
                        : "bg-[#E5F5EB] text-[#327A55]"
                    }`}
                  >
                    <User size={18} strokeWidth={2} />
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${mutedText}`}
                  >
                    Editable
                  </span>
                </div>

                <p
                  className={`mt-7 text-[10px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
                >
                  Full name
                </p>

                <p
                  className={`mt-1 text-lg font-bold tracking-[-0.03em] ${primaryText}`}
                >
                  {user?.name || "Not set"}
                </p>

                <p className={`mt-1 text-xs ${secondaryText}`}>
                  This is the name displayed on your account.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(true);
                  }}
                  className={`mt-5 inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all active:scale-[0.97] ${
                    isDark
                      ? "bg-[#F5F5F2] text-[#111] hover:bg-white"
                      : "bg-[#171917] text-white hover:bg-black"
                  }`}
                >
                  <Pencil size={13} />
                  Change name
                </button>
              </section>

              {/* EMAIL */}

              <section
                className={`rounded-[28px] border p-5 sm:p-6 ${surface}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-[#20272A] text-[#8FD3FF]"
                        : "bg-[#EAF5FA] text-[#34799D]"
                    }`}
                  >
                    <Mail size={18} strokeWidth={2} />
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${mutedText}`}
                  >
                    Verified
                  </span>
                </div>

                <p
                  className={`mt-7 text-[10px] font-bold uppercase tracking-[0.15em] ${mutedText}`}
                >
                  Email address
                </p>

                <p
                  className={`mt-1 break-all text-lg font-bold tracking-[-0.025em] ${primaryText}`}
                >
                  {user?.email || "No email"}
                </p>

                <p className={`mt-1 text-xs ${secondaryText}`}>
                  Your account email can't be changed here.
                </p>
              </section>
            </div>
          </div>

          {/* ====================================================
              ACCOUNT ACCESS
          ===================================================== */}

          <div className="mt-8">
            <div className="mb-4">
              <p
                className={`text-lg font-bold tracking-[-0.025em] ${primaryText}`}
              >
                Account access
              </p>

              <p className={`mt-1 text-xs ${mutedText}`}>
                Control your current session.
              </p>
            </div>

            <section className={`rounded-[28px] border p-5 sm:p-6 ${surface}`}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-[#25272A] text-zinc-400"
                        : "bg-[#F1F3F0] text-[#697069]"
                    }`}
                  >
                    <ShieldCheck size={18} strokeWidth={2} />
                  </div>

                  <div>
                    <p className={`text-sm font-bold ${primaryText}`}>
                      Current session
                    </p>

                    <p
                      className={`mt-1 max-w-md text-xs leading-5 ${secondaryText}`}
                    >
                      You're currently signed in to this Focusly account on this
                      device.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all active:scale-[0.97] ${
                    isDark
                      ? "border-red-400/15 bg-red-400/[0.05] text-red-400 hover:bg-red-400/[0.09]"
                      : "border-[#EBCFCC] bg-[#FFF5F3] text-[#B24B4B] hover:bg-[#FFEDEA]"
                  }`}
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      <BottomNav />

      {/* ========================================================
          EDIT PROFILE MODAL
      ========================================================= */}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-[28px] border shadow-[0_30px_100px_rgba(0,0,0,0.25)] ${
              isDark
                ? "border-white/[0.1] bg-[#191A1C]"
                : "border-black/[0.07] bg-[#FAFAF7]"
            }`}
          >
            {/* MODAL HEADER */}

            <div
              className={`flex items-start justify-between border-b px-5 py-5 ${divider}`}
            >
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${mutedText}`}
                >
                  Account
                </p>

                <h2
                  className={`mt-1.5 text-lg font-bold tracking-[-0.03em] ${primaryText}`}
                >
                  Change your name
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
                    ? "text-zinc-600 hover:bg-white/5 hover:text-white"
                    : "text-zinc-400 hover:bg-black/5 hover:text-black"
                }`}
                aria-label="Close edit profile"
              >
                <X size={17} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-5">
              <label
                className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] ${mutedText}`}
              >
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    handleSave();
                  }

                  if (e.key === "Escape" && !saving) {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }
                }}
                placeholder="Your name"
                autoFocus
                className={`h-12 w-full rounded-2xl border px-4 text-sm font-medium outline-none transition-all ${
                  isDark
                    ? "border-white/[0.09] bg-[#111214] text-white placeholder:text-zinc-600 focus:border-white/[0.2] focus:bg-[#0F1012]"
                    : "border-black/[0.08] bg-[#F8F9F7] text-[#171717] placeholder:text-zinc-400 focus:border-black/[0.16] focus:bg-white"
                }`}
              />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  className={`rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                      : "border-black/[0.07] bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className={`rounded-2xl px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark
                      ? "bg-[#F5F5F2] text-[#111] hover:bg-white"
                      : "bg-[#171917] text-white hover:bg-black"
                  }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-[28px] border shadow-[0_30px_100px_rgba(0,0,0,0.25)] ${
              isDark
                ? "border-white/[0.1] bg-[#191A1C]"
                : "border-black/[0.07] bg-[#FAFAF7]"
            }`}
          >
            {/* MODAL HEADER */}

            <div
              className={`flex items-start justify-between border-b px-5 py-5 ${divider}`}
            >
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${mutedText}`}
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
                    ? "text-zinc-600 hover:bg-white/5 hover:text-white"
                    : "text-zinc-400 hover:bg-black/5 hover:text-black"
                }`}
                aria-label="Close logout dialog"
              >
                <X size={17} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-5">
              <div
                className={`rounded-[22px] border p-4 ${
                  isDark
                    ? "border-red-400/10 bg-red-400/[0.04]"
                    : "border-[#F0D8D5] bg-[#FFF7F5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-red-400/10 text-red-400"
                        : "bg-[#FFE7E3] text-[#C45A50]"
                    }`}
                  >
                    <LogOut size={16} />
                  </div>

                  <div>
                    <p className={`text-sm font-bold ${primaryText}`}>
                      End this session
                    </p>

                    <p className={`mt-1 text-xs leading-5 ${secondaryText}`}>
                      You'll need to sign in again the next time you use this
                      account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className={`rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                      : "border-black/[0.07] bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-2xl bg-[#E96D57] px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#DD604A] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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

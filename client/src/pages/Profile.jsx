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

  // Fetch current user
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

        // If user is not authenticated
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Update name
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);

      const res = await api.patch("/auth/me", {
        name: name.trim(),
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

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      // Clear selected task from this browser
      localStorage.removeItem("selectedTask");

      // Go to login page
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#09090B] text-white">
      <Sidebar />

      <main className="min-h-screen w-full md:pl-60">
        <header className="border-b border-white/6 px-5 py-7 sm:px-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
              Profile
            </h1>
          </div>
        </header>

        <section className="mx-auto w-full max-w-4xl px-5 py-8 pb-28 sm:px-8 md:px-10 md:pb-10">
          {/* Profile identity */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101012]">
            {/* subtle top detail */}
            <div className="h-24 border-b border-white/5 bg-linear-to-r from-white/[0.035] via-transparent to-white/2" />

            <div className="px-6 pb-7 sm:px-8">
              <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex min-w-0 items-end gap-4">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#18181B] shadow-xl">
                    <span className="text-2xl font-semibold text-zinc-300">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>

                  <div className="min-w-0 pb-1">
                    <h2 className="truncate text-xl font-semibold tracking-tight">
                      {user?.name}
                    </h2>

                    <p className="mt-1 truncate text-sm text-zinc-600">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(true);
                  }}
                  className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-white/8
                  bg-white/[0.035]
                  px-4
                  py-2.5
                  text-xs
                  font-medium
                  text-zinc-400
                  transition-all
                  hover:border-white/15
                  hover:bg-white/6
                  hover:text-white
                "
                >
                  <Pencil size={14} />
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          {/* Account information */}
          <div className="mt-8">
            <div className="mb-4">
              <p className="text-sm font-medium text-zinc-300">
                Account information
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Your personal account details.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101012]">
              {/* Name */}
              <div className="flex min-w-0 items-center gap-4 px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/6 bg-white/2.5">
                  <User size={17} className="text-zinc-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-700">
                    Full name
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-zinc-300">
                    {user?.name}
                  </p>
                </div>
              </div>

              <div className="mx-5 border-t border-white/5 sm:mx-6" />

              {/* Email */}
              <div className="flex min-w-0 items-center gap-4 px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/6 bg-white/2.5">
                  <Mail size={17} className="text-zinc-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-700">
                    Email address
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-zinc-300">
                    {user?.email}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-700">
                    Your email address is currently read-only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-10">
            <div className="mb-4">
              <p className="text-sm font-medium text-zinc-300">Session</p>

              <p className="mt-1 text-xs text-zinc-600">
                Manage your current session.
              </p>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="
              group
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              border
              border-red-500/12
              bg-red-500/2.5
              px-5
              py-5
              text-left
              transition-all
              hover:border-red-500/22
              hover:bg-red-500/5
              sm:px-6
            "
            >
              <div>
                <p className="text-sm font-medium text-red-400">Log out</p>

                <p className="mt-1 text-xs text-zinc-700">
                  Sign out of this Focusly account.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/10 text-red-500/60 transition-colors group-hover:text-red-400">
                <LogOut size={16} />
              </div>
            </button>
          </div>
        </section>
      </main>

      <BottomNav />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-[#111113] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/6 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-700">
                  Profile
                </p>

                <h2 className="mt-1 text-lg font-semibold">Edit your name</h2>
              </div>

              <button
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(false);
                }}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <label className="mb-2 block text-xs text-zinc-600">
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="
                w-full
                rounded-xl
                border
                border-white/8
                bg-[#0B0B0D]
                px-4
                py-3.5
                text-sm
                text-white
                outline-none
                transition-colors
                placeholder:text-zinc-700
                focus:border-white/18
              "
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={saving}
                  className="
                  flex-1
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/2.5
                  py-3
                  text-sm
                  text-zinc-500
                  transition-colors
                  hover:text-white
                  disabled:opacity-50
                "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="
                  flex-1
                  rounded-xl
                  bg-white
                  py-3
                  text-sm
                  font-medium
                  text-black
                  transition-colors
                  hover:bg-zinc-200
                  disabled:opacity-50
                "
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-[#111113] shadow-2xl">
            <div className="border-b border-white/6 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-700">
                    Session
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">Log out?</h2>
                </div>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-relaxed text-zinc-500">
                You'll need to sign in again to access your Focusly account.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="
                  flex-1
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/2.5
                  py-3
                  text-sm
                  text-zinc-500
                  transition-colors
                  hover:text-white
                  disabled:opacity-50
                "
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                  flex-1
                  rounded-xl
                  bg-red-500
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-red-600
                  disabled:opacity-50
                "
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

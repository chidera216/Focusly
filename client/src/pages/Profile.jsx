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
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full px-4 sm:px-8 py-10 pb-24 md:pb-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile</h1>

            <p className="text-gray-400 mt-2">
              Manage your account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-[#23242D] rounded-2xl p-6">
            {/* Name */}
            <div className="flex items-center gap-4 py-5 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <User size={20} className="text-gray-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Name</p>

                <p className="text-white font-medium break-words">
                  {user?.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 py-5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-gray-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email</p>

                <p className="text-white font-medium break-all">
                  {user?.email}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Email can't be changed right now.
                </p>
              </div>
            </div>

            {/* Edit Name */}
            <button
              onClick={() => {
                setName(user?.name || "");
                setIsEditing(true);
              }}
              className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-white text-black py-3 font-medium hover:bg-gray-200 transition"
            >
              <Pencil size={18} />
              Edit Name
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 text-red-400 py-3 font-medium hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomNav />

      {/* Edit Name Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#23242D] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Name</h2>

              <button
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(false);
                }}
                disabled={saving}
                className="text-gray-400 hover:text-white transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#18191F] rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600 focus:ring-1 focus:ring-white/20"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(false);
                }}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#18191F] py-3 text-gray-300 hover:text-white transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 rounded-xl bg-white text-black py-3 font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#23242D] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Logout?</h2>

              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="text-gray-400 hover:text-white transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Message */}
            <p className="text-gray-400 leading-relaxed">
              Are you sure you want to log out of your Focusly account?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 rounded-xl bg-[#18191F] py-3 text-gray-300 hover:text-white transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-xl bg-red-500 py-3 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

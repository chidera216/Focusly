import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Flame } from "lucide-react";
import api from "../service/api";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const verified = searchParams.get("verified") === "true";

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", form);

      console.log(response.data);

      setSuccessMessage("Login successful!");

      navigate("/dashboard");

      setForm({
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err.response);
      console.log(err.response?.data);

      const message = err.response?.data?.message;

      if (message === "Please verify your email before logging in") {
        setError("");
      } else {
        setError(message || "Something went wrong");
      }

      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const closeVerificationModal = () => {
    searchParams.delete("verified");

    navigate(
      {
        pathname: "/login",
        search: searchParams.toString(),
      },
      { replace: true },
    );
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0D0D0F] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <section className="relative hidden overflow-hidden border-r border-white/[0.055] lg:flex lg:flex-col lg:justify-between">
          {/* Background */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-500/[0.045] blur-[120px]" />

            <div className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-orange-300/[0.025] blur-[100px]" />

            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          {/* Brand */}

          <div className="relative z-10 px-10 pt-9 xl:px-14">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.025]">
                <img
                  src="/icons.svg"
                  alt="Focusly"
                  className="h-full w-full object-contain p-1.5"
                />

                <div className="absolute inset-0 bg-orange-400/[0.035]" />
              </div>

              <div>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold tracking-[-0.03em]">
                  Focusly
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-700">Stay focused</p>
              </div>
            </Link>
          </div>

          {/* Main message */}

          <div className="relative z-10 max-w-xl px-10 pb-20 xl:px-14">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Your focus space
              </span>
            </div>

            <h1 className="text-[54px] font-bold leading-[0.98] tracking-[-0.065em] xl:text-[64px]">
              Make time
              <br />
              work for you.
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-zinc-500">
              Focusly gives you a quiet place to focus, manage your tasks, and
              build better working sessions without the usual clutter.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <span className="h-px w-8 bg-orange-400/40" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-700">
                One session at a time
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          {/* Mobile glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-orange-500/[0.035] blur-[100px] lg:hidden" />

          <div className="relative w-full max-w-[390px]">
            {/* Mobile brand */}

            <div className="mb-14 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[13px] border border-white/[0.07] bg-white/[0.025]">
                <img
                  src="/icons.svg"
                  alt="Focusly"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold">
                  Focusly
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-700">Stay focused</p>
              </div>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Welcome back
                </span>
              </div>

              <h2 className="text-[32px] font-bold tracking-[-0.05em]">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Pick up where you left off.
              </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}

              <div>
                <label className="mb-2.5 block text-[11px] font-medium text-zinc-500">
                  Email address
                </label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-white/[0.075]
                    bg-[#141416]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    hover:border-white/[0.11]
                    focus:border-orange-400/40
                    focus:bg-[#161618]
                    focus:ring-4
                    focus:ring-orange-400/[0.045]
                  "
                />
              </div>

              {/* Password */}

              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label className="text-[11px] font-medium text-zinc-500">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-zinc-700 transition hover:text-zinc-400"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="
                      h-12
                      w-full
                      rounded-[14px]
                      border
                      border-white/[0.075]
                      bg-[#141416]
                      px-4
                      pr-12
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      placeholder:text-zinc-700
                      hover:border-white/[0.11]
                      focus:border-orange-400/40
                      focus:bg-[#161618]
                      focus:ring-4
                      focus:ring-orange-400/[0.045]
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-[10px]
                      text-zinc-700
                      transition
                      hover:bg-white/[0.04]
                      hover:text-zinc-300
                    "
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-[14px] border border-red-500/[0.12] bg-red-500/[0.035] px-4 py-3">
                  <p className="text-xs leading-5 text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-2
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  bg-white
                  text-sm
                  font-bold
                  text-[#111113]
                  shadow-[0_10px_30px_rgba(255,255,255,0.04)]
                  transition-all
                  hover:bg-zinc-200
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Signup */}

            <div className="mt-8 border-t border-white/[0.05] pt-7 text-center">
              <p className="text-xs text-zinc-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-zinc-300 transition hover:text-white"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Small footer */}

            <p className="mt-10 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-800">
              Focusly workspace
            </p>
          </div>
        </section>
      </div>

      {/* =====================================================
          VERIFICATION / SUCCESS MODAL
      ====================================================== */}

      {(successMessage || verified) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#141416] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="border-b border-white/[0.055] px-6 py-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400">
                <Flame size={16} />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                Focusly
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em]">
                Email verified
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-zinc-500">
                {verified
                  ? "Your email has been verified successfully. You can now sign in."
                  : successMessage}
              </p>

              <button
                type="button"
                onClick={closeVerificationModal}
                className="
                  mt-7
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  bg-white
                  text-sm
                  font-bold
                  text-black
                  transition
                  hover:bg-zinc-200
                "
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

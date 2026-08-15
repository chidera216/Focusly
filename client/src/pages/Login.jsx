import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../service/api";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", form);
      console.log(response.data);

      setSuccessMessage("Login successful!");
      navigate("/dashboard");
      setError("");

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

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#09090B] text-white">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left side */}
        <section className="relative hidden overflow-hidden border-r border-white/6 lg:flex lg:flex-col lg:justify-between">
          {/* subtle background detail */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-45 -top-45 h-125 w-125 rounded-full bg-white/2.5 blur-3xl" />

            <div className="absolute -bottom-55 -right-30 h-112.5 w-112.5 rounded-full bg-zinc-500/2.5 blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
          </div>

          {/* Brand */}
          <div className="relative z-10 px-10 pt-10 xl:px-16">
            <div className="flex items-center gap-3">
              {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <span className="text-sm font-bold">F</span>
              </div> */}

              <span className="font-['Plus_Jakarta_Sans'] text-lg font-semibold tracking-tight">
                Focusly
              </span>
            </div>
          </div>

          {/* Main copy */}
          <div className="relative z-10 max-w-xl px-10 pb-20 xl:px-16">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              Focus better
            </p>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.055em] xl:text-6xl">
              Make time
              <br />
              work for you.
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-zinc-500">
              A simple workspace for focused sessions, meaningful tasks, and
              better control over your time.
            </p>

            <div className="mt-10 flex items-center gap-3 text-xs text-zinc-700">
              <span className="h-px w-10 bg-zinc-800" />
              <span>Focusly workspace</span>
            </div>
          </div>
        </section>

        {/* Right side */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <span className="text-sm font-bold">F</span>
              </div>

              <span className="font-['Plus_Jakarta_Sans'] text-lg font-semibold">
                Focusly
              </span>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
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
                <label className="mb-2 block text-xs text-zinc-500">
                  Email
                </label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-white/8
                  bg-[#111113]
                  px-4
                  py-3.5
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-zinc-700
                  focus:border-white/18
                  focus:bg-[#121214]
                "
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Password</label>

                  <button
                    type="button"
                    className="text-xs text-zinc-700 transition-colors hover:text-zinc-400"
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
                    w-full
                    rounded-xl
                    border
                    border-white/8
                    bg-[#111113]
                    px-4
                    py-3.5
                    pr-12
                    text-sm
                    text-white
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-white/18
                    focus:bg-[#121214]
                  "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-zinc-600
                    transition-colors
                    hover:bg-white/5
                    hover:text-zinc-300
                  "
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/12 bg-red-500/[0.035] px-4 py-3">
                  <p className="text-xs leading-5 text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                mt-3
                w-full
                rounded-xl
                bg-white
                py-3.5
                text-sm
                font-medium
                text-black
                transition-all
                hover:bg-zinc-200
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Signup */}
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Verification / Success Modal */}
      {(successMessage || verified) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-[#111113] shadow-2xl">
            <div className="border-b border-white/6 px-6 py-5">
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-700">
                Focusly
              </p>

              <h2 className="mt-1 text-lg font-semibold">Email verified</h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-zinc-500">
                {verified
                  ? "Your email has been verified successfully. You can now sign in."
                  : successMessage}
              </p>

              <button
                onClick={() => {
                  searchParams.delete("verified");

                  navigate(
                    {
                      pathname: "/login",
                      search: searchParams.toString(),
                    },
                    { replace: true },
                  );
                }}
                className="
                mt-7
                w-full
                rounded-xl
                bg-white
                py-3
                text-sm
                font-medium
                text-black
                transition-colors
                hover:bg-zinc-200
              "
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

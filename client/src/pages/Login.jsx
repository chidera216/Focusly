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
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-24 px-3 md:px-15">
      <div className="hidden lg:block">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl mb-3.5 font-bold tracking-tight">
          Focusly
        </h1>
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">
          Stay focused,
          <br /> Get more done.
        </h1>
        <p className="text-lg text-gray-500">
          Boost your productivity with simple, timed focus sessions.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full md:bg-[#16161c] max-w-125 p-7 rounded-3xl shadow-md">
        <h1 className="text-white font-primary font-bold text-[22px]">
          Signin
        </h1>
        <p className="text-[16px] mb-9">Focus mode</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full mt-4">
          <div className="w-full">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="bg-[#16161C] w-full py-2 px-5 mb-6 text-white border border-[#8A52FF]/25 placeholder-[#7D7D8A] rounded-full outline-none"
              placeholder="Email"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="bg-[#16161C] w-full py-2 px-5 mb-6 text-white border border-[#8A52FF]/25 placeholder-[#7D7D8A] rounded-full outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/3 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <p className="text-[14px]">Forgot Password?</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ffffff] text-[14px] md:text-[16px] font-medium text-black w-full py-2 mt-12 mb-3 border border-[#8A52FF]/25 rounded-full outline-none"
          >
            {loading ? "Signing in..." : "Signin"}
          </button>
        </form>

        <p className="text-[14px] text-center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        {error && (
          <p style={{ color: "red" }} className="text-[12px]">
            {error}
          </p>
        )}
        {(successMessage || verified) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-3xl bg-[#16161c] p-8 text-center shadow-2xl">
              <h2 className="mb-3 text-xl font-bold text-white">
                Email Verified
              </h2>

              <p className="mb-6 text-sm text-[#a0a0aa]">
                {verified
                  ? "Email verified successfully. You can now log in."
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
                className="w-full rounded-full bg-white py-2 font-medium text-black"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

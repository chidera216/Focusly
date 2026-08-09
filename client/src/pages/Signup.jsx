import { useState } from "react";
import api from "../service/api";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setShowPasswordError(true);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", form);

      console.log(response.data);

      // JWT cookie is created by the backend,
      // so take the user straight to the dashboard.
      navigate("/dashboard");

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err.response);
      console.log(err.response?.data);

      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row h-screen w-full items-center justify-center gap-24 px-3">
      <div className="hidden lg:block">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl mb-3.5 font-bold tracking-tight">
          Focusly
        </h1>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Stay focused,
          <br /> Get more done.
        </h1>
        <p className="text-lg text-gray-500">
          Boost your productivity with simple, timed focus sessions.
        </p>
      </div>

      {/* SIGNUP CARD SECTION */}
      <div className="md:bg-[#16161c] max-w-125 p-7 rounded-3xl shadow-md">
        <h1 className="text-white font-primary font-bold text-[22px]">
          Signup
        </h1>
        <p className="text-[16px] mb-9">Focus mode</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full mt-4">
          <div className="w-full">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="bg-[#16161C] w-full py-2 px-5 mb-6 text-white border border-[#8A52FF]/25 placeholder-[#7D7D8A] rounded-full outline-none"
              placeholder="Full Name"
            />
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
            <p className="text-[14px]">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ffffff] text-[14px] md:text-[16px] font-medium text-black w-full py-2 mt-12 mb-3 border border-[#8A52FF]/25 rounded-full outline-none"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        {error && (
          <p style={{ color: "red" }} className="text-[12px]">
            {error}
          </p>
        )}
        {showPasswordError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-3xl bg-[#16161c] p-8 text-center shadow-2xl">
              <h2 className="mb-3 text-xl font-bold text-white">
                Invalid Password
              </h2>

              <p className="mb-6 text-sm text-[#a0a0aa]">
                Password must be at least 8 characters and contain an uppercase
                letter, lowercase letter, number, and special character.
              </p>

              <button
                type="button"
                onClick={() => setShowPasswordError(false)}
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

export default SignupPage;

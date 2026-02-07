import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GetStartedImage from '../assets/stock1.png';
import { authAPI, setAuthToken } from '../utils/api';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.token) {
        setAuthToken(response.token);
        navigate("/dashboard");
      } else {
        navigate("/signin");
      }
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black ">
      
      {/* LEFT – FORM */}
      <div className="flex flex-col justify-center items-center px-4 py-8 md:px-16 lg:px-24">
        <div className="w-full max-w-md shadow-lg rounded-2xl px-5 py-10">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sign Up</h1>
            <p className="text-gray-500 mt-2 text-lg">
              First create your account
            </p>
          </header>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-full font-bold shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating account..." : "SIGN UP"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600 font-bold hover:opacity-80">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT – IMAGE */} 
      <div className="hidden md:flex items-center justify-center p-12 ">
        <img
          src={GetStartedImage}
          alt="Sign Up illustration"
          className="max-w-full h-auto max-h-[80vh] object-contain "
        />
      </div>

    </div>
  );
};
export default SignUp;
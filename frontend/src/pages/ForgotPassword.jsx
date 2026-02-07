import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import GetStartedImage from '../assets/stock1.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setError('');
    try {
      await authAPI.requestPasswordReset(email);
      setStatus('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black">
      <div className="flex items-center justify-center px-4 py-8 md:px-16 lg:px-24">
        <div className="w-full max-w-md shadow-lg rounded-2xl px-5 py-10">
          <header>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Reset Password</h1>
            <p className="text-gray-500 mb-6 text-lg">Enter your email to receive a reset link</p>
          </header>

          {status && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {status}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Remembered your password?{' '}
            <Link to="/signin" className="text-indigo-600 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center p-12">
        <img src={GetStartedImage} alt="Reset illustration" className="max-w-full h-auto max-h-[80vh] object-contain" />
      </div>
    </div>
  );
}

export default ForgotPassword;

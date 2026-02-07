import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/api';
import GetStartedImage from '../assets/stock1.png';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ResetPassword() {
  const query = useQuery();
  const email = query.get('email') || '';
  const token = query.get('token') || '';

  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    if (!email || !token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.setNewPassword(email, token, formData.password);
      setStatus('Password reset successful. You can now sign in.');
      setFormData({ password: '', confirm: '' });
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black">
      <div className="flex items-center justify-center px-4 py-8 md:px-16 lg:px-24">
        <div className="w-full max-w-md shadow-lg rounded-2xl px-5 py-10">
          <header>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Set New Password</h1>
            <p className="text-gray-500 mb-6 text-lg">Choose a new password for {email || 'your account'}</p>
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
              type="password"
              placeholder="New password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={formData.confirm}
              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Back to{' '}
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

export default ResetPassword;

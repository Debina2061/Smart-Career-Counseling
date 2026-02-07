import { useEffect, useState } from 'react';
import { FaUsers, FaCheckCircle, FaBriefcase, FaLightbulb, FaFileAlt, FaStar } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../utils/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        const payload = response?.data || response;
        setStats(payload?.stats || null);
        setRecentUsers(payload?.recent?.users || []);
        setRecentJobs(payload?.recent?.jobs || []);
      } catch (err) {
        setError(err.message || 'Failed to load admin dashboard');
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: stats?.users?.total ?? '--',
      icon: FaUsers,
      accent: 'bg-teal-100 text-teal-700',
    },
    {
      label: 'Verified Users',
      value: stats?.users?.verified ?? '--',
      icon: FaCheckCircle,
      accent: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Active Jobs',
      value: stats?.jobs?.active ?? '--',
      icon: FaBriefcase,
      accent: 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Career Profiles',
      value: stats?.careers ?? '--',
      icon: FaLightbulb,
      accent: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Resumes',
      value: stats?.resumes ?? '--',
      icon: FaFileAlt,
      accent: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Recommendations',
      value: stats?.recommendations ?? '--',
      icon: FaStar,
      accent: 'bg-indigo-100 text-indigo-700',
    },
  ];

  return (
    <AdminLayout title="Admin Dashboard" eyebrow="Overview">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${card.accent} flex items-center justify-center`}>
                  <Icon className="text-xl" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <p className="text-sm text-slate-500 mt-4">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Users</h3>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No recent users found.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Jobs</h3>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-slate-500">No recent jobs found.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{job.jobTitle}</p>
                    <p className="text-xs text-slate-500">{job.company?.name || 'Company'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {job.status || 'unknown'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

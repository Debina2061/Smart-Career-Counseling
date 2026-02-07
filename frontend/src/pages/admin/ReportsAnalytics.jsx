import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../utils/api';

function ReportsAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminAPI.getAnalytics();
        const payload = response?.data || response;
        setAnalytics(payload?.data || payload);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      }
    };
    load();
  }, []);

  const userGrowth = analytics?.userGrowth || [];
  const topCareers = analytics?.topCareers || [];
  const lowAtsUsers = analytics?.lowAtsUsers || [];
  const popularSkills = analytics?.popularSkills || [];
  const jobsByCategory = analytics?.jobsByCategory || [];

  return (
    <AdminLayout title="Reports & Analytics" eyebrow="Performance Insights">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Career Matching Report</h3>
          {topCareers.length === 0 ? (
            <p className="text-sm text-slate-500">No matching data available.</p>
          ) : (
            <div className="space-y-3">
              {topCareers.map((career) => (
                <div key={career._id} className="border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{career._id}</p>
                    <p className="text-xs text-slate-500">Avg score {Math.round(career.avgScore || 0)}%</p>
                  </div>
                  <span className="text-sm text-slate-600">{career.count} matches</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Students With Low ATS Score</h3>
          {lowAtsUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No low ATS scores found.</p>
          ) : (
            <div className="space-y-3">
              {lowAtsUsers.map((student) => (
                <div key={student.userId} className="border border-slate-200 rounded-xl px-4 py-3">
                  <p className="font-semibold text-slate-900">{student.name || 'Student'}</p>
                  <p className="text-xs text-slate-500">{student.email}</p>
                  <p className="text-sm text-rose-600 mt-2">ATS Score: {student.atsScore}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Popular Skills</h3>
          {popularSkills.length === 0 ? (
            <p className="text-sm text-slate-500">No skills data available.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <span key={skill.skill} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                  {skill.skill} ({skill.count})
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">User Growth (Last 30 Days)</h3>
          {userGrowth.length === 0 ? (
            <p className="text-sm text-slate-500">No user growth data yet.</p>
          ) : (
            <div className="space-y-2">
              {userGrowth.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm text-slate-600">
                  <span>{item._id}</span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Jobs By Category</h3>
          {jobsByCategory.length === 0 ? (
            <p className="text-sm text-slate-500">No job category data.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jobsByCategory.map((job) => (
                <div key={job._id} className="border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{job._id || 'Unknown'}</span>
                  <span className="text-sm text-slate-600">{job.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ReportsAnalytics;

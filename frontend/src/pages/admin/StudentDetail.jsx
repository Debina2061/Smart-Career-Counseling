import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../utils/api';

function StudentDetail() {
  const { userId } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDetail = async () => {
    setError('');
    try {
      const response = await adminAPI.getUserDetails(userId);
      const payload = response?.data || response;
      setDetail(payload?.data || payload);
    } catch (err) {
      setError(err.message || 'Failed to load user details');
    }
  };

  useEffect(() => {
    loadDetail();
  }, [userId]);

  const toggleVerification = async () => {
    if (!detail?.user?._id) return;
    setMessage('');
    try {
      const updated = await adminAPI.updateUser(detail.user._id, {
        isVerified: !detail.user.isVerified,
      });
      setDetail((prev) => ({ ...prev, user: updated?.data || updated }));
      setMessage('Verification status updated.');
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <AdminLayout title="Student Details" eyebrow="Student Management">
      <div className="mb-6">
        <Link to="/admin/students" className="text-sm text-teal-600 font-semibold">
          ← Back to students
        </Link>
      </div>

      {(error || message) && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${error ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {error || message}
        </div>
      )}

      {!detail ? (
        <div className="text-sm text-slate-500">Loading student...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Student Profile</h3>
            <p className="text-sm text-slate-500">Name</p>
            <p className="text-lg font-semibold text-slate-900">{detail.user?.name}</p>
            <p className="text-sm text-slate-500 mt-3">Email</p>
            <p className="text-sm text-slate-700">{detail.user?.email}</p>
            <p className="text-sm text-slate-500 mt-3">Role</p>
            <p className="text-sm text-slate-700 capitalize">{detail.user?.Role}</p>
            <div className="mt-4">
              <span className={`text-xs px-2 py-1 rounded-full ${detail.user?.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {detail.user?.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <button
              onClick={toggleVerification}
              className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold"
            >
              Toggle Verification
            </button>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Resume Status</h3>
            {detail.resume ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>ATS Score</span>
                  <span className="font-semibold text-slate-900">{detail.resume.atsScore ?? '--'}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Analysis Status</span>
                  <span className="font-semibold text-slate-900 capitalize">{detail.resume.analysisStatus}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Last Updated</span>
                  <span className="font-semibold text-slate-900">
                    {detail.resume.updatedAt ? new Date(detail.resume.updatedAt).toLocaleDateString() : '--'}
                  </span>
                </div>
                {detail.resume.resumeUrl && (
                  <a
                    href={detail.resume.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600"
                  >
                    View Resume
                  </a>
                )}
                {(detail.resume.suggestions || []).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Suggestions</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {detail.resume.suggestions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No resume uploaded.</p>
            )}
          </div>

          <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Career Recommendations</h3>
            {(detail.topRecommendations || []).length === 0 ? (
              <p className="text-sm text-slate-500">No recommendations found.</p>
            ) : (
              <div className="space-y-3">
                {detail.topRecommendations.map((rec, index) => (
                  <div key={`${rec.careerName}-${index}`} className="border border-slate-200 rounded-xl px-4 py-3">
                    <p className="font-semibold text-slate-900">{rec.careerName}</p>
                    <p className="text-xs text-slate-500">Match {rec.matchScore || 0}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default StudentDetail;

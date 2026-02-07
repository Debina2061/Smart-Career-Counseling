import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../utils/api';

function StudentManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: 'student', verified: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search: filters.search || undefined,
        role: filters.role || undefined,
        verified: filters.verified || undefined,
      };
      const response = await adminAPI.getAllUsers(params);
      const payload = response?.data || response;
      setUsers(payload?.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totalUsers = users.length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const adminCount = users.filter((u) => u.Role === 'admin').length;
  const unverifiedCount = totalUsers - verifiedCount;

  return (
    <AdminLayout title="Student Management" eyebrow="Student Directory">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: totalUsers, accent: 'bg-slate-900 text-white' },
          { label: 'Verified', value: verifiedCount, accent: 'bg-emerald-100 text-emerald-700' },
          { label: 'Unverified', value: unverifiedCount, accent: 'bg-rose-100 text-rose-700' },
          { label: 'Admins', value: adminCount, accent: 'bg-amber-100 text-amber-700' },
        ].map((card) => (
          <div key={card.label} className="bg-white/90 rounded-2xl shadow-lg border border-slate-200 p-5">
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${card.accent}`}>
              {card.label}
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-4">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or email"
            className="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>
          <select
            name="verified"
            value={filters.verified}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button
            onClick={loadUsers}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Registered Students</h3>
          {loading && <span className="text-sm text-slate-500">Loading...</span>}
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-slate-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-500 border-b border-slate-200 uppercase text-xs tracking-wider bg-slate-50">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Verified</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">{user.name}</td>
                    <td className="py-3 px-3 text-slate-600">{user.email}</td>
                    <td className="py-3 px-3 text-slate-600 capitalize">{user.Role}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/students/${user._id}`}
                        className="text-teal-700 font-semibold hover:text-teal-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default StudentManagement;

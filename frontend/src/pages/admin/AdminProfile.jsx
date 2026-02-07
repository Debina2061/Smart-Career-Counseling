import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI, authAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [adminInfo, setAdminInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const response = await adminAPI.getAdminMe();
        const payload = response?.data || response;
        setAdminInfo(payload?.data || payload);
      } catch (err) {
        setError(err.message || 'Failed to load admin info');
      }
    };
    loadAdmin();
  }, []);

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
    setMessage('');
  };

  const handleSave = async () => {
    setError('');
    setMessage('');
    try {
      const payload = {
        name: formData.name,
        imgName: avatarFile || undefined,
      };
      const response = await authAPI.updateProfile(payload);
      if (response?.avatarUrl) {
        updateUser({ avatarUrl: response.avatarUrl, name: formData.name });
      } else {
        updateUser({ name: formData.name });
      }
      setMessage('Profile updated successfully.');
      setAvatarFile(null);
      setAvatarPreview('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const avatarUrl =
    avatarPreview ||
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Admin'}`;

  return (
    <AdminLayout title="Profile & Settings" eyebrow="Admin Account">
      {(error || message) && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${error ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Admin Identity</h3>
          <div className="flex items-center gap-4 mb-4">
            <img src={avatarUrl} alt="Admin avatar" className="w-20 h-20 rounded-full object-cover" />
            <div>
              <p className="text-sm text-slate-500">Upload avatar</p>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Display Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold"
          >
            Save Changes
          </button>
        </div>

        <div className="lg:col-span-2 bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Admin Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-semibold text-slate-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-slate-500">Role</p>
              <p className="font-semibold text-slate-900 capitalize">{user?.Role || 'admin'}</p>
            </div>
            <div>
              <p className="text-slate-500">Admin Level</p>
              <p className="font-semibold text-slate-900 capitalize">{adminInfo?.admin?.adminLevel || 'admin'}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-semibold text-emerald-600">Active</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(adminInfo?.admin?.permissions || {}).map(([key, value]) => (
                <span
                  key={key}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaChevronDown, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';

function AdminLayout({ title, eyebrow, children, actions }) {
  const { user } = useAuth();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';
  const avatarUrl =
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Admin'}`;

  const notifications = [
    'Review new student registrations',
    'Check low ATS score report',
    'Update skill keywords for new careers',
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#0b1220]">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">{eyebrow || 'Admin'}</p>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {actions}
            <div className="relative" ref={notificationRef}>
              <button
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                aria-label="Notifications"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <FaBell className="text-xl" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                  <div className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-900">
                    Notifications
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((item, index) => (
                      <div key={index} className="px-4 py-3 text-sm text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile((prev) => !prev)}
                className="flex items-center gap-3 border-l border-slate-200 pl-4"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                <FaChevronDown className="text-slate-400 text-sm" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FaUserCog />
                    Profile & Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-scope flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;

import { Link, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaGraduationCap,
  FaKey,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
  { path: '/admin/careers', label: 'Career Profiles', icon: FaGraduationCap },
  { path: '/admin/skills', label: 'Skills & Keywords', icon: FaKey },
  { path: '/admin/students', label: 'Students', icon: FaUsers },
  { path: '/admin/reports', label: 'Reports & Analytics', icon: FaChartBar },
];

function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col fixed h-screen text-slate-100">
      <div className="px-6 py-6 border-b border-slate-900">
        <Link to="/admin/dashboard">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.2em] uppercase text-slate-300">
            Admin
          </div>
          <h1 className="text-2xl font-bold text-white mt-3">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Smart Career</p>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                  isActive(item.path)
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'bg-white/5 text-slate-400 group-hover:text-emerald-200'
                }`}
              >
                <Icon className="text-lg" />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-900 space-y-2">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-300 hover:bg-rose-500/10 transition font-medium"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;

import { Link, useLocation } from 'react-router-dom';
import { FaFileAlt, FaMapPin, FaBrain, FaRobot, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { path: '/ats-scanner', label: 'ATS Resume Scanner', icon: FaFileAlt },
  { path: '/career-recommendation', label: 'Career Recommendation', icon: FaMapPin },
  { path: '/skill-analysis', label: 'Skill Analysis', icon: FaBrain },
  { path: '/ai-chatbot', label: 'AI Chatbot', icon: FaRobot },
  { path: '/profile', label: 'Profile', icon: FaUser },
];

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-52 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold text-gray-900">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Career</span>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="text-lg" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

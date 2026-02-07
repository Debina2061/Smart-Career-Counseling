import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaArrowRight,
  FaBell,
  FaBriefcase,
  FaChartLine,
  FaChevronDown,
  FaClipboardList,
  FaComments,
  FaFileAlt,
  FaMapPin,
  FaRobot,
  FaStar,
  FaUserCheck,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../utils/api'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '--')

const statusTone = (status) => {
  const value = (status || '').toLowerCase()
  if (value.includes('interview')) return 'bg-emerald-50 text-emerald-700'
  if (value.includes('shortlist') || value.includes('review')) return 'bg-blue-50 text-blue-700'
  if (value.includes('reject')) return 'bg-rose-50 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (user) {
      loadDashboard()
    }
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getDashboard()
      setDashboard(response?.data || null)
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const profile = dashboard?.profile
  const resume = dashboard?.resume
  const recommendations = dashboard?.recommendations
  const applications = dashboard?.applications
  const chat = dashboard?.chat

  const displayName = profile?.name || user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'
  const avatarUrl =
    profile?.avatarUrl ||
    user?.avatarUrl ||
    user?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`

  const completionPercent = profile?.completionPercent ?? 0
  const atsScore = resume?.atsScore ?? null
  const isResumeProcessing = resume?.analysisStatus === 'processing'

  const actionItems = useMemo(() => {
    const items = []
    if (!resume?.hasResume) {
      items.push({
        id: 'resume',
        title: 'Upload your resume',
        description: 'Scan it to unlock ATS insights and skill extraction.',
        cta: 'Upload Resume',
        link: '/profile',
        icon: FaFileAlt,
      })
    }
    if ((completionPercent || 0) < 80) {
      items.push({
        id: 'profile',
        title: 'Complete your profile',
        description: 'Add missing details to improve your recommendations.',
        cta: 'Update Profile',
        link: '/profile',
        icon: FaUserCheck,
      })
    }
    if ((recommendations?.count || 0) === 0) {
      items.push({
        id: 'recommendations',
        title: 'Generate recommendations',
        description: 'Get the top career paths matched to your skills.',
        cta: 'Generate Now',
        link: '/career-recommendation',
        icon: FaMapPin,
      })
    }
    return items
  }, [completionPercent, recommendations?.count, resume?.hasResume])

  const notifications = actionItems.map((item) => item.title)

  const stats = [
    {
      label: 'Profile Completion',
      value: `${completionPercent}%`,
      icon: FaUserCheck,
      accent: 'bg-teal-100 text-teal-700',
    },
    {
      label: 'ATS Resume Score',
      value: atsScore !== null ? `${atsScore}%` : '--',
      icon: FaFileAlt,
      accent: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Applications',
      value: `${applications?.count ?? 0}`,
      icon: FaBriefcase,
      accent: 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Recommendations',
      value: `${recommendations?.count ?? 0}`,
      icon: FaStar,
      accent: 'bg-indigo-100 text-indigo-700',
    },
  ]

  const quickActions = [
    {
      title: 'Scan Resume',
      description: 'Instant ATS feedback and format checks.',
      cta: 'Start Scan',
      link: '/ats-scanner',
      icon: FaFileAlt,
      gradient: 'from-teal-600 via-emerald-500 to-lime-400',
    },
    {
      title: 'Career Matches',
      description: 'See top roles matched to your skills.',
      cta: 'View Matches',
      link: '/career-recommendation',
      icon: FaMapPin,
      gradient: 'from-slate-900 via-slate-800 to-slate-700',
    },
    {
      title: 'AI Coach',
      description: 'Get guidance tailored to your goals.',
      cta: 'Ask Now',
      link: '/ai-chatbot',
      icon: FaRobot,
      gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    },
  ]

  const topCareers = recommendations?.topCareers || []
  const recentApplications = applications?.recent || []
  const recentChats = chat?.sessions || []

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50">
      <Sidebar />

      <div className="flex-1 ml-52 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
              <FaChartLine className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Overview</p>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                aria-label="Notifications"
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  <div className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-900">
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-500">You are all caught up.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((item, index) => (
                        <div key={index} className="px-4 py-3 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/profile" className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">Career Builder</p>
              </div>
              <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
              <FaChevronDown className="text-slate-400 text-sm" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-8 space-y-6">
              <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Career snapshot</p>
                    <h1 className="text-3xl font-bold text-slate-900 mt-2">Welcome back, {displayName}.</h1>
                    <p className="text-slate-600 mt-2">
                      Stay focused on the essentials. Your progress, resume strength, and next steps are all in one place.
                    </p>
                  </div>
                  <div className="w-full md:w-64 bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Profile completion</p>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400"
                        style={{ width: `${Math.min(100, completionPercent)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mt-3">
                      {completionPercent}% complete
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-lg ${stat.accent} flex items-center justify-center`}>
                            <Icon className="text-lg" />
                          </div>
                          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                        <p className="text-sm text-slate-500 mt-3">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Icon className="text-xl" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mt-6">{action.title}</h3>
                      <p className="text-sm opacity-90 mt-2">{action.description}</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full">
                        {action.cta}
                        <FaArrowRight />
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">Career matches</p>
                      <h3 className="text-xl font-bold text-slate-900">Top Recommendations</h3>
                    </div>
                    <Link to="/career-recommendation" className="text-sm font-semibold text-teal-600">
                      View all
                    </Link>
                  </div>
                  {topCareers.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 text-sm text-slate-500">
                      No recommendations yet. Generate your first career matches.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topCareers.map((career, index) => (
                        <div
                          key={`${career.careerName}-${index}`}
                          className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{career.careerName}</p>
                            <p className="text-xs text-slate-500">
                              Growth: {career.growthPotential || 'Stable'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">{career.matchScore || 0}%</p>
                            <p className="text-xs text-slate-500">Match score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">Applications</p>
                      <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                    </div>
                    <Link to="/career-recommendation" className="text-sm font-semibold text-teal-600">
                      Explore careers
                    </Link>
                  </div>
                  {recentApplications.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 text-sm text-slate-500">
                      No applications yet. Apply to jobs and track them here.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentApplications.map((app, index) => (
                        <div key={`${app.jobTitle}-${index}`} className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{app.jobTitle}</p>
                              <p className="text-sm text-slate-500">{app.company}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusTone(app.status)}`}>
                              {app.status || 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                            <span>Applied {formatDate(app.appliedAt)}</span>
                            <span>Match {app.matchScore || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="xl:col-span-4 space-y-6">
              <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Focus</p>
                    <h3 className="text-xl font-bold text-slate-900">Next Steps</h3>
                  </div>
                  <FaClipboardList className="text-slate-400" />
                </div>

                {actionItems.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-sm text-slate-500">
                    You are all set. Keep applying and refining your resume.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {actionItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                              <Icon />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{item.title}</p>
                              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                              <Link to={item.link} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 mt-3">
                                {item.cta}
                                <FaArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Resume</p>
                    <h3 className="text-xl font-bold text-slate-900">Latest Snapshot</h3>
                  </div>
                  <FaFileAlt className="text-slate-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>ATS Score</span>
                    <span className="font-semibold text-slate-900">
                      {isResumeProcessing ? 'Processing' : atsScore !== null ? `${atsScore}%` : 'Not scanned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Last updated</span>
                    <span className="font-semibold text-slate-900">
                      {resume?.updatedAt ? formatDate(resume.updatedAt) : '--'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300"
                      style={{ width: `${Math.min(100, atsScore || 0)}%` }}
                    ></div>
                  </div>
                  <Link
                    to="/ats-scanner"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600"
                  >
                    Run a fresh scan
                    <FaArrowRight />
                  </Link>
                </div>
              </div>

              <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">AI Coach</p>
                    <h3 className="text-xl font-bold text-slate-900">Recent Chats</h3>
                  </div>
                  <FaComments className="text-slate-400" />
                </div>
                {recentChats.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-sm text-slate-500">
                    No chats yet. Start a conversation to keep track of your guidance.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentChats.map((chatItem) => (
                      <div key={chatItem.id} className="border border-slate-200 rounded-xl p-4">
                        <p className="font-semibold text-slate-900">{chatItem.title || 'Career Session'}</p>
                        <p className="text-sm text-slate-500 mt-1">{chatItem.lastMessage || 'New chat started.'}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                          <span>{chatItem.messageCount} messages</span>
                          <span>{formatDate(chatItem.updatedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/ai-chatbot" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 mt-4">
                  Open AI Coach
                  <FaArrowRight />
                </Link>
              </div>
            </aside>
          </div>

          {loading && (
            <div className="mt-6 text-sm text-slate-500">Loading dashboard data...</div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard

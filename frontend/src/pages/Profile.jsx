import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaFileAlt, FaBrain, FaUser, FaBell, FaCloudUploadAlt, FaPlusCircle, FaCode, FaGraduationCap, FaBriefcase, FaProjectDiagram, FaTools, FaChartBar, FaFilePdf, FaExpand, FaCompress, FaExternalLinkAlt, FaCheckCircle, FaShieldAlt, FaTrashAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { authAPI, resumeAPI, userAPI } from '../utils/api'

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  })

  const [profileData, setProfileData] = useState({
    age: '',
    gender: 'male',
    educationLevel: '',
    skills: [],
    interest: []
  })

  const [resume, setResume] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  // ── Email verification OTP state ──
  const OTP_LENGTH = 6
  const RESEND_COOLDOWN = 60
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const otpRefs = useRef([])
  const [verifyError, setVerifyError] = useState('')
  const [verifyStatus, setVerifyStatus] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // ── Delete account state ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTyped, setDeleteTyped] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
  }
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const sendVerificationOtp = async () => {
    setVerifyError('')
    setVerifyStatus('')
    try {
      await authAPI.resendOtp(user.email, 'verify')
      setShowOtpInput(true)
      setResendTimer(RESEND_COOLDOWN)
      setVerifyStatus('Verification code sent to your email')
    } catch (err) {
      setVerifyError(err.message || 'Failed to send verification code')
    }
  }

  const handleVerifyOtp = useCallback(async () => {
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) { setVerifyError('Enter the full 6-digit code'); return }
    setVerifyLoading(true)
    setVerifyError('')
    try {
      await authAPI.verifyOtp(user.email, code)
      try {
        const profile = await authAPI.getProfile()
        updateUser(profile.user || profile)
      } catch { /* ignore */ }
      setVerifyStatus('Email verified successfully!')
      setShowOtpInput(false)
    } catch (err) {
      setVerifyError(err.message || 'Invalid or expired OTP')
    } finally {
      setVerifyLoading(false)
    }
  }, [otp, user?.email, updateUser])

  useEffect(() => {
    if (otp.every((d) => d !== '')) handleVerifyOtp()
  }, [otp, handleVerifyOtp])

  const handleDeleteAccount = async () => {
    if (deleteTyped !== 'DELETE') return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      await authAPI.deleteAccount()
      logout()
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  // Build notifications from actual profile/resume status
  const notifications = (() => {
    const items = [];
    if (!resume) {
      items.push({
        id: 'resume',
        icon: FaFileAlt,
        title: 'Upload Your Resume',
        message: 'Get ATS insights and career recommendations',
        color: 'purple',
        action: 'Upload',
        tab: 'resume'
      });
    }
    if (!profileData.educationLevel) {
      items.push({
        id: 'education',
        icon: FaGraduationCap,
        title: 'Add Education Level',
        message: 'Improve career matching accuracy',
        color: 'blue',
        action: 'Add',
        tab: 'personal'
      });
    }
    if (!profileData.skills || profileData.skills.length === 0) {
      items.push({
        id: 'skills',
        icon: FaCode,
        title: 'Add Your Skills',
        message: 'Unlock relevant career path recommendations',
        color: 'green',
        action: 'Add',
        tab: 'skills'
      });
    }
    if (!profileData.interest || profileData.interest.length === 0) {
      items.push({
        id: 'interests',
        icon: FaTools,
        title: 'Add Your Interests',
        message: 'Get better personalized recommendations',
        color: 'orange',
        action: 'Add',
        tab: 'skills'
      });
    }
    if (!profileData.age) {
      items.push({
        id: 'age',
        icon: FaUser,
        title: 'Complete Your Profile',
        message: 'Add your age to finish profile setup',
        color: 'teal',
        action: 'Add',
        tab: 'personal'
      });
    }
    return items;
  })();

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.fullName || user.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'User'}`,
      });
      loadProfile();
      loadResume();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const data = response?.data || null;
      if (data) {
        setProfileData({
          age: data.age || '',
          gender: data.gender || 'male',
          educationLevel: data.educationLevel || '',
          skills: data.skills || [],
          interest: data.interest || [],
        });
      }
    } catch (error) {
      console.log('Profile not found yet');
    }
  };

  const loadResume = async () => {
    try {
      const response = await resumeAPI.getResume();
      setResume(response?.data || null);
    } catch (error) {
      setResume(null);
    }
  };

  const pollForResumeAnalysis = async () => {
    const maxAttempts = 12;
    const delayMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const response = await resumeAPI.getResume();
      const resumePayload = response?.data || response;
      if (resumePayload) setResume(resumePayload);

      const status = resumePayload?.analysisStatus || 'completed';
      if (status === 'completed') return true;
      if (status === 'failed') {
        setMessage({ type: 'error', text: resumePayload?.analysisError || 'Resume analysis failed' });
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    setMessage({ type: 'error', text: 'Resume analysis is taking longer than expected.' });
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setMessage({ type: '', text: '' });
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please upload a PDF file' });
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setMessage({ type: 'error', text: 'Please select a resume file first' });
      return;
    }

    setUploadingResume(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await resumeAPI.uploadResume(resumeFile);
      const payload = response?.data || response;
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (payload?.status === 'processing' || payload?.analysisStatus === 'processing') {
        setMessage({ type: 'success', text: 'Resume uploaded. Analysis is in progress...' });
        await pollForResumeAnalysis();
      } else {
        setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        loadResume();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload resume' });
    } finally {
      setUploadingResume(false);
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setProfileData({ ...profileData, interest: [...profileData.interest, newInterest.trim()] })
      setNewInterest('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) })
  }

  const handleRemoveInterest = (interest) => {
    setProfileData({ ...profileData, interest: profileData.interest.filter(i => i !== interest) })
  }

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatePayload = {
        age: profileData.age,
        gender: profileData.gender,
        educationLevel: profileData.educationLevel,
        skills: profileData.skills,
        interest: profileData.interest,
        imgName: avatarFile || undefined,
      };

      const response = await authAPI.updateProfile(updatePayload);
      if (response?.avatarUrl) {
        updateUser({ avatarUrl: response.avatarUrl });
        setUserProfile((prev) => ({ ...prev, avatar: response.avatarUrl }));
        setAvatarFile(null);
        setAvatarPreview('');
      }
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save changes' });
    } finally {
      setLoading(false);
    }
  }

  const resumeName = resume?.resumeUrl ? resume.resumeUrl.split('/').pop() : 'No resume uploaded';
  const resumeDate = resume?.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : '';

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50">
      <Sidebar />

      <div className="flex-1 ml-52 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
              <FaUser className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Account</p>
              <h2 className="text-2xl font-bold text-slate-900">Profile Management</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                aria-label="Notifications"
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1 shadow">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 font-semibold text-sm flex items-center gap-2">
                        <FaBell className="text-teal-600" />
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {notifications.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notif, index) => {
                          const Icon = notif.icon;
                          const colorMap = {
                            purple: 'text-purple-600 bg-purple-50',
                            blue: 'text-blue-600 bg-blue-50',
                            green: 'text-green-600 bg-green-50',
                            orange: 'text-orange-600 bg-orange-50',
                            teal: 'text-teal-600 bg-teal-50'
                          };
                          const colors = colorMap[notif.color] || colorMap.blue;

                          return (
                            <div
                              key={notif.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                              onClick={() => {
                                setActiveTab(notif.tab);
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors}`}>
                                  <Icon className="text-sm" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 font-medium text-sm mb-0.5">
                                    {notif.title}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="h-1 bg-linear-to-r from-teal-500 via-emerald-400 to-amber-400" />
                <div className="p-6">
                  <div className="text-center mb-6">
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md ring-4 ring-amber-100" />
                    <h3 className="text-2xl font-bold text-slate-900">{userProfile.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{userProfile.email}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('personal')}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition font-semibold ${activeTab === 'personal' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <FaUser className="text-lg" />
                      <span>Personal Info</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('resume')}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition font-semibold ${activeTab === 'resume' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <FaFileAlt className="text-lg" />
                      <span>Resume</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition font-semibold ${activeTab === 'skills' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <FaBrain className="text-lg" />
                      <span>Skills & Interests</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('account')}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition font-semibold ${activeTab === 'account' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <FaShieldAlt className="text-lg" />
                      <span>Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'personal' && (
                <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        disabled
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        disabled
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <img
                      src={avatarPreview || userProfile.avatar}
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-full object-cover border border-slate-200 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email || 'User'}`;
                      }}
                    />
                    <div>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition"
                      >
                        Change Photo
                      </button>
                      <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                      {avatarFile && (
                        <p className="text-xs text-slate-700 mt-1">{avatarFile.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={profileData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Education Level</label>
                      <select
                        name="educationLevel"
                        value={profileData.educationLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      >
                        <option value="">Select</option>
                        <option value="secondary">Secondary</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Resume</h3>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeFileChange}
                        className="hidden"
                      />
                      {!resumeFile ? (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition text-sm"
                        >
                          <FaCloudUploadAlt />
                          {resume?.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">{resumeFile.name}</span>
                          <button
                            onClick={handleResumeUpload}
                            disabled={uploadingResume}
                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition text-sm disabled:opacity-50"
                          >
                            {uploadingResume ? 'Uploading...' : 'Upload'}
                          </button>
                          <button
                            onClick={() => { setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {resume?.resumeUrl ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <iframe
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/resume/pdf?token=${localStorage.getItem('token')}`}
                        title="Resume PDF"
                        className="w-full"
                        style={{ height: '80vh', border: 'none' }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
                    >
                      <FaCloudUploadAlt className="text-5xl text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">No resume uploaded yet</h4>
                      <p className="text-slate-500">Click here or use the button above to upload your PDF resume</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Skills & Interests</h3>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Skills</h4>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Enter a skill..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-black"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
                      >
                        <FaPlusCircle className="text-lg" />
                        <span>Add</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profileData.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-medium">
                          <span>{skill}</span>
                          <button onClick={() => handleRemoveSkill(skill)} className="text-teal-600 hover:text-teal-800">x</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Interests</h4>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        placeholder="Enter an interest..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-black"
                      />
                      <button
                        onClick={handleAddInterest}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
                      >
                        <FaPlusCircle className="text-lg" />
                        <span>Add</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profileData.interest.map((interest, i) => (
                        <div key={i} className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium">
                          <span>{interest}</span>
                          <button onClick={() => handleRemoveInterest(interest)} className="text-amber-700 hover:text-amber-900">x</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Account tab ── */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* Email Verification */}
                  <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Email Verification</h3>

                    {user?.isVerified ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FaCheckCircle className="text-emerald-600 text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-800">Email Verified</p>
                          <p className="text-sm text-emerald-600">{user.email} is verified</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-amber-800">Email Not Verified</p>
                            <p className="text-sm text-amber-600">{user?.email} needs verification</p>
                          </div>
                          {!showOtpInput && (
                            <button
                              onClick={sendVerificationOtp}
                              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition"
                            >
                              Send Code
                            </button>
                          )}
                        </div>

                        {verifyError && <div className="text-sm text-red-600 mb-3">{verifyError}</div>}
                        {verifyStatus && !showOtpInput && <div className="text-sm text-emerald-700 mb-3">{verifyStatus}</div>}

                        {showOtpInput && (
                          <div className="border border-slate-200 rounded-xl p-5">
                            {verifyStatus && <p className="text-sm text-emerald-700 mb-3">{verifyStatus}</p>}
                            <p className="text-sm text-slate-700 mb-3 font-medium">Enter the 6-digit code sent to your email</p>
                            <div className="flex items-center gap-3 flex-wrap" onPaste={handleOtpPaste}>
                              {otp.map((digit, i) => (
                                <input
                                  key={i}
                                  ref={(el) => (otpRefs.current[i] = el)}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(i, e.target.value)}
                                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                  className="h-12 w-10 rounded-lg border-2 border-slate-200 bg-white text-center text-xl font-bold text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                />
                              ))}
                              <button
                                onClick={handleVerifyOtp}
                                disabled={verifyLoading || otp.join('').length !== OTP_LENGTH}
                                className="ml-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                              >
                                {verifyLoading ? 'Verifying...' : 'Verify'}
                              </button>
                            </div>
                            <div className="mt-3 text-sm text-slate-500">
                              {resendTimer > 0 ? (
                                <span>Resend code in <span className="font-semibold text-teal-600">{resendTimer}s</span></span>
                              ) : (
                                <button onClick={sendVerificationOtp} className="font-semibold text-teal-600 hover:underline">
                                  Resend Code
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white/90 rounded-2xl shadow-xl border border-red-200 p-8">
                    <h3 className="text-2xl font-bold text-red-700 mb-2">Danger Zone</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
                      >
                        <FaTrashAlt />
                        Delete My Account
                      </button>
                    ) : (
                      <div className="border border-red-200 rounded-xl p-5 bg-red-50">
                        <p className="text-sm text-red-800 font-semibold mb-1">Are you absolutely sure?</p>
                        <p className="text-sm text-red-600 mb-4">
                          This will permanently delete your profile, resume, recommendations, chat history, and all scan data.
                          Type <span className="font-bold">DELETE</span> to confirm.
                        </p>
                        {deleteError && <div className="text-sm text-red-600 mb-3">{deleteError}</div>}
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={deleteTyped}
                            onChange={(e) => setDeleteTyped(e.target.value)}
                            placeholder='Type "DELETE"'
                            className="flex-1 max-w-xs px-4 py-2 border border-red-300 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          />
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleteTyped !== 'DELETE' || deleteLoading}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-40"
                          >
                            {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteTyped(''); setDeleteError(''); }}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile

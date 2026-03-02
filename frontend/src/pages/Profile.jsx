import React, { useState, useEffect, useRef } from 'react'
import { FaFileAlt, FaBrain, FaUser, FaBell, FaCloudUploadAlt, FaPlusCircle, FaCode, FaGraduationCap, FaBriefcase, FaProjectDiagram, FaTools, FaChartBar, FaFilePdf, FaExpand, FaCompress, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { authAPI, resumeAPI, userAPI } from '../utils/api'

function Profile() {
  const { user, updateUser } = useAuth();
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
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile

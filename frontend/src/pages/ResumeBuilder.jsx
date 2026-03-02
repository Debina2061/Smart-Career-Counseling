import React, { useState, useEffect, useRef } from 'react'
import { FaFileAlt, FaDownload, FaPrint, FaPlus, FaTimes, FaChevronDown, FaUser, FaBriefcase, FaGraduationCap, FaAward, FaCode, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaLink, FaSave } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { resumeAPI } from '../utils/api'

function ResumeBuilder() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const printRef = useRef()

  const [resumeData, setResumeData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    professionalSummary: '',
    
    // Work Experience
    experience: [
      {
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: ['']
      }
    ],
    
    // Education
    education: [
      {
        id: 1,
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
        honors: ''
      }
    ],
    
    // Skills
    skills: {
      technical: [],
      soft: [],
      languages: [],
      tools: []
    },
    
    // Projects
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        technologies: '',
        link: '',
        highlights: ['']
      }
    ],
    
    // Certifications
    certifications: [
      {
        id: 1,
        name: '',
        issuer: '',
        date: '',
        credentialId: ''
      }
    ],
    
    // Additional Sections
    achievements: [],
    languages: [],
    hobbies: []
  })

  const [userProfile, setUserProfile] = useState({
    name: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  })

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.fullName || user.name || user.email?.split('@')[0] || 'User',
        avatar: user.avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'User'}`
      });
      
      setResumeData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }));
      
      loadSavedResume();
    }
  }, [user]);

  const loadSavedResume = async () => {
    try {
      const savedData = localStorage.getItem('resumeBuilderData');
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      }
    } catch (error) {
      console.log('No saved resume data');
    }
  };

  const handleSaveResume = () => {
    setSaving(true);
    try {
      localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
      setMessage({ type: 'success', text: 'Resume saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save resume' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: ['']
      }]
    }))
  }

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const addAchievement = (expId) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
      )
    }))
  }

  const updateAchievement = (expId, index, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? {
          ...exp,
          achievements: exp.achievements.map((ach, i) => i === index ? value : ach)
        } : exp
      )
    }))
  }

  const removeAchievement = (expId, index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId ? {
          ...exp,
          achievements: exp.achievements.filter((_, i) => i !== index)
        } : exp
      )
    }))
  }

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
        honors: ''
      }]
    }))
  }

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Skills handlers
  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }))
    }
  }

  const removeSkill = (category, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }))
  }

  // Project handlers
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: '',
        highlights: ['']
      }]
    }))
  }

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const removeProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }))
  }

  const addProjectHighlight = (projId) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === projId ? { ...proj, highlights: [...proj.highlights, ''] } : proj
      )
    }))
  }

  const updateProjectHighlight = (projId, index, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === projId ? {
          ...proj,
          highlights: proj.highlights.map((h, i) => i === index ? value : h)
        } : proj
      )
    }))
  }

  const removeProjectHighlight = (projId, index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === projId ? {
          ...proj,
          highlights: proj.highlights.filter((_, i) => i !== index)
        } : proj
      )
    }))
  }

  // Certification handlers
  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        credentialId: ''
      }]
    }))
  }

  const updateCertification = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }))
  }

  const handleDownloadPDF = () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const printContent = printRef.current
      const originalBodyContent = document.body.innerHTML

      // Create print-specific styling
      const printStyles = `
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            * { box-sizing: border-box; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            h1, h2, h3 { page-break-after: avoid; }
          }
        </style>
      `

      const printWindow = window.open('', '', 'width=800,height=600')
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.fullName || 'Resume'} - CV</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            ${printStyles}
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
        setLoading(false)
        setMessage({ type: 'success', text: 'Resume ready to download! Please use your browser\'s print dialog to save as PDF.' })
      }, 500)

    } catch (error) {
      console.error('PDF generation error:', error)
      setMessage({ type: 'error', text: 'Failed to generate PDF. Please try again.' })
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-52 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <FaFileAlt className="text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Builder</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveResume}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save'}
            </button>
            
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <FaDownload />
              {loading ? 'Generating...' : 'Download PDF'}
            </button>
            
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <FaPrint />
              Print
            </button>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full" />
              <span className="text-sm font-medium text-gray-900">{userProfile.name}</span>
              <FaChevronDown className="text-gray-400 text-xs" />
            </div>
          </div>
        </header>

        {/* Message */}
        {message.text && (
          <div className={`mx-8 mt-4 px-4 py-3 rounded-lg no-print ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6 no-print">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaUser className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="debina@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="+977 9812345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Pharping ktm, Nepal"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={resumeData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                      <input
                        type="text"
                        value={resumeData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                      <input
                        type="text"
                        value={resumeData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                    <textarea
                      value={resumeData.professionalSummary}
                      onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
                      rows="4"
                      placeholder="Write a brief summary about your professional background and goals..."
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                  </div>
                  <button
                    onClick={addExperience}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <FaPlus /> Add
                  </button>
                </div>

                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Experience {index + 1}</span>
                        {resumeData.experience.length > 1 && (
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Company Name"
                          />
                        </div>

                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Location"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                          />
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Currently working here</span>
                        </label>

                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
                          rows="2"
                          placeholder="Job description..."
                        />

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Key Achievements</label>
                            <button
                              onClick={() => addAchievement(exp.id)}
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                            >
                              <FaPlus /> Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {exp.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                  placeholder="Achievement or responsibility..."
                                />
                                {exp.achievements.length > 1 && (
                                  <button
                                    onClick={() => removeAchievement(exp.id, achIndex)}
                                    className="text-red-600 hover:text-red-700 px-2"
                                  >
                                    <FaTimes />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Education</h3>
                  </div>
                  <button
                    onClick={addEducation}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <FaPlus /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                        {resumeData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Institution Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Location"
                          />
                          <input
                            type="month"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="GPA (e.g., 3.8/4.0)"
                          />
                          <input
                            type="text"
                            value={edu.honors}
                            onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Honors (e.g., Cum Laude)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaCode className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                </div>

                <div className="space-y-4">
                  {Object.entries({
                    technical: 'Technical Skills',
                    tools: 'Tools & Technologies',
                    soft: 'Soft Skills',
                    languages: 'Languages'
                  }).map(([category, label]) => (
                    <div key={category}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {resumeData.skills[category].map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(category, index)}
                              className="hover:text-blue-900"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addSkill(category, e.target.value)
                            e.target.value = ''
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder={`Add ${label.toLowerCase()} (press Enter)`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaCode className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Projects</h3>
                  </div>
                  <button
                    onClick={addProject}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <FaPlus /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Project {index + 1}</span>
                        {resumeData.projects.length > 1 && (
                          <button
                            onClick={() => removeProject(proj.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Project Name"
                        />
                        <textarea
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
                          rows="2"
                          placeholder="Project description..."
                        />
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                        />
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Project link (optional)"
                        />

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Key Highlights</label>
                            <button
                              onClick={() => addProjectHighlight(proj.id)}
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                            >
                              <FaPlus /> Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {proj.highlights.map((highlight, hIndex) => (
                              <div key={hIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={highlight}
                                  onChange={(e) => updateProjectHighlight(proj.id, hIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                  placeholder="Project highlight..."
                                />
                                {proj.highlights.length > 1 && (
                                  <button
                                    onClick={() => removeProjectHighlight(proj.id, hIndex)}
                                    className="text-red-600 hover:text-red-700 px-2"
                                  >
                                    <FaTimes />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaAward className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                  </div>
                  <button
                    onClick={addCertification}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <FaPlus /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-500">Certification {index + 1}</span>
                        {resumeData.certifications.length > 1 && (
                          <button
                            onClick={() => removeCertification(cert.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Certification Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Issuing Organization"
                          />
                          <input
                            type="month"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                        </div>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Credential ID (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" ref={printRef}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-900 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {resumeData.fullName || 'Your Name'}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                      {resumeData.email && (
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-xs" />
                          {resumeData.email}
                        </span>
                      )}
                      {resumeData.phone && (
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-xs" />
                          {resumeData.phone}
                        </span>
                      )}
                      {resumeData.location && (
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" />
                          {resumeData.location}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-sm text-blue-600 mt-2">
                      {resumeData.linkedin && (
                        <span className="flex items-center gap-1">
                          <FaLinkedin className="text-xs" />
                          {`linkedin.com/in/${resumeData.linkedin}`}
                        </span>
                      )}
                      {resumeData.github && (
                        <span className="flex items-center gap-1">
                          <FaGithub className="text-xs" />
                          {`github.com/${resumeData.github}`}
                        </span>
                      )}
                      {resumeData.portfolio && (
                        <span className="flex items-center gap-1">
                          <FaLink className="text-xs" />
                          {resumeData.portfolio}
                        </span>
                      )}
                    </div>
                  </div>


                  {resumeData.professionalSummary && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300">
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {resumeData.professionalSummary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.some(exp => exp.jobTitle || exp.company) && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                        WORK EXPERIENCE
                      </h2>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp) => {
                          if (!exp.jobTitle && !exp.company) return null
                          return (
                            <div key={exp.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                                  <p className="text-sm text-gray-700">{exp.company}</p>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  {exp.location && <div>{exp.location}</div>}
                                  <div>
                                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    {' - '}
                                    {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                                  </div>
                                </div>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                              )}
                              {exp.achievements.some(a => a.trim()) && (
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                                    <li key={i}>{achievement}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.some(edu => edu.degree || edu.institution) && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                        EDUCATION
                      </h2>
                      <div className="space-y-3">
                        {resumeData.education.map((edu) => {
                          if (!edu.degree && !edu.institution) return null
                          return (
                            <div key={edu.id}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                  <p className="text-sm text-gray-700">{edu.institution}</p>
                                  {(edu.gpa || edu.honors) && (
                                    <p className="text-sm text-gray-600">
                                      {edu.gpa && `GPA: ${edu.gpa}`}
                                      {edu.gpa && edu.honors && ' | '}
                                      {edu.honors}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  {edu.location && <div>{edu.location}</div>}
                                  {edu.graduationDate && (
                                    <div>
                                      {new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {Object.values(resumeData.skills).some(arr => arr.length > 0) && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                        SKILLS
                      </h2>
                      <div className="space-y-2">
                        {resumeData.skills.technical.length > 0 && (
                          <div>
                            <span className="font-semibold text-sm text-gray-900">Technical: </span>
                            <span className="text-sm text-gray-700">
                              {resumeData.skills.technical.join(' • ')}
                            </span>
                          </div>
                        )}
                        {resumeData.skills.tools.length > 0 && (
                          <div>
                            <span className="font-semibold text-sm text-gray-900">Tools: </span>
                            <span className="text-sm text-gray-700">
                              {resumeData.skills.tools.join(' • ')}
                            </span>
                          </div>
                        )}
                        {resumeData.skills.soft.length > 0 && (
                          <div>
                            <span className="font-semibold text-sm text-gray-900">Soft Skills: </span>
                            <span className="text-sm text-gray-700">
                              {resumeData.skills.soft.join(' • ')}
                            </span>
                          </div>
                        )}
                        {resumeData.skills.languages.length > 0 && (
                          <div>
                            <span className="font-semibold text-sm text-gray-900">Languages: </span>
                            <span className="text-sm text-gray-700">
                              {resumeData.skills.languages.join(' • ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.some(proj => proj.name) && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                        PROJECTS
                      </h2>
                      <div className="space-y-3">
                        {resumeData.projects.map((proj) => {
                          if (!proj.name) return null
                          return (
                            <div key={proj.id}>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                {proj.link && (
                                  <a href={proj.link} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    <FaLink className="text-xs" /> Link
                                  </a>
                                )}
                              </div>
                              {proj.technologies && (
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="font-semibold">Technologies:</span> {proj.technologies}
                                </p>
                              )}
                              {proj.description && (
                                <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                              )}
                              {proj.highlights.some(h => h.trim()) && (
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {proj.highlights.filter(h => h.trim()).map((highlight, i) => (
                                    <li key={i}>{highlight}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications.some(cert => cert.name) && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                        CERTIFICATIONS
                      </h2>
                      <div className="space-y-2">
                        {resumeData.certifications.map((cert) => {
                          if (!cert.name) return null
                          return (
                            <div key={cert.id} className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-sm text-gray-900">{cert.name}</h3>
                                <p className="text-sm text-gray-700">{cert.issuer}</p>
                                {cert.credentialId && (
                                  <p className="text-xs text-gray-600">Credential ID: {cert.credentialId}</p>
                                )}
                              </div>
                              {cert.date && (
                                <div className="text-sm text-gray-600">
                                  {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center pt-4 border-t border-gray-300">
                    <p className="text-xs text-gray-500">
                      Generated by Smart Career Counselling Platform • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ResumeBuilder

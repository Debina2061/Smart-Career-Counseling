import React, { useState, useEffect } from 'react'
import { FaMapPin, FaChevronDown, FaTrophy, FaCode, FaDatabase, FaPalette, FaBriefcase, FaCloud, FaChartBar, FaArrowUp, FaSync, FaGlobe } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { careerAPI, resumeAPI } from '../utils/api'

const isValidObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

function CareerRecommendation() {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsCareer, setDetailsCareer] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  });
  const [careerMatches, setCareerMatches] = useState([]);
  const [resumeType, setResumeType] = useState(null);
  const [summaryStats, setSummaryStats] = useState([
    { icon: FaTrophy, value: '--', label: 'Top Match' },
    { icon: FaArrowUp, value: '--', label: 'Avg Match' },
    { icon: FaBriefcase, value: '--', label: 'Career Paths' },
  ]);
  const [urlParams, setUrlParams] = useState({
    career: null,
    level: null,
    skills: null,
    location: null
  });
  const [autoSearchActive, setAutoSearchActive] = useState(false);

  useEffect(() => {
    // Parse URL parameters for auto-search
    const params = new URLSearchParams(location.search);
    const parsedParams = {
      career: params.get('career'),
      level: params.get('level'),
      skills: params.get('skills'),
      location: params.get('location')
    };
    
    if (Object.values(parsedParams).some(v => v !== null)) {
      setUrlParams(parsedParams);
      setAutoSearchActive(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.fullName || user.name || user.email?.split('@')[0] || 'User',
        avatar: user.avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'User'}`
      });
    }
    
    // Auto-load recommendations if URL parameters are present
    if (autoSearchActive && Object.values(urlParams).some(v => v !== null)) {
      handleAutoSearch();
    } else {
      loadRecommendations();
    }
  }, [user, autoSearchActive]);

  const handleAutoSearch = async () => {
    setLoading(true);
    setError('');
    try {
      // If manual recommendation generation is needed, call it with parameters
      const response = await careerAPI.generateRecommendations({
        searchCriteria: {
          career: urlParams.career,
          level: urlParams.level,
          skills: urlParams.skills ? urlParams.skills.split(',').map(s => s.trim()) : null,
          location: urlParams.location
        }
      });
      console.log('Auto-search recommendations:', response);
      await loadRecommendations();
    } catch (err) {
      console.error('Error in auto-search:', err);
      let errorMessage = err.message || 'Failed to generate recommendations';
      if (!errorMessage.includes('resume')) {
        errorMessage += '. Please ensure your resume is uploaded.';
      }
      setError(errorMessage);
      // Still try to load existing recommendations
      await loadRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      // First, try to get the resume to check its type
      try {
        const resumeResponse = await resumeAPI.getResume();
        const resumeData = resumeResponse?.data || null;
        if (resumeData?.resume_type) {
          setResumeType(resumeData.resume_type);
        }
      } catch (err) {
        // If we can't get resume type, that's okay - just continue
        console.log('Could not fetch resume type:', err.message);
      }

      const response = await careerAPI.getRecommendations();
      const recommendationDoc = response?.data || response;
      const recommendations = recommendationDoc?.recommendations || [];

      const formattedCareers = recommendations.map((career, index) => {
        const rawCareerId = career?.careerId?._id ?? career?.careerId ?? null;
        const normalizedCareerId = typeof rawCareerId === 'string'
          ? rawCareerId
          : rawCareerId?.toString?.() || null;
        const careerId = isValidObjectId(normalizedCareerId) ? normalizedCareerId : null;
        const careerName = career?.careerName || career?.name || career?.careerId?.careerName;
        const category = career?.category || career?.careerId?.category || 'General';

        return {
        icon: [FaCode, FaDatabase, FaPalette, FaBriefcase, FaCloud, FaChartBar][index % 6],
        careerId,
        title: careerName || 'Career Path',
        category,
        matchScore: career.matchScore || 0,
        description: career.aiInsights || (career.matchReasons?.join('. ') || 'No insights available yet.'),
        skillGaps: career.skillGaps || [],
        growthPotential: career.growthPotential || 'medium',
        jobSearch: career.jobSearch || null,
        color: 'from-teal-500 to-teal-600'
      }});

      setCareerMatches(formattedCareers);

      if (formattedCareers.length > 0) {
        const topMatch = formattedCareers[0]?.matchScore || 0;
        const avgMatch = Math.round(formattedCareers.reduce((sum, c) => sum + (c.matchScore || 0), 0) / formattedCareers.length);
        setSummaryStats([
          { icon: FaTrophy, value: `${topMatch}%`, label: 'Top Match' },
          { icon: FaArrowUp, value: `${avgMatch}%`, label: 'Avg Match' },
          { icon: FaBriefcase, value: formattedCareers.length.toString(), label: 'Career Paths' },
        ]);
      } else {
        setSummaryStats([
          { icon: FaTrophy, value: '--', label: 'Top Match' },
          { icon: FaArrowUp, value: '--', label: 'Avg Match' },
          { icon: FaBriefcase, value: '--', label: 'Career Paths' },
        ]);
      }
    } catch (err) {
      setCareerMatches([]);
      setSummaryStats([
        { icon: FaTrophy, value: '--', label: 'Top Match' },
        { icon: FaArrowUp, value: '--', label: 'Avg Match' },
        { icon: FaBriefcase, value: '--', label: 'Career Paths' },
      ]);
      console.log('Using default recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch resume type
      try {
        const resumeResponse = await resumeAPI.getResume();
        const resumeData = resumeResponse?.data || null;
        if (resumeData?.resume_type) {
          setResumeType(resumeData.resume_type);
        }
      } catch (err) {
        console.log('Could not fetch resume type:', err.message);
      }

      const response = await careerAPI.generateRecommendations();
      console.log('Generated recommendations:', response);
      await loadRecommendations();
    } catch (err) {
      console.error('Error generating recommendations:', err);
      
      // Provide helpful error messages
      let errorMessage = err.message || 'Failed to generate recommendations';
      
      if (errorMessage.includes('resume') || errorMessage.includes('Resume')) {
        errorMessage += '. Please upload your resume in the ATS Scanner first.';
      } else if (errorMessage.includes('career paths') || errorMessage.includes('No career')) {
        errorMessage += '. The system needs to be configured with career data. Contact administrator.';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Please sign in to generate recommendations.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('timeout')) {
        errorMessage = 'Connection error. Please check if the backend server is running.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (career) => {
    if (!isValidObjectId(career?.careerId)) {
      setDetailsOpen(true);
      setDetailsLoading(false);
      setDetailsError('');
      setDetailsCareer({
        careerName: career?.title || 'Career Details',
        category: career?.category || 'General',
        description: career?.description || 'Full career details are not available for this recommendation yet.',
        matchScore: career?.matchScore || 0,
        skillGaps: Array.isArray(career?.skillGaps) ? career.skillGaps : [],
        growthPotential: career?.growthPotential || 'medium',
        jobSearch: career?.jobSearch || null,
        isFallbackDetails: true
      });
      return;
    }

    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError('');
    setDetailsCareer(null);

    try {
      const response = await careerAPI.getCareerDetails(career.careerId);
      const detail = response?.data || response;
      setDetailsCareer({
        ...detail,
        matchScore: career.matchScore,
        skillGaps: career.skillGaps,
        growthPotential: career.growthPotential,
        jobSearch: career.jobSearch || null
      });
    } catch (err) {
      setDetailsError(err.message || 'Failed to load career details');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-52 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <FaMapPin className="text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Career Recommendations</h2>
              {autoSearchActive && (
                <p className="text-xs text-gray-500 mt-0.5">
                  <FaGlobe className="inline mr-1" />
                  Auto-search: {urlParams.career || 'All careers'} 
                  {urlParams.level && ` • Level: ${urlParams.level}`}
                  {urlParams.location && ` • Location: ${urlParams.location}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerateRecommendations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              {loading ? 'Generating...' : 'Refresh'}
            </button>
            <Link to="/profile" className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full" />
              <span className="text-sm font-medium text-gray-900">{userProfile.name}</span>
              <FaChevronDown className="text-gray-400 text-xs" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Recommendations</h1>
            <p className="text-gray-600">Based on your skills and interests</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {resumeType === 'Non-Technical' && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Non-Technical Resume Detected</h3>
                  <p className="text-gray-700">
                    Your resume appears to be non-technical (HR, Management, Sales, Marketing, Finance, etc.). 
                    Career recommendations are currently optimized for technical resumes. 
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    💡 For non-technical roles, we recommend consulting with a career advisor or exploring industry-specific job boards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {careerMatches.length === 0 && !loading && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <FaTrophy className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get Your Career Recommendations</h3>
                  <p className="text-gray-600 mb-4">
                    Click the <strong>Refresh</strong> button above to generate personalized career recommendations based on your resume and skills.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 font-semibold mb-2">📋 Before you start:</p>
                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                      <li>Upload your resume in the <Link to="/ats-scanner" className="text-purple-600 hover:underline">ATS Scanner</Link></li>
                      <li>Complete your profile with skills and interests</li>
                      <li>Click the Refresh button to generate matches</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {careerMatches.map((career, i) => {
              const Icon = career.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                        <Icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{career.title}</h3>
                        <p className="text-sm text-gray-500">{career.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-600">{career.matchScore}%</p>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{career.description}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Growth</p>
                      <p className="font-semibold capitalize">{career.growthPotential}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Skill Gaps</p>
                      <p className="font-semibold">{career.skillGaps.length}</p>
                    </div>
                  </div>
                  {career.jobSearch?.job_portals?.length > 0 ? (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="font-semibold text-gray-700">Job Options</span>
                        <span className="text-xs text-gray-500">{career.jobSearch.job_level}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {career.jobSearch.job_portals.map((portal) => (
                          <a
                            key={`${career.careerId}-${portal.portal_name}`}
                            href={portal.search_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-full border border-teal-200 text-teal-700 text-xs font-semibold hover:bg-teal-50"
                          >
                            {portal.portal_name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mb-4">
                      Job portal links will appear after refreshing recommendations.
                    </p>
                  )}
                  <button
                    onClick={() => handleViewDetails(career)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Icon className="text-3xl text-purple-600 mb-3" />
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setDetailsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              X
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {detailsCareer?.careerName || detailsCareer?.name || 'Career Details'}
            </h3>

            {detailsLoading && (
              <p className="text-gray-600">Loading details...</p>
            )}

            {!detailsLoading && detailsError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                {detailsError}
              </div>
            )}

            {!detailsLoading && detailsCareer && (
              <div className="space-y-4">
                {detailsCareer.isFallbackDetails && (
                  <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg text-sm">
                    Showing recommendation-based details. Full career catalog details are not available for this item yet.
                  </div>
                )}

                <div className="flex gap-6 text-sm text-gray-600">
                  <span>Category: <strong className="text-gray-900">{detailsCareer.category || 'General'}</strong></span>
                  <span>Match: <strong className="text-gray-900">{detailsCareer.matchScore || 0}%</strong></span>
                  <span>Growth: <strong className="text-gray-900 capitalize">{detailsCareer.growthPotential || 'medium'}</strong></span>
                </div>

                {detailsCareer.description && (
                  <p className="text-gray-700">{detailsCareer.description}</p>
                )}

                {detailsCareer.requiredSkills && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(detailsCareer.requiredSkills.technical || []).map((skill, idx) => (
                        <span key={`tech-${idx}`} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {(detailsCareer.requiredSkills.soft || []).map((skill, idx) => (
                        <span key={`soft-${idx}`} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(detailsCareer.skillGaps) && detailsCareer.skillGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Skill Gaps</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailsCareer.skillGaps.map((skill, idx) => (
                        <span key={`gap-${idx}`} className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {detailsCareer.salaryRange && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Salary Range</h4>
                    <p className="text-gray-700">
                      {detailsCareer.salaryRange.min || detailsCareer.salaryRange.minimum || 'N/A'} - {detailsCareer.salaryRange.max || detailsCareer.salaryRange.maximum || 'N/A'}
                    </p>
                  </div>
                )}

                {detailsCareer.jobSearch?.job_portals?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Job Portal Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailsCareer.jobSearch.job_portals.map((portal) => (
                        <a
                          key={`details-${portal.portal_name}`}
                          href={portal.search_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-full border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50"
                        >
                          {portal.portal_name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerRecommendation;

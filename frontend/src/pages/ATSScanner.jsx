import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt, FaCheckCircle, FaLightbulb, FaSync, FaSearch, FaChevronDown, FaFileAlt, FaDownload, FaTrophy } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { resumeAPI } from '../utils/api'

function ATSScanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [scanResults, setScanResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  });

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.fullName || user.name || user.email?.split('@')[0] || 'User',
        avatar: user.avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'User'}`
      });
    }
  }, [user]);

  const unwrapResumePayload = (payload) => {
    if (!payload) return null;
    return payload?.data || payload;
  };

  const buildScanResults = (payload, jdText) => {
    const analysisContent = payload?.analysis || payload?.resumeContent || null;
    let parsed = null;
    if (analysisContent) {
      try {
        parsed = typeof analysisContent === 'string' ? JSON.parse(analysisContent) : analysisContent;
      } catch {
        parsed = null;
      }
    }

    const skills = parsed ? [
      ...(parsed?.skills?.technical || []),
      ...(parsed?.skills?.frameworks || []),
      ...(parsed?.skills?.languages || []),
      ...(parsed?.skills?.soft || []),
    ] : [];

    const stopWords = new Set([
      'the','and','for','with','from','this','that','have','will','your','you','are','was','were','their','they','them',
      'able','about','into','over','under','within','when','where','what','which','while','using','use','used','also',
      'role','years','year','work','working','team','teams','project','projects','skills','skill','experience','required',
      'preferred','candidate','responsibilities','ability','knowledge','hands','strong','good','excellent','must','should',
      'plus','job','position','company','degree','bachelor','master','phd'
    ]);

    const extractKeywords = (text) => {
      if (!text) return [];
      const tokens = text
        .toLowerCase()
        .match(/[a-z0-9+.#-]{3,}/g) || [];
      const unique = [];
      tokens.forEach((token) => {
        if (stopWords.has(token)) return;
        if (!unique.includes(token)) unique.push(token);
      });
      return unique;
    };

    const jobKeywords = extractKeywords(jdText);
    const normalizedSkills = skills.map((s) => s.toLowerCase());
    const matchedKeywords = jobKeywords.filter((kw) =>
      normalizedSkills.some((skill) => skill.includes(kw) || kw.includes(skill))
    );
    const missingKeywords = jobKeywords.filter((kw) =>
      !normalizedSkills.some((skill) => skill.includes(kw) || kw.includes(skill))
    );

    const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
    if (suggestions.length === 0) {
      if (!parsed?.experience?.length) suggestions.push('Add or expand your work experience section');
      if (!parsed?.projects?.length) suggestions.push('Include projects to showcase practical skills');
      if (!parsed?.education?.length) suggestions.push('Add education details to strengthen your profile');
      if (skills.length < 5) suggestions.push('List more relevant skills for your target roles');
      if (missingKeywords.length > 0) suggestions.push(`Consider adding or highlighting: ${missingKeywords.slice(0, 6).join(', ')}`);
      if (suggestions.length === 0) suggestions.push('Resume parsed successfully. Consider tailoring it to each job description.');
    }

    let score = payload?.atsScore || payload?.score || payload?.compatibility;
    if (!score) score = 50;

    return {
      compatibility: score,
      matchedCount: skills.length + matchedKeywords.length,
      missingCount: missingKeywords.length,
      suggestionsCount: suggestions.length,
      matched: skills.slice(0, 15),
      missing: missingKeywords.slice(0, 12),
      suggestions: suggestions.map((s) => ({
        icon: FaCheckCircle,
        text: s,
        detail: ''
      })),
      lastScanned: 'Just now',
      rawData: payload
    };
  };

  const pollForResumeAnalysis = async () => {
    const maxAttempts = 15;
    const delayMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const resumeResponse = await resumeAPI.getResume();
      const resumePayload = unwrapResumePayload(resumeResponse);
      if (!resumePayload) throw new Error('Resume not found yet');

      const status = resumePayload.analysisStatus || 'completed';
      if (status === 'completed') return resumePayload;
      if (status === 'failed') {
        throw new Error(resumePayload.analysisError || 'Resume analysis failed');
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error('Resume analysis is taking longer than expected. Please try again later.');
  };

  const handleFileDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError('')
    }
  }

  const handleScan = async () => {
    if (!file) {
      setError('Please upload a resume file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await resumeAPI.uploadResume(file)
      const data = response?.data || response
      if (data?.status === 'processing' || data?.analysisStatus === 'processing') {
        const resumePayload = await pollForResumeAnalysis();
        setScanResults(buildScanResults(resumePayload, jobDescription))
      } else {
        setScanResults(buildScanResults(data, jobDescription))
      }
    } catch (err) {
      setError(err.message || 'Failed to scan resume. Please try again.')
      console.error('Scan error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (!scanResults) return;
    const payload = {
      atsScore: scanResults.compatibility,
      detectedSkills: scanResults.matched,
      suggestions: scanResults.suggestions.map((s) => s.text),
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ats-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-52 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <FaSearch className="text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">ATS Scanner</h2>
          </div>

          <Link to="/profile" className="flex items-center gap-4 border-l border-gray-200 pl-6">
            <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full" />
            <span className="text-sm font-medium text-gray-900">{userProfile.name}</span>
            <FaChevronDown className="text-gray-400 text-xs" />
          </Link>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SECTION - Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Your Resume</h3>

                {/* Drag Drop Area */}
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-input').click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-6"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaCloudUploadAlt className="text-3xl text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Drop your resume here</p>
                  <p className="text-gray-600 text-sm mb-3">or click to browse files</p>
                  <p className="text-xs text-gray-500">Supports PDF (Max 5MB)</p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setFile(e.target.files[0])
                      setError('')
                    }}
                    className="hidden"
                    id="file-input"
                  />
                </div>

                {file && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-6 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium truncate">{file.name}</p>
                  </div>
                )}

                {/* Job Description */}
                <div className="mb-6">
                  <label className="text-gray-900 font-semibold text-sm mb-2 block">Job Description (Optional)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description to get more accurate matching..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm text-gray-900 placeholder-gray-400"
                    rows="6"
                  />
                </div>

                {/* Scan Button */}
                <button
                  onClick={handleScan}
                  disabled={loading || !file}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSync className="text-lg animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <FaSearch className="text-lg" />
                      Scan Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT SECTION - Results */}
            <div className="lg:col-span-2">
              {scanResults ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">ATS Analysis Results</h3>
                      <p className="text-sm text-gray-500">Last scanned: {scanResults.lastScanned}</p>
                    </div>
                  </div>

                  {/* ATS Score */}
                  <div className="mb-8">
                    <h4 className="text-gray-900 font-semibold mb-3">ATS Compatibility Score</h4>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${scanResults.compatibility}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-green-500">{scanResults.compatibility}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Poor</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{scanResults.matchedCount}</p>
                      <p className="text-sm text-gray-600 mt-1">Detected Skills</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{scanResults.missingCount}</p>
                      <p className="text-sm text-gray-600 mt-1">Missing Skills</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{scanResults.suggestionsCount}</p>
                      <p className="text-sm text-gray-600 mt-1">Suggestions</p>
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FaCheckCircle className="text-green-500" />
                      <h4 className="text-gray-900 font-bold">Detected Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {scanResults.matched.map((keyword, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-5 h-5 flex items-center justify-center bg-orange-500 rounded-full text-white text-xs">!</span>
                      <h4 className="text-gray-900 font-bold">Missing Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {scanResults.missing.map((keyword, i) => (
                        <span key={i} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FaLightbulb className="text-blue-600" />
                      <h4 className="text-gray-900 font-bold">Improvement Suggestions</h4>
                    </div>
                    <div className="space-y-3">
                      {scanResults.suggestions.map((suggestion, i) => {
                        const Icon = suggestion.icon
                        return (
                          <div key={i} className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Icon className="text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-gray-900 font-semibold">{suggestion.text}</p>
                                <p className="text-sm text-gray-600 mt-1">{suggestion.detail}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownloadReport}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <FaDownload className="text-lg" />
                      Download Report
                    </button>
                    <button
                      onClick={() => navigate('/career-recommendation')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                      title="Generate career recommendations based on your ATS score"
                    >
                      <FaTrophy className="text-lg" />
                      Career Recommendation
                    </button>
                    <button
                      onClick={() => setScanResults(null)}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <FaSync className="text-lg" />
                      Scan Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaFileAlt className="text-5xl text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Resume Scanned Yet</h3>
                  <p className="text-gray-600 mb-6">Upload your resume on the left to get started with ATS analysis</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ATSScanner

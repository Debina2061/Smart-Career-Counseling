// API Configuration and Utility Functions using Axios
import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.status}] ${response.config.url}`);
    }
    return response.data;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ [${error.response?.status || 'Network Error'}] ${error.config?.url}`, error.message);
    }
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    
    // Format error response
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Something went wrong',
      data: error.response?.data || null,
    };
    
    return Promise.reject(errorResponse);
  }
);

// Helper function to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Helper function to set auth token in localStorage
export const setAuthToken = (token) => localStorage.setItem('token', token);

// Helper function to remove auth token from localStorage
export const removeAuthToken = () => localStorage.removeItem('token');

// Helper function to check if user is authenticated
export const isAuthenticated = () => !!getAuthToken();

const appendFormValue = (formData, key, value) => {
  if (value === undefined || value === null) return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item !== undefined && item !== null) formData.append(key, item);
    });
    return;
  }
  if (typeof value === 'object') {
    formData.append(key, JSON.stringify(value));
    return;
  }
  formData.append(key, value);
};

// Auth API endpoints
export const authAPI = {
  // Sign up a new user
  signUp: (userData) => api.post('/auth/sign-up', userData),
  
  // Sign in user
  signIn: (credentials) => api.post('/auth/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: async (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      appendFormValue(formData, key, profileData[key]);
    });
    
    return api.patch('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Sign out user
  signOut: () => api.post('/auth/sign-out'),
  
  // Logout user (client-side)
  logout: () => {
    removeAuthToken();
    window.location.href = '/signin';
  },
  
  // Verify token
  verifyToken: () => api.get('/auth/verify-token'),
  
  // Change password
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),

  // Forgot password
  requestPasswordReset: (email) => api.post('/auth/verify-email', { email }),
  setNewPassword: (email, token, newPassword) =>
    api.post(`/auth/set-newpassword?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      newPassword,
    }),
};

// Resume/ATS Scanner API endpoints
export const resumeAPI = {
  // Upload and scan resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    return api.post('/user/upload_resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResume: () => api.get('/user/resume'),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getDashboard: () => api.get('/user/dashboard'),
};

// AI Chatbot API endpoints
export const chatbotAPI = {
  // Quick ask (stateless)
  quickAsk: (question) => api.post('/chat/ask', { question }),
  
  // Start a new chat session
  startSession: () => api.post('/chat/session'),
  
  // Send message to a session
  sendMessage: (sessionId, message) => api.post(`/chat/session/${sessionId}/message`, { message }),
  
  // Get all sessions
  getSessions: () => api.get('/chat/sessions'),
  
  // Get specific session
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  
  // Delete session
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
};

// Career Recommendation API endpoints
export const careerAPI = {
  // Generate career recommendations
  generateRecommendations: () => api.post('/recommendation/generate', {}),
  
  // Get user's recommendations
  getRecommendations: () => api.get('/recommendation'),
  
  // Compare with a career
  compareWithCareer: (careerId) => api.post(`/recommendation/compare/${careerId}`),
  
  // Get all careers (public)
  getAllCareers: (params) => api.get('/recommendation/careers', { params }),
  
  // Get career details (public)
  getCareerDetails: (careerId) => api.get(`/recommendation/careers/${careerId}`),

  // Admin: create/update/delete careers
  createCareer: (careerData) => api.post('/recommendation/careers', careerData),
  updateCareer: (careerId, careerData) => api.patch(`/recommendation/careers/${careerId}`, careerData),
  deleteCareer: (careerId) => api.delete(`/recommendation/careers/${careerId}`),
};

// Job API endpoints
export const jobAPI = {
  // Get all jobs (public)
  getAllJobs: () => api.get('/job'),
  
  // Get job by ID
  getJobById: (jobId) => api.get(`/job/${jobId}`),
  
  // Get job matches for user
  getMatches: () => api.get('/job/user/matches'),
  
  // Analyze job match
  analyzeMatch: (jobId) => api.get(`/job/${jobId}/analyze`),
  
  // Apply for job
  applyForJob: (jobId) => api.post(`/job/${jobId}/apply`),
  
  // Get user's applications
  getMyApplications: () => api.get('/job/user/applications'),
  
  // Create job (admin/employer)
  createJob: (jobData) => api.post('/job/create', jobData),
};

// Admin API endpoints
export const adminAPI = {
  // Dashboard and analytics
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAdminMe: () => api.get('/admin/me'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  
  // User management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.patch(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Admin management (super admin only)
  getAllAdmins: () => api.get('/admin/admins'),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  updateAdmin: (adminId, adminData) => api.patch(`/admin/admins/${adminId}`, adminData),
  removeAdmin: (adminId) => api.delete(`/admin/admins/${adminId}`),
  
  // System logs
  getSystemLogs: (params) => api.get('/admin/logs', { params }),
};

// Export the axios instance for custom requests
export { api };

export default {
  auth: authAPI,
  resume: resumeAPI,
  user: userAPI,
  chatbot: chatbotAPI,
  career: careerAPI,
  job: jobAPI,
  admin: adminAPI,
};

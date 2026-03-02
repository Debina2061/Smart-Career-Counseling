// Auth API endpoints
import api, { removeAuthToken, appendFormValue } from './client';

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

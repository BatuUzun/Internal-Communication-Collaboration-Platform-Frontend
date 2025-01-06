// services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8765',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
});

// Axios interceptor for handling API responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors and handle 404 status for "not found" cases
    if (error.response?.status === 404) {
      console.warn('Email not found:', error.response.data); // Log for debugging
      return Promise.resolve(error.response); // Treat 404 as a resolved response
    }
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || { message: 'Something went wrong' });
  }
);



export const createUser = async (email, password) => {
  const response = await apiClient.post('/authentication/create-user', { email, password });
  return response.data;
};

export const checkUserLogin = async ({ email, password, rememberMe }) => {
  const response = await apiClient.post('/authentication/check-user-login', {
    email,
    password,
    rememberMe,
  });

  return response.data;
};

// Check email API function
export const checkEmail = async (email) => {
  try {
    const response = await apiClient.get('/authentication/check-email', {
      params: { email },
    });
    return response.data; // Return the user ID or -1 if the email does not exist
  } catch (error) {
    console.error('Error in checkEmail:', error); // Log for debugging
    throw error; // Re-throw unexpected errors
  }
};



export const sendVerificationCode = async ({ userId, requestType }) => {
  const response = await apiClient.post('/verification-code-manager/create-code', {
    userId,
    requestType,
  },{
    withCredentials: true, // Include cookies in the request
  });
  return response.data; // Assuming API returns the created verification code
};

export const validateCode = async ({ userId, verificationCode, requestType }) => {
  const response = await apiClient.post('/verification-code-manager/validate', {
    userId,
    verificationCode,
    requestType,
  });
  return response.data;
};

export const updatePassword = async ({ id, newPassword }) => {
  const response = await apiClient.post('/authentication/update-password', {
    id,
    newPassword,
  });
  return response.data;
};

// API call to check if the user is verified
export const checkUserVerificationStatus = async (userId) => {
  const response = await apiClient.get(`/verification-code-manager/is-verified/${userId}`);
  return response.data; // Returns true if verified, otherwise false
};
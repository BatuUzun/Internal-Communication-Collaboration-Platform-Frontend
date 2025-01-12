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
    // Check for 401 Unauthorized error
    if (error.response?.status === 401) {
      console.warn('Unauthorized access detected');

      // Exclude the `checkUserLogin` API from triggering a redirect
      if (!error.config.url.includes('/authentication/check-user-login')) {
        // Redirect to the login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';

          // Optionally clear cookies if necessary
          document.cookie = 'userId=; Max-Age=0; path=/;';
          document.cookie = 'userEmail=; Max-Age=0; path=/;';
        }
      }
    }

    // Handle 404 errors (for debugging)
    if (error.response?.status === 404) {
      console.warn('Resource not found:', error.response.data);
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

// Logout API call
export const logout = async () => {
  const response = await apiClient.post('/authentication/logout');
  return response.data;
};
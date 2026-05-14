// CropIQ API Module — Next.js Client Components
const BASE_URL = 'https://backend-cropiq.onrender.com/api';

// ==================== AUTH HELPERS ====================
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getToken();

// ==================== AUTH API ====================
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user._id || data.user.id);
  }
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user._id || data.user.id);
  }
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  if (typeof window !== 'undefined') window.location.href = '/login';
};

// ==================== CROPS API ====================
export const getAllCrops = async () => {
  const response = await fetch(`${BASE_URL}/crops`);
  return response.json();
};

export const addCrop = async (cropData) => {
  const response = await fetch(`${BASE_URL}/crops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(cropData),
  });
  return response.json();
};

// ==================== FIELDS API ====================
export const getMyFields = async () => {
  const response = await fetch(`${BASE_URL}/fields`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const addField = async (fieldData) => {
  const response = await fetch(`${BASE_URL}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(fieldData),
  });
  return response.json();
};

// ==================== LOAN API ====================
export const getMyLoans = async () => {
  const response = await fetch(`${BASE_URL}/loans`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const addLoan = async (loanData) => {
  const response = await fetch(`${BASE_URL}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(loanData),
  });
  return response.json();
};

// ==================== WEATHER API ====================
export const getWeather = async (lat, lon) => {
  const url = lat && lon ? `${BASE_URL}/weather?lat=${lat}&lon=${lon}` : `${BASE_URL}/weather`;
  const response = await fetch(url);
  return response.json();
};

// ==================== AI CHAT API ====================
export const chatWithAI = async (message) => {
  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return response.json();
};

// ==================== MARKET API ====================
export const getMarketPrices = async () => {
  const response = await fetch(`${BASE_URL}/market`);
  return response.json();
};

export const sellCrop = async (saleData) => {
  const response = await fetch(`${BASE_URL}/market/sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(saleData),
  });
  return response.json();
};

// ==================== SCHEMES API ====================
export const getGovernmentSchemes = async () => {
  const response = await fetch(`${BASE_URL}/schemes`);
  return response.json();
};

// ==================== KNOWLEDGE BASE API ====================
export const getKnowledgeBase = async () => {
  const response = await fetch(`${BASE_URL}/knowledge`);
  return response.json();
};

// ==================== ANALYTICS API ====================
export const getPriceAnalytics = async (cropName) => {
  const url = cropName ? `${BASE_URL}/analytics/prices?crop=${cropName}` : `${BASE_URL}/analytics/prices`;
  const response = await fetch(url);
  return response.json();
};

// ==================== USER PROFILE API ====================
export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(profileData),
  });
  return response.json();
};

// ==================== AI CROP DOCTOR API ====================
export const diagnoseCrop = async (imageFile, cropType) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('cropType', cropType);
  const response = await fetch(`${BASE_URL}/crop-diagnosis`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return response.json();
};

export const getDiagnosisHistory = async () => {
  const response = await fetch(`${BASE_URL}/crop-diagnosis/history`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const deleteDiagnosis = async (id) => {
  const response = await fetch(`${BASE_URL}/crop-diagnosis/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

// ==================== COMMUNITY API ====================
export const getCommunityPosts = async () => {
  const response = await fetch(`${BASE_URL}/community/posts`);
  return response.json();
};

export const createCommunityPost = async (postData) => {
  const response = await fetch(`${BASE_URL}/community/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const getPostDetails = async (postId) => {
  const response = await fetch(`${BASE_URL}/community/posts/${postId}`);
  return response.json();
};

export const addCommentToPost = async (postId, content) => {
  const response = await fetch(`${BASE_URL}/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ content }),
  });
  return response.json();
};

export const likePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/community/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

// ==================== DEBT FUND API ====================
export const applyForGrant = async (applicationData) => {
  const response = await fetch(`${BASE_URL}/debt-fund/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(applicationData),
  });
  return response.json();
};

export const getDebtFundStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/debt-fund/stats`);
    return response.json();
  } catch {
    return { error: 'Offline' };
  }
};

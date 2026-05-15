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

export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(userData),
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

// ==================== ORDERS API ====================
export const createOrder = async (orderData) => {
  console.log(`📡 Sending POST to ${BASE_URL}/orders`, orderData);
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const getFarmerOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

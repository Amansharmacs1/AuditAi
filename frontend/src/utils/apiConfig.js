/**
 * API Configuration
 * Centralizes the backend API base URL for all frontend requests
 */

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Use localhost for local development, otherwise fallback to production URL
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  return 'https://auditai-khcp.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Convenience functions for common endpoints
export const getEndpoint = (path) => `${API_BASE_URL}${path}`;

export const endpoints = {
  // Lead routes (for unauthenticated users)
  createLead: () => getEndpoint('/api/leads/create'),
  getSharedAudit: (shareId) => getEndpoint(`/api/leads/share/${shareId}`),

  // Audit routes (for authenticated users)
  generateAudit: () => getEndpoint('/api/ai/generate'),
  getLatestAudit: () => getEndpoint('/api/ai/latest'),
  getAuditHistory: (email) => getEndpoint(`/api/audit/history/${email}`),
  deleteAudit: (auditId) => getEndpoint(`/api/audit/${auditId}`),

  // Auth routes
  sendLink: () => getEndpoint('/api/auth/send-link'),
  verify: () => getEndpoint('/api/auth/verify'),
  setPassword: () => getEndpoint('/api/auth/set-password'),
  forgotPassword: () => getEndpoint('/api/auth/forgot-password'),
  resetPassword: () => getEndpoint('/api/auth/reset-password'),
  loginPassword: () => getEndpoint('/api/auth/login-password'),
};

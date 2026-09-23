/**
 * Unified API Client for Skinova AI Backend
 */

const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth & Profile
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Login failed');
    return res.json();
  },

  async signup(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Signup failed');
    return res.json();
  },

  async getProfile(userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/auth/profile?user_id=${userId}`);
    if (!res.ok) throw new Error('Could not load profile');
    return res.json();
  },

  async updateProfile(profileData, userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/auth/profile?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Could not update profile');
    return res.json();
  },

  // Skin Analysis
  async analyzeSkin(formData) {
    const res = await fetch(`${API_BASE}/analysis/analyze`, {
      method: 'POST',
      body: formData // multipart/form-data
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Skinova encountered an issue analyzing this image.' }));
      throw new Error(err.detail || 'Analysis failed. Please try a clearer photo.');
    }
    return res.json();
  },

  async getReports(userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/analysis/reports?user_id=${userId}`);
    return res.json();
  },

  async getReport(reportId) {
    const res = await fetch(`${API_BASE}/analysis/reports/${reportId}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  // Ask Skinova Chat
  async sendChatMessage(payload) {
    const res = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Error communicating with Skinova.' }));
      throw new Error(err.detail || 'Chat request failed');
    }
    return res.json();
  },

  // Ingredients
  async checkIngredients(ingredients) {
    const res = await fetch(`${API_BASE}/ingredients/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients })
    });
    if (!res.ok) throw new Error('Failed to analyze ingredients');
    return res.json();
  },

  async scanProductLabel(formData) {
    const res = await fetch(`${API_BASE}/ingredients/ocr-scan`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to scan product label');
    return res.json();
  },

  // Routine
  async buildRoutine(skinType, concern, userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/routine/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_type: skinType, concern, user_id: userId })
    });
    return res.json();
  },

  // Progress
  async getProgress(userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/progress/entries?user_id=${userId}`);
    return res.json();
  },

  async addProgress(entry) {
    const res = await fetch(`${API_BASE}/progress/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return res.json();
  },

  // Privacy
  async deleteUserData(userId = 'demo_user') {
    const res = await fetch(`${API_BASE}/privacy/delete-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, confirmation: true })
    });
    return res.json();
  },

  async getPrivacyPolicy() {
    const res = await fetch(`${API_BASE}/privacy/policy-summary`);
    return res.json();
  }
};

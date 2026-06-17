// frontend-dashboard/src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const dashboardApi = {
  getChildProfile: async (childId: string) => {
    const res = await fetch(`${API_URL}/api/v1/dashboard/child/${childId}`);
    return res.json();
  },

  getAlerts: async () => {
    const res = await fetch(`${API_URL}/api/v1/dashboard/alerts`);
    return res.json();
  }
};

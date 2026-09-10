import { StudentRecord, ContestConfig } from '../types/contest';

// Base API URL: In production, configured via VITE_API_URL pointing to Render backend.
// In local development, defaults to http://localhost:5000 if not specified.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : '');

export const contestApi = {
  getBaseUrl(): string {
    return API_BASE;
  },

  async getHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getConfig(): Promise<ContestConfig | null> {
    try {
      const res = await fetch(`${API_BASE}/api/config`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.config || null;
    } catch (e) {
      console.warn('[API] Could not fetch remote contest config:', e);
      return null;
    }
  },

  async updateConfig(updates: Partial<ContestConfig>): Promise<ContestConfig | null> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.config || null;
    } catch (e) {
      console.warn('[API] Could not sync config to server:', e);
      return null;
    }
  },

  async loginStudent(
    fullName: string,
    email: string,
    registrationNumber: string
  ): Promise<StudentRecord | null> {
    try {
      const res = await fetch(`${API_BASE}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, registrationNumber })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.student || null;
    } catch (e) {
      console.warn('[API] Could not sync student login to server:', e);
      return null;
    }
  },

  async startTest(email: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/students/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch (e) {
      console.warn('[API] Could not sync start test status to server:', e);
      return false;
    }
  },

  async submitAssessment(record: StudentRecord): Promise<StudentRecord | null> {
    try {
      const res = await fetch(`${API_BASE}/api/students/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.student || null;
    } catch (e) {
      console.warn('[API] Could not sync test submission to server:', e);
      return null;
    }
  },

  async getAdminParticipants(): Promise<StudentRecord[] | null> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/participants`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.participants || [];
    } catch (e) {
      console.warn('[API] Could not fetch participants from server:', e);
      return null;
    }
  },

  async deleteParticipant(idOrEmail: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/participants/${encodeURIComponent(idOrEmail)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      console.warn('[API] Could not delete participant from server:', e);
      return false;
    }
  },

  async resetData(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reset`, {
        method: 'POST'
      });
      return res.ok;
    } catch (e) {
      console.warn('[API] Could not reset contest records on server:', e);
      return false;
    }
  }
};

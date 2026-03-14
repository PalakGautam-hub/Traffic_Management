import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (email: string, password: string) =>
  api.post("/auth/register", { email, password });

// Junctions
export const getJunctions = () => api.get("/junctions");

// Traffic
export const getTrafficLogs = (limit = 50) =>
  api.get(`/traffic?limit=${limit}`);

export const getTrafficByJunction = (junctionId: string, limit = 50) =>
  api.get(`/traffic/${junctionId}?limit=${limit}`);

// Violations
export const getViolations = (limit = 50) =>
  api.get(`/violations?limit=${limit}`);

// Analytics
export const getAnalyticsSummary = () => api.get("/analytics/summary");
export const getTrafficTrends = () => api.get("/analytics/trends");
export const getVehicleDistribution = () =>
  api.get("/analytics/vehicle-distribution");
export const getJunctionStats = () => api.get("/analytics/junctions");

export default api;

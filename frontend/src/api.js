import axios from "axios";
export const DJANGO = import.meta.env.VITE_DJANGO_API || "http://127.0.0.1:8000";
export const FASTAPI = import.meta.env.VITE_FASTAPI_API || "http://127.0.0.1:8001";
export const djangoApi = axios.create({baseURL: DJANGO});
export const paymentApi = axios.create({baseURL: FASTAPI});
const attachToken = config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
djangoApi.interceptors.request.use(attachToken);
paymentApi.interceptors.request.use(attachToken);
export function errorMessage(error) {
  const d = error?.response?.data;
  if (Array.isArray(d?.detail)) return d.detail.map(x => x.msg || JSON.stringify(x)).join(", ");
  if (typeof d?.detail === "string") return d.detail;
  if (d && typeof d === "object") return Object.entries(d).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(", "):v}`).join(" | ");
  return error?.message || "Request failed. Check that both backend servers are running.";
}
export function rows(data) { return Array.isArray(data) ? data : (data?.results || data?.data || []); }
import ky from "ky";

export interface ApiResponse<T> {
  data: T;
  errorMsg: string;
  isSuccess: boolean;
}

const api = ky.create({
  timeout: 10000,
  baseUrl: `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_PORT}`,
});

export default api;

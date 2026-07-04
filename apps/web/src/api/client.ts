const BASE_URL = 'http://127.0.0.1:8000';
const FETCH_TIMEOUT_MS = 300000; // 5 minutes for long-running Gemma requests

export const mockDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetchWithTimeout(`${BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`GET ${url} failed with status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },
  post: async <T>(url: string, body: any): Promise<T> => {
    const isFormData = body instanceof FormData;
    const response = await fetchWithTimeout(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`POST ${url} failed with status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
};


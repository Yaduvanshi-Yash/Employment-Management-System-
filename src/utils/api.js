const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const apiRequest = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the server. Check that the backend URL is correct, the server is running, and CORS is configured.",
      );
    }

    throw error;
  }

  const responseText = await response.text();
  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
};

export const getApiBaseUrl = () => API_BASE_URL;

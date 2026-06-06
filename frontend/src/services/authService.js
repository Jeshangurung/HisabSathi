import apiClient from "./apiClient";


export async function loginUser(credentials) {
  const response = await apiClient.post("/auth/token/", credentials);
  return response.data;
}

export async function registerUser(payload) {
  const response = await apiClient.post("/auth/register/", payload);
  return response.data;
}

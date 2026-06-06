import axiosClient from "../../lib/axiosClient.js";


export async function loginUser(credentials) {
  const response = await axiosClient.post("/auth/token/", credentials);
  return response.data;
}

export async function registerUser(payload) {
  const response = await axiosClient.post("/auth/register/", payload);
  return response.data;
}

export async function logoutUser(refresh) {
  if (!refresh) {
    return;
  }
  await axiosClient.post("/auth/logout/", { refresh });
}

export async function getCurrentUser() {
  const response = await axiosClient.get("/auth/me/");
  return response.data;
}

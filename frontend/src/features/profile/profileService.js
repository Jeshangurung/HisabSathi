import axiosClient from "../../lib/axiosClient.js";
import { unwrapList } from "../groups/groupService.js";


export async function getProfile() {
  const response = await axiosClient.get("/auth/me/");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await axiosClient.patch("/auth/me/", payload);
  return response.data;
}

export async function getPaymentProfile() {
  const response = await axiosClient.get("/payment-profiles/");
  return unwrapList(response.data)[0] ?? null;
}

export async function updatePaymentProfile(id, payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const response = await axiosClient.patch(`/payment-profiles/${id}/`, formData);
  return response.data;
}

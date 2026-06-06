import axiosClient from "../../lib/axiosClient.js";
import { unwrapList } from "../groups/groupService.js";


export async function listSettlements() {
  const response = await axiosClient.get("/settlements/");
  return unwrapList(response.data);
}

export async function listMoneyIOwe() {
  const response = await axiosClient.get("/settlements/i-owe/");
  return response.data;
}

export async function listMoneyOwedToMe() {
  const response = await axiosClient.get("/settlements/owed-to-me/");
  return response.data;
}

export async function markSettlementPaid(id, payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });
  const response = await axiosClient.post(`/settlements/${id}/mark-paid/`, formData);
  return response.data;
}

export async function confirmSettlement(id) {
  const response = await axiosClient.post(`/settlements/${id}/confirm-received/`);
  return response.data;
}

export async function rejectSettlement(id, transaction_note = "") {
  const response = await axiosClient.post(`/settlements/${id}/reject/`, { transaction_note });
  return response.data;
}

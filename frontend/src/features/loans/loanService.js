import axiosClient from "../../lib/axiosClient.js";
import { unwrapList } from "../groups/groupService.js";


export async function listLoans() {
  const response = await axiosClient.get("/loans/");
  return unwrapList(response.data);
}

export async function listLoansGiven() {
  const response = await axiosClient.get("/loans/given/");
  return response.data;
}

export async function listLoansBorrowed() {
  const response = await axiosClient.get("/loans/borrowed/");
  return response.data;
}

export async function listOverdueLoans() {
  const response = await axiosClient.get("/loans/overdue/");
  return response.data;
}

export async function createLoan(payload) {
  const response = await axiosClient.post("/loans/", payload);
  return response.data;
}

export async function markLoanPaid(id, proofImage) {
  const formData = new FormData();
  if (proofImage) {
    formData.append("proof_image", proofImage);
  }
  const response = await axiosClient.post(`/loans/${id}/mark-paid/`, formData);
  return response.data;
}

export async function confirmLoanPaid(id) {
  const response = await axiosClient.post(`/loans/${id}/confirm-paid/`);
  return response.data;
}

import axiosClient from "../../lib/axiosClient.js";
import { unwrapList } from "../groups/groupService.js";


export async function listExpenses() {
  const response = await axiosClient.get("/expenses/");
  return unwrapList(response.data);
}

export async function getExpense(id) {
  const response = await axiosClient.get(`/expenses/${id}/`);
  return response.data;
}

export async function createExpense(payload) {
  const response = await axiosClient.post("/expenses/", payload);
  return response.data;
}

export async function listExpenseSplits() {
  const response = await axiosClient.get("/expense-splits/");
  return unwrapList(response.data);
}

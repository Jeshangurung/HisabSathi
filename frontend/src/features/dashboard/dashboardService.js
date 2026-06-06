import axiosClient from "../../lib/axiosClient.js";


export async function getDashboardSummary() {
  const response = await axiosClient.get("/dashboard/");
  return response.data.data;
}

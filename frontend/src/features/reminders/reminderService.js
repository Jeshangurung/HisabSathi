import axiosClient from "../../lib/axiosClient.js";
import { unwrapList } from "../groups/groupService.js";


export async function listReminders() {
  const response = await axiosClient.get("/reminders/");
  return unwrapList(response.data);
}

export async function markReminderRead(id) {
  const response = await axiosClient.post(`/reminders/${id}/mark-read/`);
  return response.data;
}

export async function markAllRemindersRead() {
  const response = await axiosClient.post("/reminders/mark-all-read/");
  return response.data;
}

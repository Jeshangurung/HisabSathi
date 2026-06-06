import axiosClient from "../../lib/axiosClient.js";


export function unwrapList(data) {
  return Array.isArray(data) ? data : data?.results ?? [];
}

export async function listGroups() {
  const response = await axiosClient.get("/groups/");
  return unwrapList(response.data);
}

export async function getGroup(id) {
  const response = await axiosClient.get(`/groups/${id}/`);
  return response.data;
}

export async function createGroup(payload) {
  const response = await axiosClient.post("/groups/", payload);
  return response.data;
}

export async function addGroupMember(groupId, payload) {
  const response = await axiosClient.post(`/groups/${groupId}/add-member/`, payload);
  return response.data;
}

export async function removeGroupMember(groupId, userId) {
  await axiosClient.delete(`/groups/${groupId}/remove-member/${userId}/`);
}

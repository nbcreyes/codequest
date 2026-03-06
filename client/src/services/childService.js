// All child profile and session API calls.

import api from "./api";

export const createChild = async (data) => {
  const response = await api.post("/children", data);
  return response.data;
};

export const getChildren = async () => {
  const response = await api.get("/children");
  return response.data;
};

export const getChild = async (id) => {
  const response = await api.get(`/children/${id}`);
  return response.data;
};

export const updateChild = async (id, data) => {
  const response = await api.put(`/children/${id}`, data);
  return response.data;
};

export const deleteChild = async (id) => {
  const response = await api.delete(`/children/${id}`);
  return response.data;
};

export const getAvatarOptions = async () => {
  const response = await api.get("/children/avatars");
  return response.data;
};

export const switchToChild = async (childId, pin = null) => {
  const response = await api.post(`/children/${childId}/switch`, pin ? { pin } : {});
  return response.data;
};

export const getPinStatus = async () => {
  const response = await api.get("/pin/status");
  return response.data;
};

export const setPin = async (pin) => {
  const response = await api.post("/pin/set", { pin });
  return response.data;
};

export const verifyPin = async (pin) => {
  const response = await api.post("/pin/verify", { pin });
  return response.data;
};

export const removePin = async (pin) => {
  const response = await api.post("/pin/remove", { pin });
  return response.data;
};
// API calls for chapters, lessons, and scenes.

import api from "./api";
import childApi from "./childApi";

export const getChapters = async () => {
  const response = await childApi.get("/chapters");
  return response.data;
};

export const getChapter = async (id) => {
  const response = await childApi.get(`/chapters/${id}`);
  return response.data;
};

export const getLessonScenes = async (lessonId) => {
  const response = await childApi.get(`/lessons/${lessonId}/scenes`);
  return response.data;
};

export const getChildProgress = async () => {
  const response = await childApi.get("/progress");
  return response.data;
};
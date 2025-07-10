import apiClient from "./apiClient";

export const getAllExercises = () => apiClient.get('/exercises/');

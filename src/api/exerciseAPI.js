import apiClient from './apiClient';

export function getAllExercises() {
  return apiClient.get('/exercises');
}

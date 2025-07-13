import axios from 'axios';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export const searchExercises = (query, maxResults = 10) => {
  return axios.get(YOUTUBE_SEARCH_URL, {
    params: {
      key: YOUTUBE_API_KEY,
      q: query,
      part: 'snippet',
      maxResults,
      type: 'video',
    },
  });
};

export const saveExerciseToBackend = (exercise) => {
  return axios.post('http://localhost:3000/api/exercises', exercise); // đổi lại URL backend của bạn nếu cần
};
// 👉 Thêm vào cùng file exerciseAPI.js
export const getAllExercises = () => {
  return axios.get('http://localhost:3000/api/exercises'); // đổi URL nếu cần
};

import axios from 'axios';


const songClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

songClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.headers['Authorization']) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= USER =================

export const getAllSongs = () => songClient.get('/songs/song');

// ================= ADMIN =================

export const getAllAdminSongs = () => songClient.get('/songs/admin/getAllSong');

export const createSong = (formData) => {
  const token = localStorage.getItem('token');

  return axios.post('http://localhost:3000/songs/admin/addSong', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}` 
    }
  });
};

export const updateSong = (id, data) =>
  songClient.put(`/songs/admin/song/${id}`, data);

export const deleteSong = (id) =>
  songClient.delete(`/songs/admin/delete/${id}`);

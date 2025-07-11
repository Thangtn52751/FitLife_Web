import apiClient from './apiClient';


export const getAllUsers = () => apiClient.get('/users/');


export const getUsers = params => 
  apiClient.get('/users', { params });


export const getUserById = id => apiClient.get(`/users/${id}`);


export const updateProfile = data => 
  apiClient.put('/users/profile', data);


export const changePassword = data =>
  apiClient.put('/users/change-password', data);

export const createEmployee = data =>
  apiClient.post('/users/employee', data);

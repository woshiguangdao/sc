import request from '../../api/request';

export const getUser = (id) => request.get(`/users/${id}`);
export const updateUser = (id, data) => request.put(`/users/${id}`, data);
export const listUsers = (params) => request.get('/users', { params });


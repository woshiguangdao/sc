import request from '../../api/request';

export const login = (payload) => request.post('/auth/login', payload);
export const logout = () => request.post('/auth/logout');
export const refreshToken = (payload) => request.post('/auth/refresh', payload);


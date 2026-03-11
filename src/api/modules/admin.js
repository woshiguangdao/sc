import request from '../../api/request';

export const fetchDashboard = () => request.get('/admin/dashboard');
export const listUsersAdmin = (params) => request.get('/admin/users', { params });
export const listMerchantsAdmin = (params) => request.get('/admin/merchants', { params });


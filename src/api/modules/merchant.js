import request from '../../api/request';

export const listMerchants = (params) => request.get('/merchants', { params });
export const getMerchant = (id) => request.get(`/merchants/${id}`);
export const updateMerchant = (id, data) => request.put(`/merchants/${id}`, data);


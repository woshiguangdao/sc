import request from '../../api/request';

export const chat = (payload) => request.post('/ai/chat', payload);
export const getConversation = (id) => request.get(`/ai/conversations/${id}`);


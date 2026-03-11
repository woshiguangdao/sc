import { getToken, setToken, removeToken } from './storage';

export const isAuthenticated = () => !!getToken();
export const login = (token) => setToken(token);
export const logout = () => removeToken();


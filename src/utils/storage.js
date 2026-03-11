const LS_PREFIX = 'app_';
export const setItem = (k, v) => localStorage.setItem(LS_PREFIX + k, JSON.stringify(v));
export const getItem = (k) => {
  const v = localStorage.getItem(LS_PREFIX + k); return v ? JSON.parse(v) : null;
};
export const removeItem = (k) => localStorage.removeItem(LS_PREFIX + k);

export const setToken = (t) => setItem('token', t);
export const getToken = () => getItem('token');
export const removeToken = () => removeItem('token');


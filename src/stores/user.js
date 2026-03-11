import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfo';

export const useUserStore = defineStore('user', () => {
  const userInfoStore = useUserInfoStore();
  const getProfile = () => userInfoStore.userInfo;
  return { getProfile };
});


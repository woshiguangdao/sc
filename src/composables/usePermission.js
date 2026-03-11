import { useUserStore } from '@/stores/user';
export default function usePermission(){
  const userStore = useUserStore();
  const hasPermission = (perm) => {
    const profile = userStore.getProfile();
    return profile && profile.permissions && profile.permissions.includes(perm);
  }
  return { hasPermission };
}


import { ref } from 'vue';
export default function useLoading(){
  const loading = ref(false);
  const start = () => loading.value = true;
  const stop = () => loading.value = false;
  return { loading, start, stop };
}


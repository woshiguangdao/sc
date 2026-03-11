import { ref } from 'vue';
export default function usePagination(initial={ page:1, size:10 }){
  const page = ref(initial.page);
  const size = ref(initial.size);
  const setPage = (p) => page.value = p;
  const setSize = (s) => size.value = s;
  return { page, size, setPage, setSize };
}


import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAiStore = defineStore('ai', () => {
  const conversations = ref([]);
  const addMessage = (convId, msg) => {
    let conv = conversations.value.find(c=>c.id===convId);
    if(!conv) { conv = { id: convId, messages: [] }; conversations.value.push(conv); }
    conv.messages.push(msg);
  }
  return { conversations, addMessage };
});


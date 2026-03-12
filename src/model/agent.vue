<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    <!-- 左侧：知识库管理 -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
      <div class="h-16 border-b border-gray-200 flex items-center px-6 bg-gray-50">
        <h2 class="text-lg font-bold text-gray-800">📚 知识库管理</h2>
      </div>
      <div class="p-5 border-b border-gray-100">
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">上传文档</label>
        <div class="relative group">
          <input type="file" multiple @change="handleFileChange" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".txt,.pdf,.docx"/>
          <div class="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center bg-blue-50 group-hover:bg-blue-100 transition">
            <div v-if="selectedFiles.length === 0" class="text-blue-600"><span class="text-2xl block">+</span><span class="text-xs">点击选择</span></div>
            <div v-else class="text-blue-700 text-sm font-medium">已选 {{ selectedFiles.length }} 个</div>
          </div>
        </div>
        <button @click="uploadAndBuild" :disabled="isLoading || selectedFiles.length === 0" class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded shadow disabled:bg-gray-300 transition">
          {{ isLoading ? '入库中...' : '立即入库' }}
        </button>
        <p v-if="buildMsg" class="mt-2 text-xs text-center" :class="buildType === 'error' ? 'text-red-500' : 'text-green-600'">{{ buildMsg }}</p>
      </div>
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-xs font-semibold text-gray-500 uppercase">文档列表 ({{ docList.length }})</h3>
          <button @click="fetchDocList" class="text-xs text-blue-500 hover:text-blue-700">刷新</button>
        </div>
        <ul v-if="docList.length > 0" class="space-y-2">
          <li v-for="file in docList" :key="file" class="group flex items-center justify-between bg-white p-2.5 rounded border border-gray-200 hover:border-blue-300 transition">
            <span class="text-sm text-gray-700 truncate mr-2">{{ file }}</span>
            <button @click="deleteDocument(file)" class="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </li>
        </ul>
        <div v-else class="text-center text-gray-400 text-sm mt-10">暂无文档</div>
      </div>
    </div>

    <!-- 右侧：智能对话 -->
    <div class="flex-1 flex flex-col bg-white relative">
      <!-- 顶部 -->
      <div class="h-16 border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10 bg-white">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800">🤖 智能助手</h1>
          <span v-if="sessionId" class="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">会话中 ({{ Math.floor(messages.length / 2) }} 轮)</span>
        </div>
        <div class="flex space-x-2">
          <button @click="updateMaxTurns" class="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition flex items-center" title="设置最大保留轮数">
            <span class="mr-1">⚙️</span> 限 {{ maxTurns }} 轮
          </button>
          <button @click="clearContext" :disabled="!sessionId" class="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50">清空历史</button>
        </div>
      </div>

      <!-- 消息区 -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 scroll-smooth">
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400">
          <div class="text-6xl mb-4">💬</div>
          <p class="text-lg font-medium text-gray-600">有什么可以帮你的？</p>
          <div class="flex flex-wrap gap-2 mt-6">
            <button v-for="(q, idx) in quickQuestions" :key="idx" @click="sendMessage(q)" class="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-xs rounded-full hover:bg-blue-50 hover:shadow-md transition">
              ⚡ {{ q }}
            </button>
          </div>
        </div>

        <div v-for="(msg, index) in messages" :key="index" class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <!-- AI 消息 -->
          <div v-if="msg.role !== 'user'" class="flex max-w-[85%] items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
            <div class="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm leading-relaxed w-full">
              <div class="markdown-body prose prose-sm max-w-none" v-html="renderMarkdown(msg.content)"></div>

              <!-- 追问 -->
              <div v-if="msg.follow_up_questions?.length" class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 mb-2">💡 您可能还想知道：</p>
                <div class="flex flex-wrap gap-2">
                  <button v-for="(q, idx) in msg.follow_up_questions" :key="idx" @click="sendMessage(q)" class="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition">
                    ↳ {{ q }}
                  </button>
                </div>
              </div>

              <!-- 来源 -->
              <div v-if="msg.sources?.length" class="mt-2 pt-2 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 mb-1">📚 参考来源：</p>
                <ul class="space-y-1">
                  <li v-for="(src, idx) in msg.sources" :key="idx" @click="openSourceModal(src)" class="text-xs bg-gray-50 p-2 rounded border border-gray-200 hover:bg-blue-50 cursor-pointer">
                    <div class="flex justify-between">
                      <span class="font-medium text-blue-700 truncate max-w-[200px]">📄 {{ src.source }}</span>
                      <span class="text-gray-400 text-[10px]">相似度：{{ src.score }}</span>
                    </div>
                    <p class="text-gray-500 mt-1 line-clamp-2 italic">"{{ src.content_preview }}"</p>
                  </li>
                </ul>
              </div>
              <div class="text-xs text-gray-400 mt-1 text-right">{{ msg.time }}</div>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-else class="flex max-w-[80%] items-end gap-3 flex-row-reverse">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-lg text-white flex-shrink-0">👤</div>
            <div class="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed">
              <img v-if="msg.imageUrl" :src="msg.imageUrl" class="max-w-full h-auto max-h-64 rounded-lg border border-blue-400 mb-1 bg-white/10" />
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
              <div class="text-xs text-blue-100 mt-1 text-right">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="isChatLoading && !currentStreamingMessage" class="flex justify-start">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg">🤖</div>
            <div class="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div class="flex space-x-1.5">
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="p-6 bg-white border-t border-gray-100">
        <div class="max-w-4xl mx-auto relative">
          <!-- 图片预览 -->
          <div v-if="imagePreviewUrl" class="absolute bottom-20 left-0 bg-white p-3 rounded-xl shadow-lg border border-gray-200 flex items-center gap-3 animate-fade-in-up z-20">
            <div class="relative">
              <img :src="imagePreviewUrl" class="h-16 w-16 object-cover rounded border" />
              <button @click="clearImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <span class="text-xs font-semibold text-gray-700">已选择图片</span>
          </div>

          <div class="flex items-end gap-2">
            <!-- 图片上传 -->
            <div class="relative pb-2">
              <input id="imageInput" ref="imageInput" type="file" accept="image/*" @change="handleImageChange" class="hidden"/>
              <button @click="$refs.imageInput.click()" class="h-12 w-12 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" :disabled="isChatLoading">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
            </div>

            <!-- 语音输入 -->
            <div class="relative pb-2">
              <button
                  @click="toggleSpeechRecognition"
                  class="h-12 w-12 flex items-center justify-center rounded-full transition shadow-sm"
                  :class="isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'"
                  :disabled="isChatLoading"
                  title="语音输入"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            <!-- 文本框 -->
            <div class="flex-1 relative">
              <input
                  v-model="userInput"
                  @keyup.enter="sendMessage()"
                  type="text"
                  placeholder="输入问题或点击麦克风说话..."
                  class="w-full border border-gray-300 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition"
                  :disabled="isChatLoading"
              />
              <button @click="sendMessage()" :disabled="isChatLoading || (!userInput.trim() && !selectedImage)" class="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium disabled:bg-gray-300 transition">
                发送
              </button>
            </div>
          </div>
          <p class="text-center mt-3 text-xs text-gray-400">支持语音输入、自动纠错与问题优化</p>
        </div>
      </div>
    </div>

    <!-- 模态框：文档详情 -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">📄 {{ currentSource?.source }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div class="mb-4 flex gap-2 text-xs">
            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">相似度：{{ currentSource?.score }}</span>
          </div>
          <div class="prose prose-sm text-gray-700 whitespace-pre-wrap">{{ currentSource?.full_content }}</div>
        </div>
        <div class="p-4 border-t bg-gray-50 text-right">
          <button @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">关闭</button>
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <div v-if="toast.show" class="fixed top-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in-down">
      <span class="mr-2" :class="toast.type === 'success' ? 'text-green-400' : 'text-red-400'">{{ toast.type === 'success' ? '✓' : '!' }}</span>
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, shallowRef } from 'vue';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const md = shallowRef(new MarkdownIt({ html: true, linkify: true, highlight: (str, lang) => hljs.getLanguage(lang) ? hljs.highlight(str, { language: lang }).value : md.value.utils.escapeHtml(str) }));

const API_BASE = 'http://localhost:8000';
const WS_BASE = API_BASE.replace('http', 'ws');

// 状态
const selectedFiles = ref([]);
const isLoading = ref(false);
const buildMsg = ref('');
const buildType = ref('success');
const docList = ref([]);

const userInput = ref('');
const isChatLoading = ref(false);
const messages = ref([]);
const chatContainer = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });

const selectedImage = ref(null);
const imagePreviewUrl = ref(null);
const imageInput = ref(null);
const sessionId = ref(null);

const quickQuestions = ["知识库有多少文档？", "如何预防死锁？", "总结最近文档", "图片内容是什么？"];
const modalOpen = ref(false);
const currentSource = ref(null);
const currentStreamingMessage = ref(null);
let wsSocket = null;

// 语音识别
const isListening = ref(false);
let recognition = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onstart = () => { isListening.value = true; showToast("正在聆听...", "success"); };
  recognition.onend = () => { isListening.value = false; };
  recognition.onresult = (e) => {
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
    }
    if (final) userInput.value = (userInput.value + ' ' + final).trim();
  };
  recognition.onerror = (e) => {
    isListening.value = false;
    if (e.error !== 'no-speech') showToast("语音识别失败：" + e.error, "error");
  };
}

onMounted(() => fetchDocList());

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const scrollToBottom = () => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; };
const renderMarkdown = (text) => text ? md.value.render(text) : '';
const openSourceModal = (src) => { currentSource.value = src; modalOpen.value = true; };
const closeModal = () => { modalOpen.value = false; currentSource.value = null; };
const maxTurns = ref(10);

const handleFileChange = (e) => { selectedFiles.value = Array.from(e.target.files); buildMsg.value = ''; };
const fetchDocList = async () => {
  try {
    const res = await axios.get(`${API_BASE}/list_docs`);
    docList.value = res.data.files || [];
  } catch (e) { showToast("获取列表失败", "error"); }
};
const uploadAndBuild = async () => {
  if (!selectedFiles.value.length) return;
  isLoading.value = true;
  const formData = new FormData();
  selectedFiles.value.forEach(f => formData.append('files', f));
  try {
    const res = await axios.post(`${API_BASE}/upload_and_build`, formData);
    buildMsg.value = res.data.message;
    buildType.value = 'success';
    showToast('入库成功');
    selectedFiles.value = [];
    fetchDocList();
  } catch (e) {
    buildMsg.value = e.response?.data?.detail || '失败';
    buildType.value = 'error';
    showToast(buildMsg.value, 'error');
  } finally { isLoading.value = false; }
};
const deleteDocument = async (filename) => {
  if(!confirm(`删除 ${filename}?`)) return;
  try {
    await axios.post(`${API_BASE}/delete_doc?filename=${encodeURIComponent(filename)}`);
    showToast('已删除');
    fetchDocList();
  } catch (e) { showToast('删除失败', 'error'); }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file || file.size > 5 * 1024 * 1024) { showToast("图片需小于 5MB", "error"); return; }
  selectedImage.value = file;
  imagePreviewUrl.value = URL.createObjectURL(file);
};
const clearImage = () => { selectedImage.value = null; imagePreviewUrl.value = null; if (imageInput.value) imageInput.value.value = ''; };
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
});

const toggleSpeechRecognition = () => {
  if (!recognition) return showToast("浏览器不支持语音", "error");
  isListening.value ? recognition.stop() : recognition.start();
};

const updateMaxTurns = async () => {
  const val = parseInt(prompt("请输入最大保留对话轮数 (1-50):", maxTurns.value));
  if (val && val > 0 && val <= 50) {
    try {
      await axios.post(`${API_BASE}/set_max_turns?max_turns=${val}`);
      maxTurns.value = val;
      showToast(`已设置最大保留 ${val} 轮`);
    } catch (e) {
      showToast("设置失败", "error");
    }
  } else if (val) {
    showToast("请输入 1-50 之间的数字", "error");
  }
};

const sendMessage = async (customQ = null) => {
  let q = typeof customQ === 'string' ? customQ : userInput.value.trim();
  if (!q && !selectedImage.value) return;

  const displayContent = selectedImage.value ? (q ? `[图片] ${q}` : '[图片] 请分析') : q;
  messages.value.push({ role: 'user', content: displayContent, imageUrl: selectedImage.value ? imagePreviewUrl.value : null, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });

  if (!customQ) userInput.value = '';
  const currentImg = selectedImage.value;
  clearImage();
  isChatLoading.value = true;

  const aiMsg = { role: 'assistant', content: '', sources: [], follow_up_questions: [], time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isStreaming: true };
  messages.value.push(aiMsg);
  currentStreamingMessage.value = aiMsg;
  nextTick(scrollToBottom);

  try {
    wsSocket = new WebSocket(`${WS_BASE}/ws/chat`);
    wsSocket.onopen = async () => {
      const payload = { question: q || "分析图片", session_id: sessionId.value };
      if (currentImg) payload.image_data = await fileToBase64(currentImg);
      wsSocket.send(JSON.stringify(payload));
    };

    wsSocket.onmessage = (e) => {
      const pkt = JSON.parse(e.data);
      if (pkt.type === 'correction') {
        const { original, corrected } = pkt.data;
        showToast(`已修正：${original} → ${corrected}`, 'success');
        return;
      }
      if (pkt.type === 'token' && currentStreamingMessage.value) {
        currentStreamingMessage.value.content += pkt.content;
        nextTick(scrollToBottom);
      } else if (pkt.type === 'sources' && currentStreamingMessage.value) {
        currentStreamingMessage.value.sources = pkt.data;
      } else if (pkt.type === 'follow_up' && currentStreamingMessage.value) {
        currentStreamingMessage.value.follow_up_questions = pkt.data;
      } else if (pkt.type === 'done') {
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.isStreaming = false;
          currentStreamingMessage.value = null;
        }
        if (pkt.session_id) sessionId.value = pkt.session_id;
        isChatLoading.value = false;
        wsSocket.close();
      } else if (pkt.type === 'error') {
        throw new Error(pkt.content);
      }
    };

    wsSocket.onerror = () => { throw new Error("连接错误"); };
    wsSocket.onclose = () => {
      if (isChatLoading.value) {
        isChatLoading.value = false;
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.content += "\n\n[连接断开]";
          currentStreamingMessage.value.isStreaming = false;
          currentStreamingMessage.value = null;
        }
      }
    };
  } catch (err) {
    isChatLoading.value = false;
    if (currentStreamingMessage.value) {
      currentStreamingMessage.value.content += `\n\n❌ 错误：${err.message}`;
      currentStreamingMessage.value.isStreaming = false;
      currentStreamingMessage.value = null;
    }
    if (wsSocket) wsSocket.close();
  }
};

const clearContext = async () => {
  if (!sessionId.value) { messages.value = []; return; }
  try {
    await axios.post(`${API_BASE}/clear_context?session_id=${sessionId.value}`);
    messages.value = [];
    sessionId.value = null;
    showToast("历史已清空");
  } catch (e) { showToast("清空失败", "error"); }
};
</script>

<style scoped>
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 3px; }
.markdown-body :deep(pre) { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
.markdown-body :deep(code) { font-family: monospace; font-size: 0.875em; }
</style>
<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    <!-- ================= 左侧：知识库管理 ================= -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
      <div class="h-16 border-b border-gray-200 flex items-center px-6 bg-gray-50">
        <h2 class="text-lg font-bold text-gray-800 flex items-center">
          <span class="mr-2">📚</span> 知识库管理
        </h2>
      </div>
      <div class="p-5 border-b border-gray-100">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">上传新文档</label>
        <div class="relative group">
          <input type="file" multiple @change="handleFileChange" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".txt,.pdf,.docx"/>
          <div class="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center bg-blue-50 group-hover:bg-blue-100 transition">
            <div v-if="selectedFiles.length === 0" class="text-blue-600"><span class="text-2xl block">+</span><span class="text-xs font-medium">点击选择文件</span></div>
            <div v-else class="text-blue-700 text-sm font-medium">已选 {{ selectedFiles.length }} 个文件</div>
          </div>
        </div>
        <button @click="uploadAndBuild" :disabled="isLoading || selectedFiles.length === 0" class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed transition">{{ isLoading ? '入库中...' : '立即入库' }}</button>
        <p v-if="buildMsg" class="mt-2 text-xs text-center truncate" :class="buildType === 'error' ? 'text-red-500' : 'text-green-600'">{{ buildMsg }}</p>
      </div>
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div class="flex justify-between items-center mb-3"><h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">已入库文档 ({{ docList.length }})</h3><button @click="fetchDocList" class="text-xs text-blue-500 hover:text-blue-700">刷新</button></div>
        <ul v-if="docList.length > 0" class="space-y-2">
          <li v-for="file in docList" :key="file" class="group flex items-center justify-between bg-white p-2.5 rounded border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <div class="flex items-center overflow-hidden mr-2"><span class="text-gray-400 mr-2 text-xs flex-shrink-0">📄</span><span class="text-sm text-gray-700 truncate" :title="file">{{ file }}</span></div>
            <button @click="deleteDocument(file)" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-all duration-200 flex-shrink-0" title="删除文档"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </li>
        </ul>
        <div v-else class="text-center text-gray-400 text-sm mt-10 italic">暂无文档，请上传</div>
      </div>
    </div>

    <!-- ================= 右侧：智能助手对话 ================= -->
    <div class="flex-1 flex flex-col bg-white relative">

      <!-- 顶部标题 -->
      <div class="h-16 border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10 bg-white">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800 flex items-center"><span class="mr-2">🤖</span> 智能助手</h1>
          <span v-if="sessionId" class="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">会话中 ({{ Math.floor(messages.length / 2) }} 轮)</span>
        </div>
        <div class="flex space-x-2">
          <button @click="updateMaxTurns" class="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition flex items-center" title="设置最大保留轮数"><span class="mr-1">⚙️</span> 限 {{ maxTurns }} 轮</button>
          <button @click="clearContext" :disabled="!sessionId" class="text-xs text-red-500 hover:text-red-700 border border-red-100 px-3 py-1.5 rounded hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"><span class="mr-1">🗑️</span> 清空历史</button>
        </div>
      </div>

      <!-- 消息滚动区 -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 scroll-smooth">

        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-80">
          <div class="text-6xl mb-4">💬</div>
          <p class="text-lg font-medium text-gray-600">有什么可以帮你的吗？</p>
          <div class="flex flex-wrap justify-center gap-2 max-w-2xl mt-6">
            <button v-for="(q, idx) in quickQuestions" :key="idx" @click="sendMessage(q)" class="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-xs rounded-full hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition flex items-center"><span class="mr-1">⚡</span> {{ q }}</button>
          </div>
        </div>

        <!-- 消息循环 -->
        <div v-for="(msg, index) in messages" :key="index" class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">

          <!-- AI 消息 (左侧) -->
          <div v-if="msg.role !== 'user'" class="flex max-w-[85%] items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
            <div class="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm leading-relaxed flex flex-col gap-2 w-full">

              <!-- Markdown 渲染区域 -->
              <div class="markdown-body prose prose-sm max-w-none text-gray-800" v-html="renderMarkdown(msg.content)"></div>

              <!-- 追问引导区域 -->
              <div v-if="msg.follow_up_questions && msg.follow_up_questions.length > 0" class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                  <span class="mr-1">💡</span> 您可能还想知道：
                </p>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="(q, idx) in msg.follow_up_questions"
                      :key="idx"
                      @click="sendMessage(q)"
                      class="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition flex items-center group"
                  >
                    <span class="mr-1 text-blue-400 group-hover:text-blue-600">↳</span> {{ q }}
                  </button>
                </div>
              </div>

              <!-- 来源文档展示 -->
              <div v-if="msg.sources && msg.sources.length > 0" class="mt-2 pt-2 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 mb-1 flex items-center">
                  <span class="mr-1">📚</span> 参考来源 (点击查看详情):
                </p>
                <ul class="space-y-1">
                  <li
                      v-for="(src, idx) in msg.sources"
                      :key="idx"
                      @click="openSourceModal(src)"
                      class="text-xs bg-gray-50 p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer group"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-medium text-blue-700 truncate max-w-[200px]" :title="src.source">📄 {{ src.source }}</span>
                      <span class="text-gray-400 ml-2 whitespace-nowrap text-[10px] group-hover:text-blue-500">相似度: {{ src.score }}</span>
                    </div>
                    <p class="text-gray-500 mt-1 line-clamp-2 italic">"{{ src.content_preview }}"</p>
                  </li>
                </ul>
              </div>

              <div class="text-xs text-gray-400 mt-1 text-right self-end">{{ msg.time }}</div>
            </div>
          </div>

          <!-- 用户消息 (右侧) -->
          <div v-else class="flex max-w-[80%] items-end gap-3 flex-row-reverse">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-lg flex-shrink-0 text-white">👤</div>
            <div class="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed flex flex-col gap-2">
              <img v-if="msg.imageUrl" :src="msg.imageUrl" class="max-w-full h-auto max-h-64 rounded-lg border border-blue-400 mb-1 object-contain bg-white/10" />
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
              <div class="text-xs text-blue-100 mt-1 text-right">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div v-if="isChatLoading && !currentStreamingMessage" class="flex justify-start w-full">
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

      <!-- 底部输入框 -->
      <div class="p-6 bg-white border-t border-gray-100">
        <div class="max-w-4xl mx-auto relative">
          <div v-if="imagePreviewUrl" class="absolute bottom-20 left-0 bg-white p-3 rounded-xl shadow-lg border border-gray-200 flex items-center gap-3 animate-fade-in-up z-20">
            <div class="relative">
              <img :src="imagePreviewUrl" class="h-16 w-16 object-cover rounded border border-gray-300" />
              <button @click="clearImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
            </div>
            <div class="flex flex-col"><span class="text-xs font-semibold text-gray-700">已选择图片</span><span class="text-[10px] text-gray-500">发送后将自动清除</span></div>
          </div>

          <div class="flex items-end gap-2">
            <div class="relative pb-2">
              <input id="imageInput" ref="imageInput" type="file" accept="image/*" @change="handleImageChange" class="hidden"/>
              <button @click="$refs.imageInput.click()" class="h-12 w-12 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="上传图片" :disabled="isChatLoading"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
            </div>
            <div class="flex-1 relative">
              <input v-model="userInput" @keyup.enter="sendMessage()" type="text" placeholder="请输入问题，或上传图片提问..." class="w-full border border-gray-300 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm transition" :disabled="isChatLoading"/>
              <button @click="sendMessage()" :disabled="isChatLoading || (!userInput.trim() && !selectedImage)" class="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition transform active:scale-95">发送</button>
            </div>
          </div>
          <div class="text-center mt-3"><p class="text-xs text-gray-400">内容由 AI 生成，图片识别依赖视觉模型，请仔细甄别</p></div>
        </div>
      </div>
    </div>

    <!-- 文档详情模态框 -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in-down">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800 flex items-center"><span class="mr-2">📄</span> {{ currentSource?.source }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div class="p-6 overflow-y-auto bg-white">
          <div class="mb-4 flex items-center gap-2 text-xs">
            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">相似度: {{ currentSource?.score }}</span>
            <span class="text-gray-400">片段长度: {{ currentSource?.full_content?.length }} 字符</span>
          </div>
          <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ currentSource?.full_content }}
          </div>
        </div>
        <div class="p-4 border-t border-gray-100 bg-gray-50 text-right">
          <button @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition">关闭</button>
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <div v-if="toast.show" class="fixed top-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-xl transform transition-all duration-300 z-50 flex items-center animate-fade-in-down">
      <span v-if="toast.type === 'success'" class="mr-2 text-green-400">✓</span>
      <span v-else class="mr-2 text-red-400">!</span>
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

// 初始化 Markdown 解析器
const md = shallowRef(new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.value.utils.escapeHtml(str) + '</code></pre>';
  }
}));

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = API_BASE_URL.replace('http', 'ws');

// ================= 状态定义 =================
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
const maxTurns = ref(10);

const quickQuestions = ref([
  "知识库中有多少份文档？",
  "如何预防死锁？",
  "总结最近上传的文档内容",
  "图片中的内容是什么？"
]);

const modalOpen = ref(false);
const currentSource = ref(null);

// 流式消息状态
const currentStreamingMessage = ref(null);
let wsSocket = null;

onMounted(() => {
  fetchDocList();
});

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const renderMarkdown = (text) => {
  if (!text) return '';
  return md.value.render(text);
};

const openSourceModal = (source) => {
  currentSource.value = source;
  modalOpen.value = true;
};
const closeModal = () => {
  modalOpen.value = false;
  currentSource.value = null;
};

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
  buildMsg.value = '';
};
const fetchDocList = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/list_docs`);
    docList.value = Array.isArray(res.data.files) ? res.data.files : [];
  } catch (e) {
    console.error("Failed to fetch doc list", e);
    showToast("获取文档列表失败", "error");
  }
};
const uploadAndBuild = async () => {
  if (selectedFiles.value.length === 0) return;
  isLoading.value = true;
  const formData = new FormData();
  selectedFiles.value.forEach(f => formData.append('files', f));
  try {
    const res = await axios.post(`${API_BASE_URL}/upload_and_build`, formData);
    buildMsg.value = res.data.message;
    buildType.value = 'success';
    showToast('入库成功！');
    selectedFiles.value = [];
    fetchDocList();
  } catch (e) {
    const errMsg = e.response?.data?.detail || '构建失败';
    buildMsg.value = errMsg;
    buildType.value = 'error';
    showToast(errMsg, 'error');
  } finally {
    isLoading.value = false;
  }
};
const deleteDocument = async (filename) => {
  if(!confirm(`确定要删除文档 "${filename}" 吗？`)) return;
  try {
    await axios.post(`${API_BASE_URL}/delete_doc`, { filename });
    showToast(`已删除：${filename}`);
    fetchDocList();
  } catch (e) {
    showToast(e.response?.data?.detail || '删除失败', 'error');
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast("图片过大，请小于 5MB", "error");
    return;
  }
  selectedImage.value = file;
  imagePreviewUrl.value = URL.createObjectURL(file);
};
const clearImage = () => {
  selectedImage.value = null;
  imagePreviewUrl.value = null;
  if (imageInput.value) imageInput.value.value = '';
};
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// ================= 核心修改：发送消息逻辑 (WebSocket) =================
const sendMessage = async (customQuestion = null, event = null) => {
  let q = "";
  if (typeof customQuestion === 'string') {
    q = customQuestion;
  } else if (customQuestion instanceof Event || customQuestion instanceof KeyboardEvent) {
    q = userInput.value.trim();
  } else {
    q = userInput.value.trim();
  }

  if (!q && !selectedImage.value) return;

  const displayContent = selectedImage.value
      ? (q ? `[图片] ${q}` : '[图片] 请分析这张图片')
      : q;

  addMessage('user', displayContent, selectedImage.value ? imagePreviewUrl.value : null);

  if (!customQuestion || typeof customQuestion === 'object') {
    userInput.value = '';
  }

  const currentImage = selectedImage.value;
  clearImage();

  isChatLoading.value = true;

  const now = new Date();
  const aiMsgIndex = messages.value.length;
  const aiMessageObj = {
    role: 'assistant',
    content: '',
    imageUrl: null,
    sources: [],
    follow_up_questions: [],
    time: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`,
    isStreaming: true
  };
  messages.value.push(aiMessageObj);
  currentStreamingMessage.value = aiMessageObj;
  nextTick(scrollToBottom);

  try {
    wsSocket = new WebSocket(`${WS_BASE_URL}/ws/chat`);

    // 【修复点】这里必须加上 async，否则内部不能使用 await
    wsSocket.onopen = async () => {
      const payload = {
        question: q || "请分析这张图片",
        session_id: sessionId.value
      };

      // 现在这里可以合法使用 await 了
      if (currentImage) {
        const base64Img = await fileToBase64(currentImage);
        payload.image_data = base64Img;
      }

      wsSocket.send(JSON.stringify(payload));
    };

    wsSocket.onmessage = (event) => {
      const packet = JSON.parse(event.data);

      if (packet.type === 'token') {
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.content += packet.content;
          nextTick(scrollToBottom);
        }
      } else if (packet.type === 'sources') {
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.sources = packet.data;
        }
      } else if (packet.type === 'follow_up') {
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.follow_up_questions = packet.data;
        }
      } else if (packet.type === 'done') {
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.isStreaming = false;
          currentStreamingMessage.value = null;
        }
        if (packet.session_id) {
          sessionId.value = packet.session_id;
        }
        isChatLoading.value = false;
        wsSocket.close();
      } else if (packet.type === 'error') {
        throw new Error(packet.content);
      }
    };

    wsSocket.onerror = (err) => {
      console.error("WebSocket error:", err);
      throw new Error("WebSocket 连接错误");
    };

    wsSocket.onclose = () => {
      if (isChatLoading.value) {
        isChatLoading.value = false;
        if (currentStreamingMessage.value) {
          currentStreamingMessage.value.content += "\n\n[连接意外断开]";
          currentStreamingMessage.value.isStreaming = false;
          currentStreamingMessage.value = null;
        }
      }
    };

  } catch (e) {
    console.error(e);
    isChatLoading.value = false;
    if (currentStreamingMessage.value) {
      currentStreamingMessage.value.content += `\n\n❌ 错误：${e.message}`;
      currentStreamingMessage.value.isStreaming = false;
      currentStreamingMessage.value = null;
    } else {
      addMessage('assistant', `❌ 错误：${e.message}`);
    }
    if (wsSocket) wsSocket.close();
  }
};

const addMessage = (role, content, imageUrl = null, sources = [], follow_up_questions = []) => {
  const now = new Date();
  messages.value.push({
    role,
    content,
    imageUrl,
    sources,
    follow_up_questions,
    time: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
  });
  nextTick(scrollToBottom);
};

const clearContext = async () => {
  if(!confirm("确定要清空当前对话历史吗？")) return;
  if (!sessionId.value) {
    messages.value = [];
    showToast("当前无历史记录");
    return;
  }
  try {
    await axios.post(`${API_BASE_URL}/clear_context`, null, { params: { session_id: sessionId.value } });
    messages.value = [];
    sessionId.value = null;
    showToast("对话历史已清空");
  } catch (e) {
    showToast("清空失败", "error");
  }
};
const updateMaxTurns = async () => {
  const val = parseInt(prompt("请输入最大保留对话轮数 (1-50):", maxTurns.value));
  if (val && val > 0 && val <= 50) {
    try {
      await axios.post(`${API_BASE_URL}/set_max_turns`, null, { params: { max_turns: val } });
      maxTurns.value = val;
      showToast(`已设置最大保留 ${val} 轮`);
    } catch (e) {
      showToast("设置失败", "error");
    }
  } else if (val) {
    showToast("请输入 1-50 之间的数字", "error");
  }
};
</script>

<style scoped>
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-track { background-color: #f1f5f9; }

.markdown-body :deep(pre) {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}
.markdown-body :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
}
.markdown-body :deep(p) {
  margin-bottom: 0.75rem;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>
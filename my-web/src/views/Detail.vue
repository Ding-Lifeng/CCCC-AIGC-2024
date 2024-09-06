<template>
  <div class="detail-content">
    <button class="close-button" @click="closeDetail">×</button>
    <h2>{{ title }} 详情</h2>
    <p v-if="loading">正在获取详细信息，请稍候...</p>
    <p v-else-if="detail">{{ detail }}</p>
    <p v-else>无法获取详细信息，请稍后重试。</p>
  </div>
</template>

<script>
import { sendMessageToGpt } from '@/api/chatWithGpt';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Detail',
  props: {
    title: String,
    status: String,
    value: String,
  },
  data() {
    return {
      detail: '',
      loading: true,
      sessionId: uuidv4(), // 生成新的 sessionId
    };
  },
  async created() {
    try {
      // 构建分析请求的消息
      const message = `分析 ${this.title},目前状态${this.status},${this.title}值为${this.value}`;
      // 调用 GPT API 进行分析
      const response = await sendMessageToGpt(message, this.sessionId);
      this.detail = response.data.content;
      this.playAdvice(response.data.content);
    } catch (error) {
      console.error('获取详细信息时出错:', error);
      this.detail = '获取详细信息时发生错误。';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    closeDetail() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // 停止所有正在进行的语音合成
      }
      this.$emit('close');
    },
    playAdvice(text) {
      // 检查浏览器是否支持 SpeechSynthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN'; // 设置语言为中文，如果需要其他语言可以修改
        window.speechSynthesis.speak(utterance);
      } else {
        console.error('浏览器不支持 SpeechSynthesis');
      }
    },
  },
}
</script>

<style scoped>
.detail-content {
  padding: 20px;
  font-size: 34px;
  color: #333;
  letter-spacing: 1px; /* 增加字间距 */
  max-height: 80vh; /* 限制最大高度 */
  overflow-y: auto;
  position: relative; /* 确保关闭按钮的绝对定位正确 */
}

.detail-content h2 {
  font-size: 34px;
  margin-bottom: 10px;
}

.detail-content p {
  margin: 10px 0;
  font-size: 34px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 40px;
  cursor: pointer;
  color: #333;
}
</style>


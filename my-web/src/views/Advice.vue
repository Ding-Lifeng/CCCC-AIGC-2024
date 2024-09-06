<template>
  <div class="advice-content">
    <button class="close-button" @click="closeAdvice">×</button>
    <h2>健康生活建议</h2>
    <p v-if="loading">正在获取建议，请稍候...</p>
    <p v-else-if="advice">{{ advice }}</p>
    <p v-else>无法获取建议，请稍后重试。</p>
  </div>
</template>

<script>
import { sendMessageToGpt } from '@/api/chatWithGpt';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Advice',
  data() {
    return {
      advice: '',
      loading: true,
      sessionId: uuidv4(), // 生成新的 sessionId
    };
  },
  async created() {
    try {
      // 从父组件获取病情信息
      const profileCases = this.$parent.profileCases;
      if (profileCases && profileCases.length > 0) {
        // 调用 GPT API 进行分析
        const response = await sendMessageToGpt(`分析病情: ${profileCases.join(', ')}`, this.sessionId);
        this.advice = response.data.content;
        this.playAdvice(response.data.content);
      } else {
        this.advice = '没有足够的病情信息进行分析。';
      }
    } catch (error) {
      console.error('获取健康建议时出错:', error);
      this.advice = '获取建议时发生错误。';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    closeAdvice() {
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
.advice-content {
  padding: 20px;
  font-size: 34px;
  color: #333;
  letter-spacing: 1px; /* 增加字间距 */
  max-height: 80vh; /* 限制最大高度 */
  overflow-y: auto;
  position: relative; /* 确保关闭按钮的绝对定位正确 */
}

.advice-content h2 {
  font-size: 34px;
  margin-bottom: 10px;
}

.advice-content p {
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

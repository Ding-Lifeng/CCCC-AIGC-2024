<template>
  <div id="app">
    <HeaderComponent />
    <main class="main-content">
      <div class="video-chat">
        <img src="@/assets/video-chat.png" alt="Video Chat" class="video-image" />
        <div class="video-overlay">
          <p class="overlay-text" v-if="!isChatting">点击通话按钮与蓝心小v聊天</p>
          <p class="overlay-text" v-if="isChatting">李奶奶您正在与蓝心小v进行聊天</p>
          <p class="status-text" v-show="isChatting">正在通话中......</p>
          <div class="call-buttons">
            <button
                class="call-button"
                :class="isChatting ? 'red' : 'green'"
                @click="toggleChat"
            ></button>
          </div>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from '@/layout/FooterComponent.vue';
import HeaderComponent from '@/layout/HeaderComponent.vue';
import { sendMessageToGpt } from '@/api/chatWithGpt';

export default {
  name: 'Chat',
  components: {
    HeaderComponent,
    FooterComponent
  },
  data() {
    return {
      isChatting: false,
      message: '',
      recognition: null, // 用于语音识别
    };
  },
  methods: {
    toggleChat() {
      if (this.isChatting) {
        this.stopListening();
      } else {
        this.startListening();
        this.isChatting = true;
      }
    },

    // 启动语音识别
    startListening() {
      // 检查浏览器是否支持 WebSpeech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('该浏览器不支持 WebSpeech API。');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'zh-CN'; // 识别中文
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        this.message = event.results[0][0].transcript;
        console.log('识别到的语音内容:', this.message);

        if (this.message.trim() !== '') {
          // this.sendMessage(); // 如果有内容，则发送消息
        } else {
          console.log('本轮无语音输入，不发送消息');
        }
        this.message = '';   // 重置message
      };

      this.recognition.onerror = (event) => {
          console.error('本轮语音识别错误:', event.error);
      };

      this.recognition.onend = () => {
        if (this.isChatting) {
          console.log('本轮语音识别结束，重新开始Listening。');
          this.startListening();  // 语音识别结束时重新开始监听
        }
      };

      this.recognition.start();
    },

    stopListening() {
      if (this.recognition) {
        this.recognition.stop();
      }
      this.isChatting = false;  // 停止聊天
      console.log('语音识别已停止');
    },

    // 发送消息并处理响应
    async sendMessage() {
      if (this.message.trim() === '') return;

      const sessionId = this.getSessionId(); // 根据你的会话管理实现此函数
      try {
        const response = await sendMessageToGpt(this.message, sessionId);
        this.speak(response.data.content); // 用语音输出GPT的响应
      } catch (error) {
        console.error('发送消息时出错:', error);
      }
    },

    // 使用WebSpeech语音合成功能读取文本
    speak(text) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // 使用中文语音合成
      synthesis.speak(utterance);
    },

    // 获取会话ID的占位符函数
    getSessionId() {
      // 实现获取会话ID的逻辑
      return 'session-id-placeholder';
    },
  },
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #ffe9e9;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 160px);
  margin-top: 40px;
  margin-bottom: 40px;
}

.video-chat {
  position: relative;
  width: 1184px;
  height: 666px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.overlay-text {
  margin: 0;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 10px;
}

.status-text {
  margin: 20px 0;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 10px;
}

.call-buttons {
  display: flex;
  margin-top: 20px;
}

.call-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-size: cover;
}

.call-button.green {
  background-image: url('@/assets/call.png');
}

.call-button.red {
  background-image: url('@/assets/hangUp.png');
}
</style>
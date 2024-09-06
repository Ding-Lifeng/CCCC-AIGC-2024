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
import { v4 as uuidv4 } from 'uuid';

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
      sessionId: uuidv4(),
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

    startListening() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('该浏览器不支持 WebSpeech API。');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'zh-CN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        this.message = event.results[0][0].transcript;
        console.log('识别到的语音内容', this.message);

        if (this.message.trim() !== '') {
          this.sendMessage();
        } else {
          console.log('本轮无语音输入，不发送消息');
        }
        this.message = '';
      };

      this.recognition.onerror = (event) => {
        console.error('本轮语音识别错误:', event.error);
      };

      this.recognition.onend = () => {
        if (this.isChatting && !this.isPaused) {
          console.log('本轮语音识别结束，重新开始Listening。');
          this.startListening();
        }
      };

      this.recognition.start();
    },

    stopListening() {
      if (this.recognition) {
        this.recognition.stop();
      }

      // 停止语音合成
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // 停止当前正在播放的语音
        console.log('语音合成已停止');
      }

      this.isChatting = false;
      console.log('语音识别已停止');
    },

    // 暂停语音识别，不完全停止
    pauseListening() {
      if (this.recognition) {
        this.recognition.abort();  // 终止当前识别，但保留识别对象
        this.isPaused = true;      // 标记为暂停状态
        console.log('语音识别已暂停');
      }
    },

    // 恢复语音识别
    resumeListening() {
      if (this.isPaused) {
        this.isPaused = false;
        this.startListening();
        console.log('语音识别已恢复');
      }
    },

    async sendMessage() {
      if (this.message.trim() === '') return;

      const sessionId = this.getSessionId();
      try {
        const response = await sendMessageToGpt(this.message, sessionId);
        console.log(response.data.content);
        this.speak(response.data.content);
      } catch (error) {
        console.error('发送消息时出错:', error);
      }
    },

    speak(text) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';

      // 暂停语音识别
      this.pauseListening();

      utterance.onend = () => {
        console.log('语音合成播放完毕');
        // 延迟1秒后恢复语音识别
        this.resumeListening();
      };

      synthesis.speak(utterance);
    },

    getSessionId() {
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
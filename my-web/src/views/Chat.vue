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
import axios from "axios";

export default {
  name: 'Chat',
  components: {
    HeaderComponent,
    FooterComponent
  },
  data() {
    return {
      isChatting: false,
      mediaRecorder: null,
      audioChunks: [],
    };
  },
  methods: {
    async toggleChat() {
      this.isChatting = !this.isChatting;
      if (this.isChatting) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = this.sendAudioData;

        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing the microphone:', error);
        alert('无法访问麦克风，请检查权限设置。');
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
    async sendAudioData() {
      const audioBlob = new Blob(this.audioChunks, {type: 'audio/wav'});
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');

      const maxRetries = 5; // 最大重试次数
      let retryCount = 0;   // 当前重试次数
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          // 语音识别
          const recognitionResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer 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`  // 替换为您的 OpenAI API 密钥
            },
          });

          const recognizedText = recognitionResponse.data.text;

          // 获取 ChatGPT 回复
          const chatResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: recognizedText,
            max_tokens: 150,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer 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`  // 替换为您的 OpenAI API 密钥
            },
          });

          const chatText = chatResponse.data.choices[0].text.trim();

          // TTS 转换
          const synthesisResponse = await axios.post('https://api.openai.com/v1/tts/completions', {
            text: chatText,
            voice: 'zh-CN',
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer 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`  // 替换为您的 OpenAI API 密钥
            },
          });

          const audioContent = synthesisResponse.data.audioContent;
          const audioBlob = new Blob([audioContent], {type: 'audio/mp3'});
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();

          success = true;  // 请求成功，退出循环
        } catch (error) {
          console.error('Error calling OpenAI API:', error);

          if (error.response && error.response.status === 429) {
            // 如果是 429 错误，等待一段时间再重试
            const retryAfter = error.response.headers['retry-after'] || 1;
            console.log(`429 Too Many Requests, retrying after ${retryAfter} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          } else {
            // 非 429 错误，抛出错误
            throw error;
          }

          retryCount++;
        }
      }

      if (!success) {
        console.error('Failed to call OpenAI API after multiple retries.');
      } else {
        this.audioChunks = [];
      }
    }
  }
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
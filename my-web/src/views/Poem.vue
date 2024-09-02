<template>
  <div class="poem-container">
    <HeaderComponent class="header" />

    <!-- 第一阶段：选择主题 -->
    <div v-if="currentStage === 1" class="stage">
      <h2 class="stage-title">请选择想创作的诗词主题</h2>
      <div class="theme-buttons">
        <button
            v-for="(theme, index) in themesArray"
            :key="index"
            class="theme-button"
            @click="selectTheme(theme)"
        >
          {{ theme }}
        </button>
      </div>
    </div>

    <!-- 第二阶段：填写诗词 -->
    <div v-if="currentStage === 2" class="stage">
      <h2 class="stage-title">请补全诗词创作</h2>
      <div class="poem-grid">
        <div v-for="(line, index) in poemLines" :key="index" class="poem-line">
          <span
              v-for="(char, charIndex) in line"
              :key="charIndex"
              class="poem-char"
          >
            <input
                v-if="char === '*'"
                v-model="userInputArray[index][charIndex]"
                type="text"
                maxlength="1"
                class="poem-input"
            />
            <span v-else>{{ char }}</span>
          </span>
        </div>
      </div>
      <button @click="evaluatePoem" class="evaluate-button">提交</button>
    </div>

    <!-- 第三阶段：创作点评 -->
    <div v-if="currentStage === 3" class="stage">
      <h2 class="stage-title">创作点评</h2>
      <p class="evaluation">{{ evaluation }}</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">内容生成中...</p>
    </div>

    <FooterComponent class="footer" />
  </div>
</template>

<script>
import FooterComponent from '@/layout/FooterComponent.vue';
import HeaderComponent from '@/layout/HeaderComponent.vue';
import { sendMessageToGpt } from '@/api/chatWithGpt.js';
import { v4 as uuidv4 } from 'uuid';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      themes: '',
      poem: null,
      userInputArray: [],
      evaluation: '',
      isLoading: false,
      currentStage: 1, // 当前阶段，1：选择主题，2：填写诗词，3：创作点评
      sessionId: uuidv4(),
    };
  },
  computed: {
    themesArray() {
      return this.themes.split(' ');
    },
    poemLines() {
      if (!this.poem) return [];
      return this.poem.split(/(?<=[。，；！？：、“”‘’《》【】（）—])/);
    },
  },
  watch: {
    poemLines(newLines) {
      this.userInputArray = newLines.map(line =>
          line.split('').map(char => (char === '*' ? '' : null))
      );
    },
  },
  mounted() {
    this.getThemes();
  },
  methods: {
    async getThemes() {
      this.isLoading = true;
      try {
        const response = await sendMessageToGpt('提供一些中文诗的给我选择主题，仅回复主题，主题间以空格隔开', this.sessionId);
        this.themes = response.data.content.trim();
        this.isLoading = false;
      } catch (error) {
        console.error('获取主题失败:', error);
        this.isLoading = false;
      }
    },
    async selectTheme(theme) {
      this.isLoading = true;
      try {
        const response = await sendMessageToGpt(`获取主题为${theme}的诗，并挖空部分词语，挖空部分用符号*代替，仅回复诗词内容`, this.sessionId);
        this.poem = response.data.content;
        this.currentStage = 2;
        this.isLoading = false;
      } catch (error) {
        console.error('获取诗词失败:', error);
        this.isLoading = false;
      }
    },
    async evaluatePoem() {
      this.isLoading = true;
      const userFilledPoem = this.poemLines.map((line, index) =>
          line.split('').map((char, charIndex) =>
              char === '*' ? this.userInputArray[index][charIndex] : char
          ).join('')
      ).join('');

      try {
        const response = await sendMessageToGpt(`评价提交的诗词: ${userFilledPoem}，并给出你的修改意见和原诗`, this.sessionId);
        this.evaluation = response.data.content;
        this.currentStage = 3;
        this.isLoading = false;
      } catch (error) {
        console.error('评价诗词失败:', error);
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.poem-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #faf8ef;
  padding: 20px;

}

.header,
.footer {
  width: 100%;
}

.stage {
  text-align: center;
  width: 100%;
}

.stage-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.theme-button {
  margin: 5px;
  padding: 8px 15px;
  font-size: 14px;
  background-color: #f78f54;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}

.theme-button:hover {
  background-color: #d97242;
}

.poem-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.poem-line {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.poem-char {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #000;
  margin: 0 2px;
  font-size: 28px;
}

.poem-input {
  width: 30px;
  height: 30px;
  text-align: center;
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  font-size: 28px;
  padding: 0;
  margin: 0 2px;
  outline: none;
}

.evaluate-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #f78f54;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 40px;
}

.evaluate-button:hover {
  background-color: #d97242;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #f78f54;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
}

.evaluation {
  max-width: 900px; /* 控制最大宽度，适合你的布局 */
  word-wrap: break-word; /* 自动换行 */
  font-size: 24px;
  text-align: left; /* 左对齐 */
  margin: 0 auto 40px;
}
</style>

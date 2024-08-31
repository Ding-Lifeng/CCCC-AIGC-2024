<template>
  <div id="app">
    <HeaderComponent />
    <main class="main-content">
      <div class="profile-card">
        <img src="@/assets/用户头像.png" alt="Profile" class="profile-image" />
        <div class="profile-info">
          <h2 class="profile-name">李奶奶</h2>
          <p class="profile-age">73岁</p>
          <div class="profile-cases">
            <p v-for="(caseItem, index) in profileCases" :key="index">{{ caseItem }}</p>
          </div>
        </div>
        <button class="advice-button" @click="showAdvice">健康生活建议</button>
      </div>

      <!-- 显示遮罩层 -->
      <div v-if="isAdviceVisible" class="overlay"></div>
      <!-- 弹出 Advice.vue 组件 -->
      <div v-if="isAdviceVisible" class="advice-container">
        <Advice @close="hideAdvice" />
      </div>

      <!-- 显示 Detail 组件 -->
      <div v-if="isDetailVisible" class="overlay"></div>
      <div v-if="isDetailVisible" class="detail-container">
        <Detail @close="hideDetail" :title="detailData.title" :status="detailData.status" :value="detailData.value" />
      </div>

      <div class="temperature-card">
        <h3 class="title">体温</h3>
        <span class="status normal">正常</span>
        <p class="temperature" @mouseover="enlargeIcon('temperature')" @mouseleave="resetIcon('temperature')">36.5°</p>
      </div>
      <div class="health-cards">
        <div class="health-card blood-pressure-card" @click="showDetail({ title: '血压', status: '偏高', value: '130/80' })">
          <h3 class="title">血压</h3>
          <span class="status high">偏高</span>
          <p class="pressure" @mouseover="enlargeIcon('pressure')" @mouseleave="resetIcon('pressure')"><span class="high-systolic">130</span>/80</p>
          <div class="detail">查看详细数据 ></div>
        </div>
        <div class="health-card heart-rate-card" @click="showDetail({ title: '心率', status: '正常', value: '92' })">
          <h3 class="title">心率</h3>
          <span class="status normal">正常</span>
          <p class="rate" @mouseover="enlargeIcon('rate')" @mouseleave="resetIcon('rate')">92</p>
          <div class="detail">查看详细数据 ></div>
        </div>
        <div class="health-card pulse-card" @click="showDetail({ title: '脉搏', status: '正常', value: '85' })">
          <h3 class="title">脉搏</h3>
          <span class="status normal">正常</span>
          <p class="pulse" @mouseover="enlargeIcon('pulse')" @mouseleave="resetIcon('pulse')">85</p>
          <div class="detail">查看详细数据 ></div>
        </div>
        <div class="health-card sleep-quality-card" @click="showDetail({ title: '睡眠质量', status: '优', value: '浅睡5H，深度睡眠2.5H' })">
          <h3 class="title">睡眠质量</h3>
          <span class="status good">优</span>
          <p class="shallow-quality" @mouseover="enlargeIcon('shallow-quality')" @mouseleave="resetIcon('shallow-quality')">浅睡5H</p>
          <p class="deep-quality" @mouseover="enlargeIcon('deep-quality')" @mouseleave="resetIcon('deep-quality')">深睡2.5H</p>
          <div class="detail">查看详细数据 ></div>
        </div>
        <div class="health-card blood-sugar-card" @click="showDetail({ title: '血糖', status: '正常', value: '5.8MMOL/L' })">
          <h3 class="title">血糖</h3>
          <span class="status normal">正常</span>
          <p class="sugar" @mouseover="enlargeIcon('sugar')" @mouseleave="resetIcon('sugar')">5.8MMOL/L</p>
          <div class="detail">查看详细数据 ></div>
        </div>
        <div class="health-card medication-card" @click="showDetail({ title: '药品名称', status: '盐酸二甲双胍（降血糖）', value: '如何服用，有何忌口，注意事项' })">
          <h3 class="title">用药清单</h3>
          <p class="medicine" @mouseover="enlargeIcon('medicine')" @mouseleave="resetIcon('medicine')">盐酸二甲双胍（降血糖）</p>
          <p class="detail">饭后服用一日两次，每次0.5g</p>
          <div class="list">清单 ></div>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from '@/layout/FooterComponent.vue';
import HeaderComponent from '@/layout/HeaderComponent.vue';
import Advice from './Advice.vue';
import Detail from './Detail.vue';
export default {
  name: 'HealthInfo',
  components: {
    HeaderComponent,
    FooterComponent,
    Advice,
    Detail
  },
  data(){
    return{
      isAdviceVisible: false,
      profileCases: ['轻度高血压', '二型糖尿病', '暂无过敏史'],
      isDetailVisible: false,
      detailData: {},
    };
  },
  methods:{
    showAdvice() {
      this.isAdviceVisible = true;
    },
    hideAdvice() {
      this.isAdviceVisible = false;
    },
    showDetail(data) {
      this.detailData = data;
      this.isDetailVisible = true;
    },
    hideDetail() {
      this.isDetailVisible = false;
    },
    enlargeIcon(iconClass) {
      const element = document.querySelector(`.${iconClass}`);
      if (element) {
        element.style.transform = 'scale(1.3)';
      }
    },
    resetIcon(iconClass) {
      const element = document.querySelector(`.${iconClass}`);
      if (element) {
        element.style.transform = 'scale(1)';
      }
    },
  },
  created() {
    // 处理初始的查询参数
    if (this.$route.query.title) {
      this.showDetail({
        title: this.$route.query.title,
        status: this.$route.query.status,
        value: this.$route.query.value
      });
    }
  },
  watch: {
    '$route'(to) {
      // 监听路由变化时的查询参数
      if (to.query.title) {
        this.showDetail({
          title: to.query.title,
          status: to.query.status,
          value: to.query.value
        });
      }
    }
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #ffe9e9;
  font-family: Arial, sans-serif;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.profile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 900px;
  height: 150px;
  padding: 20px;
  background-color: #fff;
  border-radius: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
  left: -250px;
  top: 50px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.profile-info {
  flex: 1;
  margin-left: 20px;
}

.profile-name {
  font-size: 28px;
  font-weight: bold;
  position: relative;
  left: 40px;
  top: 70px;
}

.profile-age {
  font-size: 24px;
  font-weight: bold;
  position: relative;
  left: 40px;
  top: 70px;
}

.profile-cases {
  font-size: 22px;
  position: relative;
  font-weight: bold;
  left: 220px;
  top: -60px;
}

.advice-button {
  padding: 10px 20px;
  background-color: #f78f54;
  color: #fff;
  border: none;
  border-radius: 20px;
  width: 300px;
  height: 70px;
  cursor: pointer;
  position: relative;
  left: -60px;
  font-size: 30px;
}

.advice-button:hover {
  background-color: #d97242;
}

.temperature-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
  height: 150px;
  margin-bottom: 20px;
  position: relative;
  left: 500px;
  top: -160px;
}

.temperature-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.temperature-card .status{
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: 60px;
  top: -70px;
}

.temperature-card .temperature{
  font-size: 42px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -90px;
}

.health-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 70px 60px;
  height: 500px;
  position: relative;
  left: -10px;
  top: -120px;
}

.health-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
  height: 200px;
  position: relative;
  background-size: 110%;
  background-position: center;
  background-image: url('@/assets/common_back.png');
}

.blood-pressure-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.blood-pressure-card {
  background-image: url('@/assets/blood_pressure.png');
}

.blood-pressure-card .status{
  font-size: 30px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: -70px;
}

.blood-pressure-card .pressure{
  font-size: 42px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -90px;
}

.blood-pressure-card .detail{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -95px;
}

.heart-rate-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.heart-rate-card .status{
  font-size: 30px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: -70px;
}

.heart-rate-card .rate{
  font-size: 42px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -90px;
}

.heart-rate-card .detail{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -95px;
}

.pulse-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.pulse-card .status{
  font-size: 30px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: -70px;
}

.pulse-card .pulse{
  font-size: 42px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -90px;
}

.pulse-card .detail{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -95px;
}

.sleep-quality-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.sleep-quality-card .status{
  font-size: 30px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: -70px;
}

.sleep-quality-card .shallow-quality{
  font-size: 28px;
  font-weight: bold;
  color: #333;
  position: relative;
  top: -90px;
}

.sleep-quality-card .deep-quality{
  font-size: 28px;
  font-weight: bold;
  color: #333;
  position: relative;
  top: -120px;
}

.sleep-quality-card .detail{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -120px;
}

.blood-sugar-card .title {
  font-size: 30px;
  color: #333;
  font-weight: bold;
  position: relative;
  left: -80px;
}

.blood-sugar-card .status{
  font-size: 30px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: -70px;
}

.blood-sugar-card .sugar{
  font-size: 42px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -90px;
}

.blood-sugar-card .detail{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -95px;
}

.medication-card {
  background-image: url('@/assets/medicine.png');
}

.medication-card .title {
  font-size: 36px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -40px;
}

.medication-card .medicine{
  font-size: 30px;
  position: relative;
  top: -40px;
  left: 20px;
}

.medication-card .detail{
  font-size: 24px;
  color: #333;
  position: relative;
  left: 10px;
  top: -70px;
}

.medication-card .list{
  font-size: 20px;
  font-weight: bold;
  position: relative;
  top: -70px;
}

.status {
  font-size: 14px;
  margin-left: 5px;
}

.status.normal {
  color: #d97242;
}

.status.high {
  color: #ff6b6b;
}

.status.good {
  color: #00b509;
}

.high-systolic {
  color: #f35310;
  font-weight: bold;
}

a {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
  color: #00adb5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑色遮罩 */
  z-index: 999; /* 确保遮罩层在其他内容之上 */
}

.advice-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.detail-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

</style>
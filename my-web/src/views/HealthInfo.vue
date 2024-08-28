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
            <p>轻度高血压</p>
            <p>二型糖尿病</p>
            <p>暂无过敏史</p>
          </div>
        </div>
        <button class="advice-button">健康生活建议</button>
      </div>
      <div class="temperature-card">
        <h3 class="title">体温</h3>
        <span class="status normal">正常</span>
        <p class="temperature">36.5°</p>
      </div>
      <div class="health-cards">
        <div class="health-card blood-pressure-card">
          <h3 class="title">血压</h3>
          <span class="status high">偏高</span>
          <p class="pressure"><span class="high-systolic">130</span>/80</p>
          <a href="#" class="detail">查看详细数据 ></a>
        </div>
        <div class="health-card heart-rate-card">
          <h3 class="title">心率</h3>
          <span class="status normal">正常</span>
          <p class="rate">92</p>
          <a href="#" class="detail">查看详细数据 ></a>
        </div>
        <div class="health-card pulse-card">
          <h3 class="title">脉搏</h3>
          <span class="status normal">正常</span>
          <p class="pulse">85</p>
          <a href="#" class="detail">查看详细数据 ></a>
        </div>
        <div class="health-card sleep-quality-card">
          <h3 class="title">睡眠质量</h3>
          <span class="status good">优</span>
          <p class="shallow-quality">浅睡5H</p>
          <p class="deep-quality">深睡2.5H</p>
          <a href="#" class="detail">查看详细数据 ></a>
        </div>
        <div class="health-card blood-sugar-card">
          <h3 class="title">血糖</h3>
          <span class="status normal">正常</span>
          <p class="sugar">5.8MMOL/L</p>
          <a href="#" class="detail">查看详细数据 ></a>
        </div>
        <div class="health-card medication-card">
          <h3 class="title">用药清单</h3>
          <p class="medicine">盐酸二甲双胍（降血糖）</p>
          <p class="detail">饭后服用一日两次，每次0.5g</p>
          <a href="#" class="list">清单 ></a>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from '@/layout/FooterComponent.vue';
import HeaderComponent from '@/layout/HeaderComponent.vue';
export default {
  name: 'HealthInfo',
  components: {
    HeaderComponent,
    FooterComponent
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
  font-size: 20px;
  position: relative;
  left: 250px;
  top: -60px;
}

.advice-button {
  padding: 10px 20px;
  background-color: #d97242;
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
}

.medication-card .detail{
  font-size: 24px;
  color: #333;
  position: relative;
  left: -10px;
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

.normal-diastolic {
  color: #78c232;
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
</style>
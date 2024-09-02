<template>
  <header>
    <nav>
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo">
      </div>
      <ul>
        <li><a href="#">首页</a></li>
        <li><a href="#" @click="$router.push('/Game')">大脑游戏</a></li>
        <li><a href="#" @click="$router.push('/HealthInfo')">健康提醒</a></li>
        <li><a href="#">运动引导</a></li>
        <li><a href="#" @click="$router.push('/')">情景聊天</a></li>
        <li><a href="#" @click="$router.push('/Poem')">科学验证</a></li>
        <li><a href="#">联系我们</a></li>
      </ul>
      <button @click="login">登录</button>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    login() {
      // Handle login logic
    }
  }
}
</script>

<style scoped>
header {
  background-color: #f8ebe7;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
.logo img {
  height: 70px;
}
ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  padding: 0;
  margin: 0;
}
li {
  display: inline;
}
a {
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
}
a:hover {
  color: #f78f54;
}
button {
  background-color: #f78f54;
  border: none;
  padding: 0.5rem 1.5rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
}
button:hover {
  background-color: #d97242;
}
@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }
  ul {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
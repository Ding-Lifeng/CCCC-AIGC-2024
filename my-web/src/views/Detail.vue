<template>
  <div>
    <h1>详细数据页面</h1>
    <p>接收到的标题参数: {{ title }}</p>
    <!-- 你可以在这里显示更多基于 title 参数的数据 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: ''
    };
  },
  created() {
    // 在组件创建时获取通过路由传递的 title 参数
    this.title = this.$route.query.title || '默认标题';
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
}
</style>

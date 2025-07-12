<template>
  <div class="header-title">
    <h1>城市内涝风险预警系统</h1>
  </div>
</template>

<script setup>
// 顶部标题组件
</script>

<style scoped>
.header-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 15px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-title h1 {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}
</style>
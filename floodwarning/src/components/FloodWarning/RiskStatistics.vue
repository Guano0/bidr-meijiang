<template>
  <div class="risk-statistics">
    <!-- 水位站风险等级统计 -->
    <div class="risk-levels">
      <div 
        v-for="level in riskLevels" 
        :key="level.type"
        class="risk-level-item"
        :style="{ backgroundColor: level.color }"
      >
        <div class="level-icon">
          <div class="icon-circle" :style="{ backgroundColor: level.iconColor }"></div>
        </div>
        <div class="level-info">
          <div class="level-label">{{ level.label }}</div>
          <div class="level-details">
            <span class="level-count">水位站数量：{{ level.count }}</span>
            <span class="level-water">易涝区水位：{{ level.waterLevel }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FloodWarningAPI } from '../../api/floodWarningApi'

// 风险等级数据
const riskLevels = ref([
  {
    type: 'normal',
    label: '正常险',
    color: 'rgba(52, 144, 220, 0.8)',
    iconColor: '#3490dc',
    count: 0,
    waterLevel: '0m'
  },
  {
    type: 'low',
    label: '低风险',
    color: 'rgba(255, 193, 7, 0.8)',
    iconColor: '#ffc107',
    count: 0,
    waterLevel: '0m'
  },
  {
    type: 'high',
    label: '高风险',
    color: 'rgba(220, 53, 69, 0.8)',
    iconColor: '#dc3545',
    count: 0,
    waterLevel: '0m'
  }
])

const loading = ref(false)

// 加载风险统计数据
const loadRiskStatistics = async () => {
  try {
    loading.value = true
    const data = await FloodWarningAPI.getRiskStatistics()
    riskLevels.value = data
  } catch (error) {
    console.error('加载风险统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 模拟数据更新
let updateTimer: NodeJS.Timeout | null = null

onMounted(() => {
  // 初始加载数据
  loadRiskStatistics()
  
  // 每30秒更新一次数据
  updateTimer = setInterval(loadRiskStatistics, 30000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped>
.risk-statistics {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.risk-levels {
  display: flex;
  gap: 20px;
  align-items: center;
}

.risk-level-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  transition: all 0.3s ease;
}

.risk-level-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.level-icon {
  margin-right: 12px;
}

.icon-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.level-info {
  flex: 1;
}

.level-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.level-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-count,
.level-water {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
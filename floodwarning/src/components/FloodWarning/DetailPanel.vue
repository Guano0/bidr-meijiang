<template>
  <div v-if="visible" class="detail-panel">
    <div class="panel-header">
      <h3>{{ detailData?.name || '数据详情' }}</h3>
      <div class="close-btn" @click="closePanel">×</div>
    </div>
    
    <div class="panel-content">
      <!-- 河流详情 -->
      <div v-if="detailData?.type === 'river'" class="detail-section">
        <div class="detail-item">
          <label>河流名称：</label>
          <span>{{ detailData.name }}</span>
        </div>
        <div class="detail-item">
          <label>河流长度：</label>
          <span>{{ detailData.length }} km</span>
        </div>
        <div class="detail-item">
          <label>河流比降：</label>
          <span>{{ detailData.slope }}</span>
        </div>
        <div class="detail-item">
          <label>流域面积：</label>
          <span>{{ detailData.area || '156.8' }} km²</span>
        </div>
        <div class="detail-item">
          <label>河流等级：</label>
          <span>{{ detailData.level || '二级河流' }}</span>
        </div>
        <div class="detail-item">
          <label>所属流域：</label>
          <span>{{ detailData.basin || '韩江流域' }}</span>
        </div>
        <div class="detail-item">
          <label>起点坐标：</label>
          <span>{{ detailData.startCoord || '116.123, 24.456' }}</span>
        </div>
        <div class="detail-item">
          <label>终点坐标：</label>
          <span>{{ detailData.endCoord || '116.789, 24.123' }}</span>
        </div>
        <div class="detail-item">
          <label>管理单位：</label>
          <span>{{ detailData.management || '梅州市水务局' }}</span>
        </div>
        <div class="detail-item">
          <label>更新时间：</label>
          <span>{{ detailData.updateTime || '2024-01-15 14:30:25' }}</span>
        </div>
      </div>

      <!-- 水位站详情 -->
      <div v-if="detailData?.type === 'station'" class="detail-section">
        <div class="detail-item">
          <label>站点名称：</label>
          <span>{{ detailData.name }}</span>
        </div>
        <div class="detail-item">
          <label>当前水位：</label>
          <span class="water-level" :class="getRiskClass(detailData.riskLevel)">
            {{ detailData.waterLevel || '2.35' }} m
          </span>
        </div>
        <div class="detail-item">
          <label>风险等级：</label>
          <span class="risk-badge" :class="getRiskClass(detailData.riskLevel)">
            {{ getRiskLabel(detailData.riskLevel) }}
          </span>
        </div>
        <div class="detail-item">
          <label>警戒水位：</label>
          <span>{{ detailData.warningLevel || '3.50' }} m</span>
        </div>
        <div class="detail-item">
          <label>保证水位：</label>
          <span>{{ detailData.guaranteeLevel || '4.20' }} m</span>
        </div>
        <div class="detail-item">
          <label>站点坐标：</label>
          <span>{{ detailData.coordinates || '116.456, 24.789' }}</span>
        </div>
        <div class="detail-item">
          <label>所属河流：</label>
          <span>{{ detailData.river || '梅江' }}</span>
        </div>
        <div class="detail-item">
          <label>建站时间：</label>
          <span>{{ detailData.buildTime || '1985-06-15' }}</span>
        </div>
        <div class="detail-item">
          <label>监测频率：</label>
          <span>{{ detailData.frequency || '每小时' }}</span>
        </div>
        <div class="detail-item">
          <label>最后更新：</label>
          <span>{{ detailData.lastUpdate || '2024-01-15 15:00:00' }}</span>
        </div>
      </div>

      <!-- 易涝区详情 -->
      <div v-if="detailData?.type === 'flood'" class="detail-section">
        <div class="detail-item">
          <label>区域名称：</label>
          <span>{{ detailData.name }}</span>
        </div>
        <div class="detail-item">
          <label>风险等级：</label>
          <span class="risk-badge" :class="getRiskClass(detailData.riskLevel)">
            {{ getRiskLabel(detailData.riskLevel) }}
          </span>
        </div>
        <div class="detail-item">
          <label>区域面积：</label>
          <span>{{ detailData.area || '2.5' }} km²</span>
        </div>
        <div class="detail-item">
          <label>人口密度：</label>
          <span>{{ detailData.population || '1200' }} 人/km²</span>
        </div>
        <div class="detail-item">
          <label>历史积水深度：</label>
          <span>{{ detailData.maxDepth || '0.8' }} m</span>
        </div>
        <div class="detail-item">
          <label>排水能力：</label>
          <span>{{ detailData.drainage || '50' }} mm/h</span>
        </div>
        <div class="detail-item">
          <label>主要影响因素：</label>
          <span>{{ detailData.factors || '地势低洼、排水不畅' }}</span>
        </div>
        <div class="detail-item">
          <label>防护措施：</label>
          <span>{{ detailData.protection || '排水泵站、雨水管网' }}</span>
        </div>
      </div>

      <!-- 实时监测数据图表区域 -->
      <div v-if="detailData?.type === 'station'" class="chart-section">
        <h4>24小时水位变化</h4>
        <div class="chart-placeholder">
          <div class="chart-info">水位监测图表</div>
          <div class="chart-desc">显示过去24小时的水位变化趋势</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  detailData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

// 关闭面板
const closePanel = () => {
  emit('close')
}

// 获取风险等级样式类
const getRiskClass = (level) => {
  switch (level) {
    case 1:
      return 'risk-normal'
    case 2:
      return 'risk-low'
    case 3:
      return 'risk-high'
    default:
      return 'risk-normal'
  }
}

// 获取风险等级标签
const getRiskLabel = (level) => {
  switch (level) {
    case 1:
      return '正常'
    case 2:
      return '低风险'
    case 3:
      return '高风险'
    default:
      return '正常'
  }
}
</script>

<style scoped>
.detail-panel {
  position: absolute;
  right: 20px;
  top: 80px;
  width: 320px;
  max-height: calc(100vh - 200px);
  background: rgba(15, 35, 65, 0.95);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.panel-header h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  color: #cccccc;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  color: #cccccc;
  font-size: 13px;
  font-weight: 500;
  min-width: 80px;
}

.detail-item span {
  color: #ffffff;
  font-size: 13px;
  text-align: right;
  flex: 1;
}

.water-level {
  font-weight: 600;
  font-size: 14px !important;
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px !important;
  font-weight: 600;
  text-align: center !important;
}

.risk-normal {
  background: rgba(52, 144, 220, 0.3);
  color: #3490dc;
  border: 1px solid #3490dc;
}

.risk-low {
  background: rgba(255, 193, 7, 0.3);
  color: #ffc107;
  border: 1px solid #ffc107;
}

.risk-high {
  background: rgba(220, 53, 69, 0.3);
  color: #dc3545;
  border: 1px solid #dc3545;
}

.chart-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-section h4 {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.chart-placeholder {
  height: 150px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.chart-info {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.chart-desc {
  color: #cccccc;
  font-size: 12px;
  text-align: center;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 4px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
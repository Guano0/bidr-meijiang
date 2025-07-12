<template>
  <div class="element-panel">
    <!-- 要素台账标题 -->
    <div class="panel-header">
      <h3>要素台账</h3>
    </div>
    
    <!-- 要素统计 -->
    <div class="element-stats">
      <div 
        v-for="item in elementStats" 
        :key="item.type"
        class="stat-item"
        :class="{ active: activeElement === item.type }"
        @click="selectElement(item.type)"
      >
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-value">{{ item.count }}</div>
        <div class="stat-unit">个</div>
      </div>
    </div>

    <!-- 要素搜索 -->
    <div class="search-section">
      <div class="section-title">{{ getSearchTitle() }}</div>
      <div class="search-input">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入名称"
          size="small"
          clearable
          @input="handleSearch"
        >
          <template #suffix>
            <el-button 
              type="primary" 
              size="small" 
              @click="handleSearch"
            >
              查询
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 要素列表 -->
    <div class="element-list">
      <div class="list-header">
        <span 
          v-for="header in getListHeaders()" 
          :key="header"
          class="header-item"
        >
          {{ header }}
        </span>
      </div>
      
      <div class="list-content" v-loading="loading">
        <div 
          v-for="item in currentElementList" 
          :key="item.id"
          class="list-item"
          @click="selectItem(item)"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-details">
            <span 
              v-for="(detail, index) in getItemDetails(item)" 
              :key="index"
              class="detail-item"
            >
              {{ detail }}
            </span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          layout="prev, pager, next"
          size="small"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElInput, ElButton, ElPagination } from 'element-plus'
import { FloodWarningAPI, type ElementStats } from '../../api/floodWarningApi'

const emit = defineEmits(['element-selected', 'item-selected'])

// 要素统计数据
const elementStats = ref<ElementStats[]>([])

// 当前选中的要素类型
const activeElement = ref('river')

// 搜索关键词
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// 当前要素数据列表
const currentElementList = ref<any[]>([])
const loading = ref(false)

// 获取要素统计数据
const loadElementStats = async () => {
  try {
    elementStats.value = await FloodWarningAPI.getElementStats()
  } catch (error) {
    console.error('获取要素统计数据失败:', error)
  }
}

// 获取当前要素类型的数据列表
const loadElementList = async () => {
  loading.value = true
  try {
    const result = await FloodWarningAPI.getElementList(
      activeElement.value,
      currentPage.value,
      pageSize.value,
      searchKeyword.value
    )
    currentElementList.value = result.data
    totalItems.value = result.total
  } catch (error) {
    console.error('获取要素列表数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取列表表头
const getListHeaders = () => {
  switch (activeElement.value) {
    case 'river':
      return ['比降', '长度', '详情']
    case 'pump':
      return ['容量', '功率', '状态']
    case 'reservoir':
      return ['库容', '水位', '状态']
    case 'gate':
      return ['类型', '状态', '开度']
    case 'flood':
      return ['面积', '风险', '详情']
    default:
      return ['比降', '长度', '详情']
  }
}

// 获取列表项显示内容
const getItemDetails = (item: any) => {
  switch (activeElement.value) {
    case 'river':
      return [item.slope, item.length, '详情']
    case 'pump':
      return [item.capacity + 'm³/s', item.power + 'kW', item.status]
    case 'reservoir':
      return [item.capacity + '万m³', item.currentLevel, item.status]
    case 'gate':
      return [item.type, item.status, item.openLevel]
    case 'flood':
      return [item.area || '2.5km²', getRiskLabel(item.riskLevel), '详情']
    default:
      return [item.slope, item.length, '详情']
  }
}

// 获取风险等级标签
const getRiskLabel = (level: number) => {
  switch (level) {
    case 1: return '正常'
    case 2: return '低风险'
    case 3: return '高风险'
    default: return '正常'
  }
}

// 获取搜索框标题
const getSearchTitle = () => {
  const labels: { [key: string]: string } = {
    river: '河流',
    pump: '泵站',
    reservoir: '水库',
    gate: '水闸',
    flood: '易涝区'
  }
  return labels[activeElement.value] || '河流'
}

// 选择要素类型
const selectElement = async (type: string) => {
  activeElement.value = type
  currentPage.value = 1
  searchKeyword.value = ''
  emit('element-selected', type)
  await loadElementList()
}

// 搜索处理
const handleSearch = async () => {
  currentPage.value = 1
  await loadElementList()
}

// 分页处理
const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadElementList()
}

// 选择列表项
const selectItem = (item: any) => {
  // 根据要素类型发射不同的事件
  switch (activeElement.value) {
    case 'river':
      emit('river-selected', item)
      break
    case 'pump':
    case 'reservoir':
    case 'gate':
    case 'flood':
      emit('element-selected', {
        ...item,
        type: activeElement.value
      })
      break
    default:
      emit('element-selected', {
        ...item,
        type: activeElement.value
      })
  }
}

// 监听搜索关键词变化
watch(searchKeyword, () => {
  if (searchKeyword.value === '') {
    handleSearch()
  }
})

onMounted(async () => {
  await loadElementStats()
  await selectElement('river')
})
</script>

<style scoped>
.element-panel {
  position: absolute;
  left: 20px;
  top: 80px;
  width: 380px;
  height: calc(100vh - 200px);
  background: linear-gradient(135deg, rgba(0, 20, 60, 0.95), rgba(0, 40, 100, 0.9));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.element-stats {
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-item {
  flex: 1;
  min-width: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-item.active {
  background: rgba(64, 158, 255, 0.3);
  border-color: #409eff;
}

.stat-label {
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 4px;
}

.stat-value {
  color: #409eff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.stat-unit {
  color: #cccccc;
  font-size: 10px;
}

.search-section {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.search-input {
  display: flex;
  gap: 8px;
}

.element-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  display: flex;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-item {
  flex: 1;
  color: #cccccc;
  font-size: 12px;
  text-align: center;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.list-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.05);
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.item-name {
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
}

.item-details {
  display: flex;
  gap: 8px;
}

.detail-item {
  flex: 1;
  color: #cccccc;
  font-size: 13px;
  text-align: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  line-height: 1.3;
}

.pagination {
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 滚动条样式 */
.list-content::-webkit-scrollbar {
  width: 4px;
}

.list-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.list-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.list-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
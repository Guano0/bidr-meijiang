<template>
  <div class="map-toolbar">
    <!-- 工具按钮 -->
    <div class="toolbar-buttons">
      <div 
        class="tool-button"
        :class="{ active: showLayerPanel }"
        @click="toggleLayerPanel"
        title="图层管理"
      >
        <div class="button-icon">≡</div>
      </div>
      <div 
        class="tool-button"
        @click="zoomIn"
        title="放大"
      >
        <div class="button-icon">+</div>
      </div>
      <div 
        class="tool-button"
        @click="zoomOut"
        title="缩小"
      >
        <div class="button-icon">−</div>
      </div>
      <div 
        class="tool-button"
        @click="resetView"
        title="复位"
      >
        <div class="button-icon">⌂</div>
      </div>
    </div>

    <!-- 图层管理面板 -->
    <div v-if="showLayerPanel" class="layer-panel">
      <div class="panel-header">
        <h4>图层管理</h4>
        <div class="close-btn" @click="showLayerPanel = false">×</div>
      </div>
      
      <div class="layer-tree">
        <div 
          v-for="category in layerCategories" 
          :key="category.name"
          class="layer-category"
        >
          <div 
            class="category-header"
            @click="toggleCategory(category.name)"
          >
            <span class="expand-icon" :class="{ expanded: category.expanded }">▶</span>
            <span class="category-name">{{ category.label }}</span>
          </div>
          
          <div v-if="category.expanded" class="category-layers">
            <div 
              v-for="layer in category.layers"
              :key="layer.name"
              class="layer-item"
            >
              <label class="layer-checkbox">
                <input 
                  type="checkbox" 
                  v-model="layer.visible"
                  @change="toggleLayer(layer)"
                >
                <span class="checkmark"></span>
                <span class="layer-name">{{ layer.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['zoom-in', 'zoom-out', 'reset-view', 'layer-toggle'])

// 显示图层面板
const showLayerPanel = ref(false)

// 图层分类数据
const layerCategories = ref([
  {
    name: 'base',
    label: '基础图层',
    expanded: true,
    layers: [
      { name: 'dem', label: 'DEM地形', visible: true, type: 'terrain' },
      { name: 'dom', label: 'DOM影像', visible: true, type: 'imagery' }
    ]
  },
  {
    name: 'water',
    label: '水利设施',
    expanded: true,
    layers: [
      { name: 'bengzhan', label: '泵站', visible: false, type: 'wms' },
      { name: 'shuiku', label: '水库', visible: false, type: 'wms' },
      { name: 'shuizha', label: '水闸', visible: false, type: 'wms' }
    ]
  },
  {
    name: 'river',
    label: '河流水系',
    expanded: true,
    layers: [
      { name: 'heliu', label: '河流', visible: true, type: 'wms' }
    ]
  },
  {
    name: 'infrastructure',
    label: '基础设施',
    expanded: false,
    layers: [
      { name: 'daolu', label: '道路', visible: false, type: 'wms' },
      { name: 'xingzheng', label: '行政区划', visible: false, type: 'wms' }
    ]
  },
  {
    name: 'risk',
    label: '风险区域',
    expanded: true,
    layers: [
      { name: 'yilaoqu', label: '易涝区', visible: false, type: 'wms' }
    ]
  },
  {
    name: 'monitoring',
    label: '监测站点',
    expanded: true,
    layers: [
      { name: 'shuiweizan', label: '水位站', visible: true, type: 'wms' },
      { name: 'yuliangzhan', label: '雨量站', visible: true, type: 'wms' },
      { name: 'liuliangzhan', label: '流量站', visible: true, type: 'wms' }
    ]
  }
])

// 切换图层面板显示
const toggleLayerPanel = () => {
  showLayerPanel.value = !showLayerPanel.value
}

// 切换分类展开状态
const toggleCategory = (categoryName) => {
  const category = layerCategories.value.find(cat => cat.name === categoryName)
  if (category) {
    category.expanded = !category.expanded
  }
}

// 切换图层显示
const toggleLayer = (layer) => {
  emit('layer-toggle', layer)
}

// 地图控制
const zoomIn = () => {
  emit('zoom-in')
}

const zoomOut = () => {
  emit('zoom-out')
}

const resetView = () => {
  emit('reset-view')
}

// 点击外部关闭面板
const handleClickOutside = (event) => {
  if (!event.target.closest('.map-toolbar')) {
    showLayerPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
const onUnmounted = () => {
  document.removeEventListener('click', handleClickOutside)
}
</script>

<style scoped>
.map-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 35, 65, 0.95);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1001;
  padding: 15px;
  min-width: 200px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.toolbar-buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-button {
  width: 40px;
  height: 40px;
  background: rgba(15, 35, 65, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tool-button:hover {
  background: rgba(64, 158, 255, 0.3);
  transform: translateX(2px);
}

.tool-button.active {
  background: rgba(64, 158, 255, 0.5);
  border-color: #409eff;
}

.button-icon {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.layer-panel {
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 10px;
  width: 280px;
  max-height: 500px;
  background: rgba(15, 35, 65, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.panel-header h4 {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  color: #cccccc;
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.layer-tree {
  max-height: 320px;
  overflow-y: auto;
  padding: 10px 0;
}

.layer-category {
  margin-bottom: 5px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.expand-icon {
  color: #cccccc;
  font-size: 10px;
  margin-right: 8px;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.category-name {
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
}

.category-layers {
  padding-left: 20px;
}

.layer-item {
  padding: 6px 20px;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  color: #cccccc;
  transition: color 0.3s ease;
}

.layer-checkbox:hover {
  color: #ffffff;
}

.layer-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 14px;
  height: 14px;
  border: 1px solid #666;
  border-radius: 3px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.layer-checkbox input[type="checkbox"]:checked + .checkmark {
  background: #409eff;
  border-color: #409eff;
}

.layer-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  left: 2px;
  top: -2px;
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.layer-name {
  flex: 1;
}

/* 滚动条样式 */
.layer-tree::-webkit-scrollbar {
  width: 4px;
}

.layer-tree::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.layer-tree::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.layer-tree::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
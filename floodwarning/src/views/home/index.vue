<template>
  <div class="flood-warning-container">
    <!-- 顶部标题 -->
    <HeaderTitle />

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 地图区域 - 全屏背景 -->
      <div class="map-area">
        <!-- 地图容器 -->
        <div id="mars3dContainer" class="map-container"></div>
      </div>

      <!-- 左侧要素台账面板 - 浮动覆盖 -->
      <ElementPanel @element-selected="handleElementSelected" @river-selected="handleRiverSelected" />

      <!-- 地图工具栏 - 浮动覆盖 -->
      <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset-view="handleResetView"
        @layer-toggle="handleLayerToggle" />

      <!-- 右侧详情面板 - 浮动覆盖 -->
      <DetailPanel :visible="showDetailPanel" :detail-data="selectedData" @close="closeDetailPanel" />
    </div>

    <!-- 底部风险统计 -->
    <RiskStatistics />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as mars3d from "mars3d"
import HeaderTitle from '../../components/FloodWarning/HeaderTitle.vue'
import ElementPanel from '../../components/FloodWarning/ElementPanel.vue'
import RiskStatistics from '../../components/FloodWarning/RiskStatistics.vue'
import MapToolbar from '../../components/FloodWarning/MapToolbar.vue'
import DetailPanel from '../../components/FloodWarning/DetailPanel.vue'
import { FloodWarningAPI } from '../../api/floodWarningApi'

let map:any // mars3d.Map三维地图对象
let graphicLayer:any // 矢量图层对象

// 图层管理
const mapLayers = ref(new Map())

// 详情面板状态
const showDetailPanel = ref(false)
const selectedData = ref(null)

// 初始化地图
const initMap = async () => {
  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    allowDrillPick: true // 如果存在坐标完全相同的图标点，可以打开该属性，click事件通过graphics判断
  })

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event: any) {
    console.log("监听layer，单击了矢量对象", event)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效

  try {
    map = new mars3d.Map("mars3dContainer", {
      basemaps: [
        {
          name: "天地图影像",
          type: "tdt",
          layer: "img_d",
          show: true
        }
      ],
      scene: {
        center: { lat: 30.054604, lng: 108.885436, alt: 17036414 },
        showSun: true,
        showMoon: true,
        showSkyBox: true,
        showSkyAtmosphere: false, // 关闭球周边的白色轮廓 map.scene.skyAtmosphere = false
        fog: true,
        fxaa: true,
        globe: {
          showGroundAtmosphere: false, // 关闭大气（球表面白蒙蒙的效果）
          depthTestAgainstTerrain: false,
          baseColor: "#546a53"
        },
        cameraController: {
          zoomFactor: 3.0,
          minimumZoomDistance: 1,
          maximumZoomDistance: 5000000,
          enableRotate: true,
          enableZoom: true
        },

      },
      terrain: {
        show: true,
        type: "xyz",
        url: "http://data.mars3d.cn/terrain",
        requestWaterMask: false,
        requestVertexNormals: false
      }
    })



    console.log('地图初始化成功:', map)
  } catch (error) {
    console.error('地图初始化失败:', error)
    return
  }

  // 添加图形图层
  map.addLayer(graphicLayer)

  // 初始化基础图层
  initBaseLayers()

  // 初始化WMS图层
  await initWMSLayers()

  // 添加地图点击事件
  map.on(mars3d.EventType.click, handleMapClick)
}

// 初始化基础图层
const initBaseLayers = () => {
  // DOM影像图层
  const domLayer = new mars3d.layer.XyzLayer({
    name: 'DOM影像',
    url: 'http://localhost:8090/tiles/meijiangdom/{z}/{x}/{y}.png',
    show: true,
    alpha: 0.8
  })
  map.addLayer(domLayer)
  mapLayers.value.set('dom', domLayer)
}

// 在图层绑定Popup弹窗
const bindLayerPopup = async() =>  {
  graphicLayer.bindPopup(
    function (event: any) {
      if (event.graphics?.length > 1) {
        return `您单击了重叠图标，该区域有${event.graphics.length}个对象` // 如果存在坐标完全相同的图标点时
      }

      const attr = event.graphic.attr || {}
      attr["类型"] = event.graphic.type
      attr["来源"] = "我是layer上绑定的Popup"
      attr["备注"] = "我支持鼠标交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
    },
    { useGraphicPostion: true }
  )
}

// 初始化WMS图层
const initWMSLayers = async () => {
  try {
    const layerConfigs = await FloodWarningAPI.getLayerConfigs()

    layerConfigs.forEach((layerConfig) => {
      const wmsLayer = new mars3d.layer.WmsLayer({
        name: layerConfig.label,
        url: layerConfig.url || "http://localhost:8090/geoserver/wms",
        layers: layerConfig.layer,
        srs: "EPSG:4326",
        parameters: {
          format: "image/png",
          transparent: true,
        },
        show: layerConfig.show,
        flyTo: false
      })

      map.addLayer(wmsLayer)
      mapLayers.value.set(layerConfig.name, wmsLayer)
    })
  } catch (error) {
    console.error('加载图层配置失败:', error)
    // 使用默认配置
    const defaultLayers = [
      { name: 'bengzhan', label: '泵站', layer: 'floodwarning:bengzhan', show: false },
      { name: 'shuiku', label: '水库', layer: 'floodwarning:shuiku', show: false },
      { name: 'shuizha', label: '水闸', layer: 'floodwarning:shuizha', show: false },
      { name: 'heliu', label: '河流', layer: 'floodwarning:heliu', show: true },
      { name: 'daolu', label: '道路', layer: 'floodwarning:daolu', show: false },
      { name: 'xingzheng', label: '行政区划', layer: 'floodwarning:xingzheng', show: false },
      { name: 'yilaoqu', label: '易涝区', layer: 'floodwarning:yilaoqu', show: false },
      { name: 'shuiweizan', label: '水位站', layer: 'floodwarning:shuiweizan', show: true },
      { name: 'yuliangzhan', label: '雨量站', layer: 'floodwarning:yuliangzhan', show: true },
      { name: 'liuliangzhan', label: '流量站', layer: 'floodwarning:liuliangzhan', show: true }
    ]

    defaultLayers.forEach(layerConfig => {
      let layerOptions = {
        name: layerConfig.label,
        url: "http://localhost:8090/geoserver/wms",
        layers: layerConfig.layer,
        srs: "EPSG:4326",
        parameters: {
          format: "image/png",
          transparent: true,
        },
        show: layerConfig.show,
        flyTo: false
      }

      // 为监测站点添加样式配置
      if (layerConfig.name === 'shuiweizan') {
        layerOptions.parameters.STYLES = 'water_station_blue'
      } else if (layerConfig.name === 'yuliangzhan') {
        layerOptions.parameters.STYLES = 'rain_station_green'
      } else if (layerConfig.name === 'liuliangzhan') {
        layerOptions.parameters.STYLES = 'flow_station_red'
      }

      const wmsLayer = new mars3d.layer.WmsLayer(layerOptions)

      map.addLayer(wmsLayer)
      mapLayers.value.set(layerConfig.name, wmsLayer)
    })
  }
}

// 处理要素选择
const handleElementSelected = (element) => {
  console.log('选中要素:', element)

  // 显示要素详情
  selectedData.value = {
    ...element,
    name: element.name
  }
  showDetailPanel.value = true

  // 可以根据要素类型切换显示相应的图层或进行其他操作
  switch (element.type) {
    case 'pump':
      console.log('选中泵站:', element.name)
      break
    case 'reservoir':
      console.log('选中水库:', element.name)
      break
    case 'gate':
      console.log('选中水闸:', element.name)
      break
    case 'flood':
      console.log('选中易涝区:', element.name)
      break
  }
}

// 处理河流选择
const handleRiverSelected = async (river) => {
  console.log('选中河流:', river)

  try {
    // 从API获取河流详细信息
    const riverDetail = await FloodWarningAPI.getRiverDetail(river.id)

    if (riverDetail.coordinates && map) {
      // 地图定位到河流位置
      map.flyToPoint(new mars3d.LngLatPoint(riverDetail.coordinates.lng, riverDetail.coordinates.lat, 10000), {
        duration: 2
      })

      // 显示河流详情
      selectedData.value = {
        ...riverDetail,
        type: 'river'
      }
      showDetailPanel.value = true
    }
  } catch (error) {
    console.error('获取河流详情失败:', error)
    // 使用默认坐标
    const defaultCoordinates = {
      '水东河': { lng: 116.1917, lat: 24.2899 },
      '五华河': { lng: 115.7750, lat: 23.9240 },
      '程江': { lng: 116.3550, lat: 24.1500 },
      '梅江': { lng: 116.1200, lat: 24.3000 },
      '石窟河': { lng: 116.0800, lat: 24.2500 },
      '周溪河': { lng: 116.2500, lat: 24.3500 },
      '黄塘河': { lng: 116.1500, lat: 24.2000 },
      '松源河': { lng: 116.3000, lat: 24.4000 },
      '丙村河': { lng: 116.4000, lat: 24.1800 },
      '韩江': { lng: 116.6000, lat: 24.2500 },
      '汀江': { lng: 116.3800, lat: 25.1000 },
      '梅潭河': { lng: 116.2200, lat: 24.3800 }
    }

    const coord = defaultCoordinates[river.name]
    if (coord && map) {
      map.flyToPoint(new mars3d.LngLatPoint(coord.lng, coord.lat, 10000), {
        duration: 2
      })

      selectedData.value = {
        ...river,
        type: 'river'
      }
      showDetailPanel.value = true
    }
  }
}

// 处理地图点击事件
const handleMapClick = (event) => {
  // 模拟点击获取要素信息
  const pickedObject = event.pickedObject
  if (pickedObject) {
    // 根据点击的对象类型显示不同的详情
    console.log('点击了地图要素:', pickedObject)
  }
}

// 地图控制事件
const handleZoomIn = () => {
  if (map) {
    map.zoomIn()
  }
}

const handleZoomOut = () => {
  if (map) {
    map.zoomOut()
  }
}

const handleResetView = () => {
  if (map) {
    map.flyToPoint(new mars3d.LngLatPoint(116.1917, 24.2899, 5000), {
      duration: 2
    })
  }
}

// 图层切换事件
const handleLayerToggle = (layer) => {
  const mapLayer = mapLayers.value.get(layer.name)
  if (mapLayer) {
    mapLayer.show = layer.visible
    // console.log(`${layer.label} 图层 ${layer.visible ? '显示' : '隐藏'}`)
  }
}

// 关闭详情面板
const closeDetailPanel = () => {
  showDetailPanel.value = false
  selectedData.value = null
}

// 组件挂载
onMounted(() => {
  initMap()
})

// 组件卸载
onUnmounted(() => {
  if (map) {
    map.destroy()
    map = null
  }
})
</script>

<style scoped>
.flood-warning-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000;
}

.main-content {
  flex: 1;
  position: relative;
  height: calc(100vh - 120px);
}

.map-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

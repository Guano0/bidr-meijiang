// 城市内涝风险预警系统API接口

// 要素统计数据接口
export interface ElementStats {
  type: string
  label: string
  count: number
}

// 河流数据接口
export interface RiverData {
  id: number
  name: string
  slope: string
  length: string
  area?: string
  level?: string
  basin?: string
  startCoord?: string
  endCoord?: string
  management?: string
  updateTime?: string
}

// 水位站数据接口
export interface StationData {
  id: number
  name: string
  waterLevel: string
  riskLevel: number
  warningLevel?: string
  guaranteeLevel?: string
  coordinates?: string
  river?: string
  buildTime?: string
  frequency?: string
  lastUpdate?: string
}

// 易涝区数据接口
export interface FloodAreaData {
  id: number
  name: string
  riskLevel: number
  area?: string
  population?: string
  maxDepth?: string
  drainage?: string
  factors?: string
  protection?: string
}

// 风险等级统计接口
export interface RiskLevelStats {
  type: string
  label: string
  color: string
  iconColor: string
  count: string
  waterLevel: string
}

// 图层配置接口
export interface LayerConfig {
  name: string
  label: string
  layer: string
  url?: string
  show: boolean
}

// API类
export class FloodWarningAPI {
  
  // 获取要素统计数据
  static async getElementStats(): Promise<ElementStats[]> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { type: 'river', label: '河流', count: 30 },
          { type: 'pump', label: '泵站', count: 15 },
          { type: 'reservoir', label: '水库', count: 8 },
          { type: 'gate', label: '水闸', count: 12 },
          { type: 'flood', label: '易涝区', count: 5 }
        ])
      }, 500)
    })
  }

  // 根据要素类型获取数据列表
  static async getElementList(elementType: string, page: number = 1, pageSize: number = 10, keyword: string = ''): Promise<{ data: any[], total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data: any[] = []
        
        switch (elementType) {
          case 'river':
            data = this.getRiverMockData()
            break
          case 'pump':
            data = this.getPumpMockData()
            break
          case 'reservoir':
            data = this.getReservoirMockData()
            break
          case 'gate':
            data = this.getGateMockData()
            break
          case 'flood':
            data = this.getFloodAreaMockData()
            break
          default:
            data = this.getRiverMockData()
        }
        
        // 模拟搜索过滤
        if (keyword) {
          data = data.filter(item => item.name.includes(keyword))
        }
        
        // 模拟分页
        const total = data.length
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedData = data.slice(start, end)
        
        resolve({ data: paginatedData, total })
      }, 300)
    })
  }

  // 获取河流详情
  static async getRiverDetail(id: number): Promise<RiverData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rivers = this.getRiverMockData()
        const river = rivers.find(r => r.id === id) || rivers[0]
        resolve({
          ...river,
          area: '156.8',
          level: '二级河流',
          basin: '韩江流域',
          startCoord: '116.123, 24.456',
          endCoord: '116.789, 24.123',
          management: '梅州市水务局',
          updateTime: '2024-01-15 14:30:25'
        })
      }, 200)
    })
  }

  // 获取水位站详情
  static async getStationDetail(id: number): Promise<StationData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: '梅江水位站',
          waterLevel: '2.35',
          riskLevel: 1,
          warningLevel: '3.50',
          guaranteeLevel: '4.20',
          coordinates: '116.456, 24.789',
          river: '梅江',
          buildTime: '1985-06-15',
          frequency: '每小时',
          lastUpdate: '2024-01-15 15:00:00'
        })
      }, 200)
    })
  }

  // 获取风险等级统计
  static async getRiskStatistics(): Promise<RiskLevelStats[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            type: 'normal',
            label: '正常险',
            color: 'rgba(52, 144, 220, 0.8)',
            iconColor: '#3490dc',
            count: '15',
            waterLevel: '2.3m'
          },
          {
            type: 'low',
            label: '低风险',
            color: 'rgba(255, 193, 7, 0.8)',
            iconColor: '#ffc107',
            count: '8',
            waterLevel: '3.1m'
          },
          {
            type: 'high',
            label: '高风险',
            color: 'rgba(220, 53, 69, 0.8)',
            iconColor: '#dc3545',
            count: '3',
            waterLevel: '4.2m'
          }
        ])
      }, 800)
    })
  }

  // 获取图层配置
  static async getLayerConfigs(): Promise<LayerConfig[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'bengzhan', label: '泵站', layer: 'floodwarning:bengzhan', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'shuiku', label: '水库', layer: 'floodwarning:shuiku', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'shuizha', label: '水闸', layer: 'floodwarning:shuizha', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'heliu', label: '河流', layer: 'floodwarning:river', url: 'http://localhost:8090/geoserver/wms', show: true },
          { name: 'daolu', label: '道路', layer: 'floodwarning:road', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'xingzheng', label: '行政区划', layer: 'floodwarning:xingzheng', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'yilaoqu', label: '易涝区', layer: 'floodwarning:yilaoqu', url: 'http://localhost:8090/geoserver/wms', show: false },
          { name: 'shuiweizan', label: '水位站', layer: 'floodwarning:swz', url: 'http://localhost:8090/geoserver/wms', show: true },
          { name: 'yuliangzhan', label: '雨量站', layer: 'floodwarning:ylz', url: 'http://localhost:8090/geoserver/wms', show: true },
          { name: 'liuliangzhan', label: '流量站', layer: 'floodwarning:llz', url: 'http://localhost:8090/geoserver/wms', show: true }
        ])
      }, 200)
    })
  }

  // 河流模拟数据
  private static getRiverMockData(): RiverData[] {
    return [
      { id: 1, name: '水东河', slope: '0.2', length: '15.8' },
      { id: 2, name: '五华河', slope: '1.7‰', length: '8.2' },
      { id: 3, name: '程江', slope: '0.5', length: '25.6' },
      { id: 4, name: '梅江', slope: '0.8', length: '45.2' },
      { id: 5, name: '石窟河', slope: '0.3', length: '12.4' },
      { id: 6, name: '周溪河', slope: '0.6', length: '18.9' },
      { id: 7, name: '黄塘河', slope: '0.4', length: '22.1' },
      { id: 8, name: '松源河', slope: '0.7', length: '16.3' },
      { id: 9, name: '丙村河', slope: '0.9', length: '28.7' },
      { id: 10, name: '韩江', slope: '0.2', length: '156.8' },
      { id: 11, name: '汀江', slope: '0.5', length: '89.4' },
      { id: 12, name: '梅潭河', slope: '0.8', length: '34.2' }
    ]
  }

  // 泵站模拟数据
  private static getPumpMockData() {
    return [
      { id: 1, name: '梅江泵站', capacity: '50', power: '200', status: '正常' },
      { id: 2, name: '程江泵站', capacity: '30', power: '150', status: '正常' },
      { id: 3, name: '石窟河泵站', capacity: '25', power: '120', status: '维修' },
      { id: 4, name: '周溪河泵站', capacity: '40', power: '180', status: '正常' },
      { id: 5, name: '黄塘河泵站', capacity: '35', power: '160', status: '正常' }
    ]
  }

  // 水库模拟数据
  private static getReservoirMockData() {
    return [
      { id: 1, name: '梅江水库', capacity: '1200', currentLevel: '85%', status: '正常' },
      { id: 2, name: '程江水库', capacity: '800', currentLevel: '72%', status: '正常' },
      { id: 3, name: '石窟河水库', capacity: '600', currentLevel: '90%', status: '警戒' },
      { id: 4, name: '周溪河水库', capacity: '450', currentLevel: '68%', status: '正常' }
    ]
  }

  // 水闸模拟数据
  private static getGateMockData() {
    return [
      { id: 1, name: '梅江水闸', type: '节制闸', status: '开启', openLevel: '60%' },
      { id: 2, name: '程江水闸', type: '分洪闸', status: '关闭', openLevel: '0%' },
      { id: 3, name: '石窟河水闸', type: '节制闸', status: '开启', openLevel: '80%' },
      { id: 4, name: '周溪河水闸', type: '排涝闸', status: '开启', openLevel: '100%' }
    ]
  }

  // 易涝区模拟数据
  private static getFloodAreaMockData(): FloodAreaData[] {
    return [
      { id: 1, name: '梅江新区易涝区', riskLevel: 2 },
      { id: 2, name: '程江工业区易涝区', riskLevel: 3 },
      { id: 3, name: '石窟河居民区易涝区', riskLevel: 1 },
      { id: 4, name: '周溪河商业区易涝区', riskLevel: 2 },
      { id: 5, name: '黄塘河农业区易涝区', riskLevel: 1 }
    ]
  }
}

// 导出默认实例
export default FloodWarningAPI
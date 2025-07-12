import './assets/main.css'
// 引入mars3d css
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d/mars3d.css" // v3.8.6及之前版本使用 import "mars3d/dist/mars3d.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')

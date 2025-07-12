import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  // baseURL: '/api',  // 你可以根据实际情况修改 baseURL
  timeout: 5000,    // 设置请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求发送前，可以在这里添加 token 或其他请求头
    const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 在这里可以统一处理响应数据，如检查返回的状态码
    if (response.status === 200) {
      return response.data; // 返回需要的数据
    } else {
      return Promise.reject(response); // 非200状态码抛出异常
    }
  },
  (error) => {
    // 错误处理
    console.error('Response error:', error);
    return Promise.reject(error); // 可以在这里进行统一的错误提示
  }
);

export default request;

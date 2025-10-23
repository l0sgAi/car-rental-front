import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 使用代理路径，在开发环境会被 vite 代理到后端地址
  timeout: 150000, // 请求超时时间，单位毫秒
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
    // 从localStorage获取sa-token的tokenName和tokenValue
    const tokenName = localStorage.getItem('tokenName');
    const tokenValue = localStorage.getItem('tokenValue');

    // //('请求配置:', tokenName, tokenValue);
    
    // 如果tokenName和tokenValue都存在，则添加到请求头中
    if (tokenName && tokenValue) {
      config.headers[tokenName] = tokenValue;
    }
    
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 如果是文件下载（blob类型），直接返回完整的response对象
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    const res = response.data;
    // 如果响应成功，直接返回数据
    return res;
  },
  (error) => {
    // 处理HTTP错误状态码
    const { response } = error;
    if (response) {
      const { status, data } = response;
      let message = data.message || '请求失败';
      
      // 根据状态码处理不同的错误情况
      switch (status) {
        case 400:
          message = message || '请求参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          // 可以在这里处理登出逻辑，例如清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          // 如果需要跳转到登录页，可以使用路由
          // window.location.href = '/login';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `未知错误: ${status}`;
      }
      
      console.error(`请求错误 ${status}: ${message}`);
      return Promise.reject(new Error(message));
    }
    
    // 处理网络错误或请求被取消的情况
    if (error.message.includes('timeout')) {
      console.error('请求超时');
      return Promise.reject(new Error('请求超时，请检查网络连接'));
    }
    
    if (error.message.includes('Network Error')) {
      console.error('网络错误');
      return Promise.reject(new Error('网络错误，请检查网络连接'));
    }
    
    console.error('请求失败:', error);
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get(url, params, config = {}) {
  return service.get(url, { params, ...config });
}

// 封装POST请求
export function post(url, data, config = {}) {
  return service.post(url, data, config);
}

// 封装PUT请求
export function put(url, data, config = {}) {
  return service.put(url, data, config);
}

// 封装DELETE请求
export function del(url, params, config = {}) {
  return service.delete(url, { params, ...config });
}

// 封装上传文件的POST请求
export function upload(url, file, config = {}) {
  const formData = new FormData();
  formData.append('file', file);
  
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
}

// 封装下载文件的GET请求
export function download(url, params = {}, filename, config = {}) {
  return service.get(url, {
    params,
    responseType: 'blob',
    ...config,
  }).then(response => {
    // 从响应头中提取文件名（如果后端提供了的话）
    let downloadFilename = filename;
    const contentDisposition = response.headers?.['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename\*?=(['"]?)(?:UTF-\d['"]*)?([^;\r\n"']*)(['"]?)/i);
      if (filenameMatch && filenameMatch[2]) {
        downloadFilename = decodeURIComponent(filenameMatch[2]);
      }
    }
    
    // response.data 是 Blob 对象
    const blob = response.data;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = downloadFilename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
    
    return response;
  });
}

// 创建取消令牌
export function createCancelToken() {
  const controller = new AbortController();
  return {
    token: controller.signal,
    cancel: (message) => controller.abort(message),
  };
}

// 导出默认实例和所有方法
export default {
  service,
  get,
  post,
  put,
  del,
  upload,
  download,
  createCancelToken,
};
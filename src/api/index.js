import { get, post, put, del } from '../utils/request';

/**
 * 用户相关API
 */
export const userApi = {
  // 用户登录
  login: (data) => post(`/sys/user/auth/doLogin`, data),
  
  // 用户注册
  register: (data) => post(`/sys/user/auth/doRegister`, data),
  
  // 获取用户信息
  getUserInfo: () => get(`/sys/user/getUserInfo`),
  
  // 更新用户信息
  updateUserInfo: (data) => put(`/sys/user/info`, data),
  
  // 用户自更新个人信息
  updateUserSelf: (data) => put(`/sys/user/user/update`, data),
  
  // 修改密码
  changePassword: (data) => post(`/sys/user/password`, data),
  
  // 退出登录
  logout: () => post(`/sys/user/doLogout`),
  
  // 管理员接口
  // 获取所有用户列表（分页+关键字搜索）
  getUserList: (params) => get(`/sys/user/admin/list`, params),
  
  // 管理员新增用户
  addUser: (data) => post(`/sys/user/admin/add`, data),
  
  // 管理员更新用户
  updateUser: (data) => put(`/sys/user/admin/update`, data),
  
  // 管理员删除用户
  deleteUser: (userId) => put(`/sys/user/admin/delete?id=${userId}`),
};

/**
 * 聊天相关API
 */
export const chatApi = {
  // 发送消息
  sendMessage: (data) => post(`/chat/send`, data),
  
  // 停止生成
  stopGeneration: (sessionId) => put(`/chat/stop/${sessionId}`),
  
  // 创建SSE连接获取流式响应
  createSSEConnection: (sessionId) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    const tokenName = localStorage.getItem('tokenName');
    const tokenValue = localStorage.getItem('tokenValue');
    
    let url = `${baseURL}/chat/stream/${sessionId}`;
    
    // 如果有token，添加到URL参数中
    if (tokenName && tokenValue) {
      url += `?${tokenName}=${encodeURIComponent(tokenValue)}`;
    }
    
    console.log('SSE连接URL:', url); // 添加调试日志
    return new EventSource(url);
  },
};

/**
 * 会话管理相关API
 */
export const sessionApi = {
  // 添加会话
  addSession: (data) => post(`/session/add`, data),
  
  // 查询会话列表（支持关键字搜索）
  selectSessions: (keyword) => get(`/session/select`, keyword ? { keyword } : {}),
  
  // 删除会话
  deleteSession: (id) => del(`/session/delete`, { id }),
};

/**
 * 消息对话相关API
 */
export const messageApi = {
  // 新增消息对话
  addMessage: (data) => post(`/message/pair/add`, data),
  
  // 根据会话ID查询消息列表
  getMessagesBySessionId: (sessionId) => get(`/message/pair/select/${sessionId}`),
  
  // 删除会话消息
  deleteMessagesBySessionId: (sessionId) => del(`/message/pair/delete`, { id: sessionId }),
  
  // 全局搜索消息
  globalQuery: (keyWord) => get(`/message/pair/globalQuery`, { keyWord }),
};

/**
 * 系统相关API
 */
export const systemApi = {
  // 获取系统配置
  getConfig: () => get(`/system/config`),
  
  // 获取验证码
  getCaptcha: () => get(`/system/captcha`),
  
  // 文件上传
  fileUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post(`/system/file/fileUpload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

/**
 * AI配置相关API
 */
export const configApi = {
  // 新增配置
  addConfig: (data) => post(`/ai/config/add`, data),
  
  // 查询配置
  queryConfigs: (params) => get(`/ai/config/query`, params),
  
  // 更新配置
  updateConfig: (data) => put(`/ai/config/update`, data),
  
  // 删除配置
  deleteConfig: (id) => del(`/ai/config/delete?id=${id}`),
  
  // 获取可用模型列表
  getModels: () => get(`/ai/config/getModels`),
};

/**
 * 车辆管理相关API
 */
export const carApi = {
  // 管理员新增车辆
  addCar: (data) => post(`/rental/car/admin/add`, data),
  
  // 管理员更新车辆
  updateCar: (data) => put(`/rental/car/admin/update`, data),
  
  // 管理员删除车辆
  deleteCar: (id) => put(`/rental/car/admin/delete?id=${id}`),
  
  // 管理员获取车辆列表（支持分页和关键字搜索）
  getCarList: (params) => get(`/rental/car/admin/list`, params),
  
  // 全局查询车辆列表（使用POST + RequestBody）
  globalQuery: (data) => post(`/rental/car/globalQuery`, data),
  
  // 管理员一键上架车辆到ES
  upCars: () => post(`/rental/car/admin/up`),
};

/**
 * 品牌管理相关API
 */
export const brandApi = {
  // 管理员获取品牌列表（支持分页和关键字搜索）
  getBrandList: (params) => get(`/rental/brand/admin/list`, params),
  
  // 获取品牌详情
  getBrandById: (id) => get(`/rental/brand/${id}`),
};

// 导出所有API
export default {
  userApi,
  chatApi,
  sessionApi,
  messageApi,
  systemApi,
  configApi,
  carApi,
  brandApi,
};
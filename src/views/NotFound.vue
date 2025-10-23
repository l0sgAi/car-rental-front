<template>
  <n-config-provider :theme="darkTheme">
    <div class="not-found-container">
      <n-card class="not-found-card">
        <div class="not-found-content">
          <!-- 404 大号文字 -->
          <div class="error-code-wrapper">
            <h1 class="error-code">404</h1>
            <div class="error-code-shadow">404</div>
          </div>
          
          <!-- 图标和提示 -->
          <div class="icon-wrapper">
            <n-icon :component="HelpCircleOutline" :size="60" color="#f0a020" />
          </div>
          
          <h2 class="error-title">页面不存在</h2>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被删除
          </p>
          
          <n-divider style="margin: 32px 0" />
          
          <!-- 可能的原因 -->
          <div class="tips-section">
            <div class="tips-title">
              <n-icon :component="InformationCircleOutline" size="18" />
              <span>可能的原因</span>
            </div>
            <div class="tips-list">
              <div class="tip-item">
                <n-icon :component="CloseCircleOutline" size="16" color="#999" />
                <span>网址输入错误</span>
              </div>
              <div class="tip-item">
                <n-icon :component="CloseCircleOutline" size="16" color="#999" />
                <span>页面已被移动或删除</span>
              </div>
              <div class="tip-item">
                <n-icon :component="CloseCircleOutline" size="16" color="#999" />
                <span>链接已过期</span>
              </div>
              <div class="tip-item">
                <n-icon :component="CloseCircleOutline" size="16" color="#999" />
                <span>您没有访问权限</span>
              </div>
            </div>
          </div>
          
          <n-divider style="margin: 32px 0" />
          
          <!-- 快捷导航 -->
          <div class="quick-links-section">
            <div class="quick-links-title">
              <n-icon :component="CompassOutline" size="18" />
              <span>快捷导航</span>
            </div>
            <div class="quick-links-grid">
              <div class="quick-link-card" @click="goToHome">
                <n-icon :component="HomeOutline" size="28" color="#18a058" />
                <span>首页</span>
              </div>
              <div class="quick-link-card" @click="goToOrders">
                <n-icon :component="ReceiptOutline" size="28" color="#2080f0" />
                <span>我的订单</span>
              </div>
              <div class="quick-link-card" @click="goToProfile">
                <n-icon :component="PersonOutline" size="28" color="#f0a020" />
                <span>个人中心</span>
              </div>
              <div class="quick-link-card" @click="goBack">
                <n-icon :component="ArrowBackOutline" size="28" color="#d03050" />
                <span>返回上页</span>
              </div>
            </div>
          </div>
          
          <!-- 主要操作按钮 -->
          <div class="action-buttons">
            <n-button type="primary" size="large" @click="goToHome">
              <template #icon>
                <n-icon :component="HomeOutline" />
              </template>
              返回首页
            </n-button>
            
            <n-button size="large" @click="goBack" secondary>
              <template #icon>
                <n-icon :component="ArrowBackOutline" />
              </template>
              返回上一页
            </n-button>
          </div>
        </div>
      </n-card>
      
      <!-- 装饰性元素 -->
      <div class="decoration-elements">
        <div class="float-shape shape-1"></div>
        <div class="float-shape shape-2"></div>
        <div class="float-shape shape-3"></div>
        <div class="float-shape shape-4"></div>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { darkTheme } from 'naive-ui';
import {
  NConfigProvider,
  NCard,
  NIcon,
  NButton,
  NDivider
} from 'naive-ui';
import {
  HelpCircleOutline,
  InformationCircleOutline,
  CloseCircleOutline,
  CompassOutline,
  HomeOutline,
  ReceiptOutline,
  PersonOutline,
  ArrowBackOutline
} from '@vicons/ionicons5';

const router = useRouter();

// 返回首页
const goToHome = () => {
  router.push('/index');
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 跳转到订单页面
const goToOrders = () => {
  router.push('/my-orders');
};

// 跳转到个人中心
const goToProfile = () => {
  router.push('/profile');
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.not-found-card {
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.not-found-content {
  padding: 60px 40px 40px;
  text-align: center;
}

.error-code-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  animation: glitch 3s infinite;
}

.error-code-shadow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 120px;
  font-weight: 900;
  color: rgba(102, 126, 234, 0.1);
  z-index: -1;
  animation: float 4s ease-in-out infinite;
}

@keyframes glitch {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

.icon-wrapper {
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-title {
  font-size: 32px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  animation: fadeInDown 0.6s ease-out;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  animation: fadeInDown 0.6s ease-out 0.1s both;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tips-section {
  margin: 24px 0;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.tips-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  text-align: left;
  font-size: 14px;
  color: #666;
}

.quick-links-section {
  margin: 24px 0;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.quick-links-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.quick-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-link-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.quick-link-card span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-buttons button {
  min-width: 160px;
}

/* 装饰性元素 */
.decoration-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.float-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  animation: floatShape 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  border-radius: 20% 80% 80% 20% / 80% 20% 80% 20%;
  bottom: 15%;
  left: 15%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  top: 20%;
  right: 20%;
  animation-delay: 6s;
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -20px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, -40px) rotate(180deg);
  }
  75% {
    transform: translate(-40px, -20px) rotate(270deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 24px 24px;
  }
  
  .error-code,
  .error-code-shadow {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .tips-list,
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .quick-link-card {
    padding: 16px;
  }
}
</style>


<template>
  <n-config-provider :theme="darkTheme">
    <div class="payment-result-container fail">
      <n-card class="result-card">
        <div class="result-content">
          <!-- 失败图标 -->
          <div class="icon-wrapper fail">
            <n-icon :component="CloseCircleOutline" :size="80" color="#d03050" />
          </div>
          
          <!-- 标题 -->
          <h1 class="result-title">支付失败</h1>
          <p class="result-description">很抱歉，您的支付未能完成</p>
          
          <!-- 失败原因 -->
          <div class="fail-reasons-section">
            <n-divider style="margin: 24px 0" />
            
            <div class="reasons-title">
              <n-icon :component="InformationCircleOutline" size="20" />
              <span>可能的原因</span>
            </div>
            
            <div class="reasons-list">
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>账户余额不足</span>
              </div>
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>支付超时，交易已取消</span>
              </div>
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>网络连接异常</span>
              </div>
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>银行卡限额不足</span>
              </div>
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>支付密码错误次数过多</span>
              </div>
              <div class="reason-item">
                <n-icon :component="AlertCircleOutline" size="18" color="#d03050" />
                <span>系统维护或升级中</span>
              </div>
            </div>
            
            <n-divider style="margin: 24px 0" />
          </div>
          
          <!-- 建议操作 -->
          <div class="tips-section">
            <n-alert type="warning" :show-icon="false">
              <template #header>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <n-icon :component="BulbOutline" size="20" />
                  <span>解决建议</span>
                </div>
              </template>
              <div class="tips-content">
                <p>• 请检查账户余额是否充足</p>
                <p>• 确认网络连接正常后重试</p>
                <p>• 更换其他支付方式</p>
                <p>• 如问题持续，请联系客服：400-123-4567</p>
              </div>
            </n-alert>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <n-button type="error" size="large" @click="retryPayment">
              <template #icon>
                <n-icon :component="RefreshOutline" />
              </template>
              重新支付
            </n-button>
            
            <n-button size="large" @click="goToOrders">
              <template #icon>
                <n-icon :component="ReceiptOutline" />
              </template>
              返回我的订单
            </n-button>
            
            <n-button size="large" @click="goToHome" secondary>
              <template #icon>
                <n-icon :component="HomeOutline" />
              </template>
              返回首页
            </n-button>
          </div>
        </div>
      </n-card>
      
      <!-- 装饰性元素 -->
      <div class="decoration-circles">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { darkTheme, useMessage } from 'naive-ui';
import {
  NConfigProvider,
  NCard,
  NIcon,
  NButton,
  NDivider,
  NAlert
} from 'naive-ui';
import {
  CloseCircleOutline,
  InformationCircleOutline,
  AlertCircleOutline,
  BulbOutline,
  RefreshOutline,
  ReceiptOutline,
  HomeOutline
} from '@vicons/ionicons5';

const router = useRouter();
const message = useMessage();

// 重新支付
const retryPayment = () => {
  message.info('正在返回订单页面...');
  router.push('/my-orders');
};

// 跳转到订单页面
const goToOrders = () => {
  router.push('/my-orders');
};

// 返回首页
const goToHome = () => {
  router.push('/index');
};
</script>

<style scoped>
.payment-result-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.payment-result-container.fail {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.result-card {
  max-width: 700px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.result-content {
  padding: 40px;
  text-align: center;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 24px;
  animation: shake 0.5s ease-out;
}

.icon-wrapper.fail {
  background: linear-gradient(135deg, #d03050 0%, #f5576c 100%);
  box-shadow: 0 10px 30px rgba(208, 48, 80, 0.3);
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

.result-title {
  font-size: 32px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  animation: fadeInDown 0.6s ease-out 0.2s both;
}

.result-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  animation: fadeInDown 0.6s ease-out 0.3s both;
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

.fail-reasons-section {
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.reasons-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.reasons-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.reason-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(208, 48, 80, 0.05);
  border-radius: 8px;
  text-align: left;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.reason-item:hover {
  background: rgba(208, 48, 80, 0.1);
  transform: translateX(4px);
}

.tips-section {
  margin: 24px 0;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.tips-content {
  text-align: left;
  line-height: 1.8;
}

.tips-content p {
  margin: 4px 0;
  color: #666;
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
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
  animation: fadeInUp 0.6s ease-out 0.6s both;
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
  min-width: 140px;
}

/* 装饰性圆圈 */
.decoration-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 2s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-content {
    padding: 24px;
  }
  
  .result-title {
    font-size: 24px;
  }
  
  .icon-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .reasons-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
  }
}
</style>


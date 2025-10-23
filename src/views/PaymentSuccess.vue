<template>
  <n-config-provider :theme="darkTheme">
    <div class="payment-result-container">
      <n-card class="result-card">
        <div class="result-content">
          <!-- 成功图标 -->
          <div class="icon-wrapper success">
            <n-icon :component="CheckmarkCircleOutline" :size="80" color="#18a058" />
          </div>
          
          <!-- 标题 -->
          <h1 class="result-title">支付成功</h1>
          <p class="result-description">恭喜您，订单支付已完成！</p>
          
          <!-- 订单信息 -->
          <div class="order-info-section">
            <n-divider style="margin: 24px 0" />
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="ReceiptOutline" size="18" />
                  <span>订单号</span>
                </div>
                <div class="info-value">{{ orderInfo.outTradeNo || '-' }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="CardOutline" size="18" />
                  <span>交易号</span>
                </div>
                <div class="info-value">{{ orderInfo.tradeNo || '-' }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="CashOutline" size="18" />
                  <span>支付金额</span>
                </div>
                <div class="info-value price">¥{{ orderInfo.totalAmount || '0.00' }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="TimeOutline" size="18" />
                  <span>支付时间</span>
                </div>
                <div class="info-value">{{ orderInfo.timestamp || '-' }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="InformationCircleOutline" size="18" />
                  <span>支付方式</span>
                </div>
                <div class="info-value">支付宝</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <n-icon :component="CheckmarkCircleOutline" size="18" />
                  <span>支付状态</span>
                </div>
                <div class="info-value">
                  <n-tag type="success" size="small" :bordered="false">已支付</n-tag>
                </div>
              </div>
            </div>
            
            <n-divider style="margin: 24px 0" />
          </div>
          
          <!-- 提示信息 -->
          <div class="tips-section">
            <n-alert type="info" :show-icon="false">
              <template #header>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <n-icon :component="InformationCircleOutline" size="20" />
                  <span>温馨提示</span>
                </div>
              </template>
              订单已生成，请按时取车。如有疑问，请联系客服。
            </n-alert>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <n-button type="primary" size="large" @click="goToOrders">
              <template #icon>
                <n-icon :component="ReceiptOutline" />
              </template>
              查看我的订单
            </n-button>
            
            <n-button type="info" size="large" @click="goToHome">
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';
import {
  NConfigProvider,
  NCard,
  NIcon,
  NButton,
  NDivider,
  NTag,
  NAlert
} from 'naive-ui';
import {
  CheckmarkCircleOutline,
  ReceiptOutline,
  CardOutline,
  CashOutline,
  TimeOutline,
  InformationCircleOutline,
  HomeOutline
} from '@vicons/ionicons5';

const router = useRouter();
const route = useRoute();

// 订单信息
const orderInfo = ref({
  outTradeNo: '',
  tradeNo: '',
  totalAmount: '',
  timestamp: '',
  method: '',
  appId: ''
});

// 解析URL参数
const parseUrlParams = () => {
  const params = route.query;
  
  orderInfo.value = {
    outTradeNo: params.out_trade_no || '',
    tradeNo: params.trade_no || '',
    totalAmount: params.total_amount || '',
    timestamp: params.timestamp ? decodeURIComponent(params.timestamp) : '',
    method: params.method || '',
    appId: params.app_id || ''
  };
};

// 跳转到订单页面
const goToOrders = () => {
  router.push('/my-orders');
};

// 返回首页
const goToHome = () => {
  router.push('/index');
};

// 组件挂载时解析参数
onMounted(() => {
  parseUrlParams();
});
</script>

<style scoped>
.payment-result-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
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
  animation: scaleIn 0.5s ease-out;
}

.icon-wrapper.success {
  background: linear-gradient(135deg, #18a058 0%, #52c41a 100%);
  box-shadow: 0 10px 30px rgba(24, 160, 88, 0.3);
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
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

.order-info-section {
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 24px 0;
}

.info-item {
  text-align: left;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  word-break: break-all;
}

.info-value.price {
  color: #18a058;
  font-size: 20px;
}

.tips-section {
  margin: 24px 0;
  animation: fadeIn 0.6s ease-out 0.5s both;
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
  min-width: 160px;
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
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
  }
}
</style>


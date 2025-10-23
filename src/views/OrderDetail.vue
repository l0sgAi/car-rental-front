<template>
    <n-config-provider :theme="darkTheme">
        <div class="od-container">
            <!-- 顶部导航栏 -->
            <n-layout-header class="od-header" bordered>
                <div class="od-header-content">
                    <div class="od-back-button">
                        <n-button @click="goBack" text>
                            <template #icon>
                                <n-icon size="24" :component="ArrowBackOutline" />
                            </template>
                        </n-button>
                        <span class="od-header-title">订单详情</span>
                    </div>
                </div>
            </n-layout-header>

            <!-- 主体内容 -->
            <n-layout-content class="od-content">
                <n-spin :show="isLoading" size="large">
                    <div v-if="orderDetail" class="od-main">
                        <!-- 订单状态卡片 -->
                        <n-card :bordered="false" class="od-status-card">
                            <div class="od-status-content">
                                <div class="od-status-icon">
                                    <n-icon :component="getStatusIcon()" size="64" :color="getStatusColor()" />
                                </div>
                                <div class="od-status-info">
                                    <h2 class="od-status-title">{{ getStatusText() }}</h2>
                                    <p class="od-status-desc">{{ getStatusDesc() }}</p>
                                </div>
                            </div>
                        </n-card>

                        <!-- 车辆信息卡片 -->
                        <n-card :bordered="false">
                            <h2 class="od-section-title">
                                <n-icon :component="CarSportOutline" size="28" color="#18a058" />
                                车辆信息
                            </h2>
                            <div class="od-car-info-layout">
                                <div class="od-car-image">
                                    <n-image 
                                        :src="carImage" 
                                        :alt="orderDetail.carName || '车辆'"
                                        object-fit="cover"
                                        width="200"
                                        height="150"
                                    />
                                </div>
                                <div class="od-car-details">
                                    <h3 class="od-car-name">{{ orderDetail.carName || '未知车辆' }}</h3>
                                    <div class="od-detail-item">
                                        <span class="od-detail-label">车牌号：</span>
                                        <span class="od-detail-value">{{ orderDetail.carNumber || '未设置' }}</span>
                                    </div>
                                    <div class="od-detail-item">
                                        <span class="od-detail-label">日租金：</span>
                                        <span class="od-detail-value price">¥{{ orderDetail.dailyRent || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </n-card>

                        <!-- 租赁信息卡片 -->
                        <n-card :bordered="false">
                            <h2 class="od-section-title">
                                <n-icon :component="CalendarOutline" size="28" color="#18a058" />
                                租赁信息
                            </h2>
                            <div class="od-rental-info">
                                <div class="od-info-item">
                                    <div class="od-info-label">
                                        <n-icon :component="TimeOutline" size="20" />
                                        取车时间
                                    </div>
                                    <div class="od-info-value">{{ formatDateTime(orderDetail.startTime) }}</div>
                                </div>
                                <div class="od-info-item">
                                    <div class="od-info-label">
                                        <n-icon :component="TimeOutline" size="20" />
                                        还车时间
                                    </div>
                                    <div class="od-info-value">{{ formatDateTime(orderDetail.endTime) }}</div>
                                </div>
                                <div class="od-info-item">
                                    <div class="od-info-label">
                                        <n-icon :component="CalendarOutline" size="20" />
                                        租赁天数
                                    </div>
                                    <div class="od-info-value">{{ rentalDays }} 天</div>
                                </div>
                                <div class="od-info-item address" v-if="orderDetail.address">
                                    <div class="od-info-label">
                                        <n-icon :component="LocationOutline" size="20" />
                                        取还车地址
                                    </div>
                                    <div class="od-info-value">{{ orderDetail.address }}</div>
                                </div>
                            </div>
                        </n-card>

                        <!-- 价格信息卡片 -->
                        <n-card :bordered="false">
                            <h2 class="od-section-title">
                                <n-icon :component="CardOutline" size="28" color="#18a058" />
                                价格信息
                            </h2>
                            <div class="od-price-info">
                                <div class="od-price-item">
                                    <span class="od-price-label">日租金</span>
                                    <span class="od-price-value">¥{{ orderDetail.dailyRent || 0 }}</span>
                                </div>
                                <div class="od-price-item">
                                    <span class="od-price-label">租赁天数</span>
                                    <span class="od-price-value">{{ rentalDays }} 天</span>
                                </div>
                                <div class="od-price-divider"></div>
                                <div class="od-price-item total">
                                    <span class="od-price-label">订单总价</span>
                                    <span class="od-price-value-total">¥{{ totalPrice }}</span>
                                </div>
                            </div>
                        </n-card>

                        <!-- 订单信息卡片 -->
                        <n-card :bordered="false">
                            <h2 class="od-section-title">
                                <n-icon :component="DocumentTextOutline" size="28" color="#18a058" />
                                订单信息
                            </h2>
                            <div class="od-order-info">
                                <div class="od-order-item">
                                    <span class="od-order-label">订单编号：</span>
                                    <span class="od-order-value">{{ orderDetail.orderNumber || orderDetail.id || '生成中...' }}</span>
                                </div>
                                <div class="od-order-item">
                                    <span class="od-order-label">下单时间：</span>
                                    <span class="od-order-value">{{ formatDateTime(orderDetail.createTime) }}</span>
                                </div>
                                <div class="od-order-item" v-if="orderDetail.payTime">
                                    <span class="od-order-label">支付时间：</span>
                                    <span class="od-order-value">{{ formatDateTime(orderDetail.payTime) }}</span>
                                </div>
                            </div>
                        </n-card>

                        <!-- 操作按钮区域 -->
                        <div class="od-action-area">
                            <n-button 
                                type="warning"
                                size="large"
                                class="od-action-button"
                                @click="handleModifyOrder"
                                :disabled="!canModify"
                            >
                                <template #icon>
                                    <n-icon :component="CreateOutline" />
                                </template>
                                修改订单
                            </n-button>
                            
                            <n-button 
                                type="error"
                                size="large"
                                class="od-action-button"
                                @click="handleCancelOrder"
                                :disabled="!canCancel"
                            >
                                <template #icon>
                                    <n-icon :component="CloseCircleOutline" />
                                </template>
                                取消订单
                            </n-button>
                            
                            <n-button 
                                type="success"
                                size="large"
                                class="od-action-button primary-action"
                                @click="handlePayOrder"
                                :disabled="!canPay"
                            >
                                <template #icon>
                                    <n-icon :component="CardOutline" />
                                </template>
                                支付订单
                            </n-button>
                        </div>
                    </div>

                    <!-- 加载状态 -->
                    <div class="od-loading-section" v-else-if="isLoading">
                        <n-spin size="large" />
                        <span>加载订单信息中...</span>
                    </div>

                    <!-- 错误状态 -->
                    <div class="od-error-section" v-else>
                        <n-icon :component="AlertCircleOutline" size="64" color="rgba(255, 255, 255, 0.3)" />
                        <div class="od-error-text">订单信息加载失败</div>
                        <n-button @click="goBack" type="primary" style="margin-top: 20px;">
                            返回上一页
                        </n-button>
                    </div>
                </n-spin>
            </n-layout-content>
        </div>
    </n-config-provider>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage, darkTheme } from 'naive-ui';
import {
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NCard,
    NButton,
    NIcon,
    NImage,
    NSpin,
    NConfigProvider
} from 'naive-ui';
import {
    ArrowBackOutline,
    CarSportOutline,
    CalendarOutline,
    TimeOutline,
    CardOutline,
    DocumentTextOutline,
    CreateOutline,
    CloseCircleOutline,
    CheckmarkCircleOutline,
    AlertCircleOutline,
    HourglassOutline,
    LocationOutline
} from '@vicons/ionicons5';

// 引入样式
import '../assets/css/order-detail.css';

// 引入API
import { orderApi } from '../api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 订单详情
const orderDetail = ref(null);
const isLoading = ref(false);

// 车辆图片
const carImage = computed(() => {
    if (orderDetail.value && orderDetail.value.carImages) {
        const images = orderDetail.value.carImages.split(',').filter(img => img.trim());
        return images[0] || 'https://via.placeholder.com/200x150/2c3e50/ffffff?text=Car';
    }
    return 'https://via.placeholder.com/200x150/2c3e50/ffffff?text=Car';
});

// 计算租赁天数
const rentalDays = computed(() => {
    if (!orderDetail.value || !orderDetail.value.startTime || !orderDetail.value.endTime) {
        return 0;
    }
    
    const start = new Date(orderDetail.value.startTime);
    const end = new Date(orderDetail.value.endTime);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(diffDays, 0);
});

// 计算总价
const totalPrice = computed(() => {
    if (!orderDetail.value) {
        return 0;
    }
    
    // 如果后端返回了总价，直接使用
    if (orderDetail.value.totalPrice !== undefined && orderDetail.value.totalPrice !== null) {
        return orderDetail.value.totalPrice;
    }
    
    // 否则根据日租金和天数计算
    if (orderDetail.value.dailyRent && rentalDays.value) {
        return (orderDetail.value.dailyRent * rentalDays.value).toFixed(2);
    }
    
    return 0;
});

// 订单状态判断
const orderStatus = computed(() => {
    if (!orderDetail.value) return 'unknown';
    
    // 根据后端返回的状态字段判断（假设有 status 字段）
    // 0-待支付, 1-已支付, 2-已取消, 3-已完成等
    return orderDetail.value.status || 0;
});

// 是否可以修改订单
const canModify = computed(() => {
    // 只有待支付状态可以修改
    return orderStatus.value === 0;
});

// 是否可以取消订单
const canCancel = computed(() => {
    // 待支付和已支付但未取车的订单可以取消
    return orderStatus.value === 0 || orderStatus.value === 1;
});

// 是否可以支付订单
const canPay = computed(() => {
    // 只有待支付状态可以支付
    return orderStatus.value === 0;
});

// 获取状态图标
const getStatusIcon = () => {
    switch (orderStatus.value) {
        case 0: return HourglassOutline; // 待支付
        case 1: return CheckmarkCircleOutline; // 已支付
        case 2: return CloseCircleOutline; // 已取消
        case 3: return CheckmarkCircleOutline; // 已完成
        default: return HourglassOutline; // 等待中/处理中
    }
};

// 获取状态颜色
const getStatusColor = () => {
    switch (orderStatus.value) {
        case 0: return '#f0a020'; // 待支付 - 橙色
        case 1: return '#18a058'; // 已支付 - 绿色
        case 2: return '#d03050'; // 已取消 - 红色
        case 3: return '#18a058'; // 已完成 - 绿色
        default: return '#808080';
    }
};

// 获取状态文本
const getStatusText = () => {
    switch (orderStatus.value) {
        case 0: return '待支付';
        case 1: return '已支付';
        case 2: return '已取消';
        case 3: return '已完成';
        default: return '未知状态';
    }
};

// 获取状态描述
const getStatusDesc = () => {
    switch (orderStatus.value) {
        case 0: return '订单已创建，请尽快完成支付';
        case 1: return '订单已支付，等待取车';
        case 2: return '订单已取消';
        case 3: return '订单已完成，感谢使用';
        default: return '';
    }
};

// 格式化日期时间
const formatDateTime = (dateStr) => {
    if (!dateStr) return '暂无';
    
    const date = new Date(dateStr);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        return '暂无';
    }
    
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 返回上一页
const goBack = () => {
    router.push('/index');
};

// 获取订单详情
const fetchOrderDetail = async () => {
    const orderId = route.query.orderId;
    
    // 如果没有订单ID，使用传递的基本信息构造临时订单对象
    if (!orderId || orderId === 'latest') {
        // 使用URL参数构造临时订单对象
        const { carId, startTime, endTime, address } = route.query;
        if (carId && startTime && endTime) {
            orderDetail.value = {
                id: 'temp',
                carId: carId,
                carName: '车辆信息加载中...',
                carNumber: '暂无',
                dailyRent: 0,
                startTime: startTime,
                endTime: endTime,
                address: address || '', // 添加地址字段
                status: 0,
                createTime: new Date().toISOString()
            };
            // 注意：实际使用时应该从后端获取完整信息
            message.warning('订单详情加载中，部分信息可能不完整');
            return;
        } else {
            message.error('订单信息不完整');
            setTimeout(() => router.push('/index'), 2000);
            return;
        }
    }

    isLoading.value = true;
    try {
        const response = await orderApi.getOrderDetail(orderId);
        
        if (response.code === 200 && response.data) {
            orderDetail.value = response.data;
        } else {
            message.error(response.msg || '获取订单详情失败');
            setTimeout(() => router.push('/index'), 2000);
        }
    } catch (error) {
        console.error('获取订单详情失败:', error);
        message.error('获取订单详情失败');
    } finally {
        isLoading.value = false;
    }
};

// 修改订单
const handleModifyOrder = () => {
    message.info('修改订单功能开发中...');
    // TODO: 实现修改订单功能
    // router.push({
    //     path: '/order/modify',
    //     query: {
    //         orderId: orderDetail.value.id
    //     }
    // });
};

// 取消订单
const handleCancelOrder = () => {
    message.info('取消订单功能开发中...');
    // TODO: 实现取消订单功能
    // 可以使用 dialog 确认
};

// 支付订单
const handlePayOrder = () => {
    message.info('支付订单功能开发中...');
    // TODO: 实现支付订单功能
    // router.push({
    //     path: '/order/pay',
    //     query: {
    //         orderId: orderDetail.value.id
    //     }
    // });
};

// 组件挂载时获取数据
onMounted(() => {
    fetchOrderDetail();
});
</script>

<style scoped>
/* 样式已在独立的CSS文件中定义: src/assets/css/order-detail.css */
</style>


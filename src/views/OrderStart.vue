<template>
    <n-config-provider :theme="darkTheme">
        <div class="os-container">
            <!-- 顶部导航栏 -->
            <n-layout-header class="os-header" bordered>
                <div class="os-header-content">
                    <div class="os-back-button">
                        <n-button @click="goBack" text>
                            <template #icon>
                                <n-icon size="24" :component="ArrowBackOutline" />
                            </template>
                        </n-button>
                        <span class="os-header-title">确认订单</span>
                    </div>
                </div>
            </n-layout-header>

            <!-- 主体内容 -->
            <n-layout-content class="os-content">
                <n-spin :show="isLoading" size="large">
                    <div v-if="orderData" class="os-main">
                        <!-- 车辆信息卡片 -->
                        <n-card :bordered="false">
                            <h2 class="os-section-title">
                                <n-icon :component="CarSportOutline" size="28" color="#18a058" />
                                车辆信息
                            </h2>
                            <div class="os-car-info-layout">
                                <div class="os-car-image">
                                    <n-image 
                                        :src="carImage" 
                                        :alt="orderData.car.name"
                                        object-fit="cover"
                                        width="200"
                                        height="150"
                                    />
                                </div>
                                <div class="os-car-details">
                                    <h3 class="os-car-name">{{ orderData.car.name }}</h3>
                                    <div class="os-car-tags">
                                        <n-tag type="success" size="small" :bordered="false">
                                            {{ orderData.car.carType }}
                                        </n-tag>
                                        <n-tag type="info" size="small" :bordered="false">
                                            {{ orderData.car.powerType }}
                                        </n-tag>
                                        <n-tag type="warning" size="small" :bordered="false">
                                            {{ orderData.car.seat }}座
                                        </n-tag>
                                    </div>
                                    <div class="os-car-price">
                                        <span class="os-price-label">日租金：</span>
                                        <span class="os-price-value">¥{{ orderData.car.dailyRent }}</span>
                                        <span class="os-price-unit">/天</span>
                                    </div>
                                    <div class="os-car-min-days">
                                        <n-icon :component="InformationCircleOutline" size="16" />
                                        最小租期：{{ orderData.car.minRentalDays }}天
                                    </div>
                                </div>
                            </div>
                        </n-card>

                        <!-- 选择租赁时间 -->
                        <n-card :bordered="false">
                            <h2 class="os-section-title">
                                <n-icon :component="CalendarOutline" size="28" color="#18a058" />
                                选择租赁时间
                            </h2>
                            
                            <div class="os-time-selector">
                                <div class="os-time-input-group">
                                    <div class="os-time-input-item">
                                        <label class="os-time-label">取车时间</label>
                                        <n-date-picker 
                                            v-model:value="startTime"
                                            type="datetime"
                                            placeholder="请选择取车时间"
                                            :is-date-disabled="isStartDateDisabled"
                                            :is-time-disabled="isStartTimeDisabled"
                                            format="yyyy-MM-dd HH:mm"
                                            clearable
                                            style="width: 100%;"
                                        />
                                    </div>
                                    <div class="os-time-input-item">
                                        <label class="os-time-label">还车时间</label>
                                        <n-date-picker 
                                            v-model:value="endTime"
                                            type="datetime"
                                            placeholder="请选择还车时间"
                                            :is-date-disabled="isEndDateDisabled"
                                            :is-time-disabled="isEndTimeDisabled"
                                            format="yyyy-MM-dd HH:mm"
                                            clearable
                                            :disabled="!startTime"
                                            style="width: 100%;"
                                        />
                                    </div>
                                </div>

                                <!-- 已预订时间段提示 -->
                                <div class="os-unavailable-time-tips" v-if="unavailableTimeRanges.length > 0">
                                    <div class="os-tips-header">
                                        <n-icon :component="TimeOutline" size="18" />
                                        <span>已预订时间段（不可选）</span>
                                    </div>
                                    <div class="os-time-ranges">
                                        <div 
                                            v-for="(range, index) in unavailableTimeRanges" 
                                            :key="index"
                                            class="os-time-range-item"
                                        >
                                            <n-tag type="error" size="small">
                                                {{ formatDateTime(range.start) }} 至 {{ formatDateTime(range.end) }}
                                            </n-tag>
                                        </div>
                                    </div>
                                </div>

                                <!-- 租赁天数和价格预览 -->
                                <div class="os-rental-summary" v-if="startTime && endTime">
                                    <div class="os-summary-item">
                                        <span class="os-summary-label">租赁时长：</span>
                                        <span class="os-summary-value">{{ rentalDays }} 天</span>
                                    </div>
                                    <div class="os-summary-item">
                                        <span class="os-summary-label">日租金：</span>
                                        <span class="os-summary-value">¥{{ orderData.car.dailyRent }}</span>
                                    </div>
                                    <div class="os-summary-item total">
                                        <span class="os-summary-label">预计总价：</span>
                                        <span class="os-summary-value-total">¥{{ totalPrice }}</span>
                                    </div>
                                    <div class="os-summary-tip" v-if="rentalDays < orderData.car.minRentalDays">
                                        <n-icon :component="WarningOutline" size="16" color="#f0a020" />
                                        <span>租赁时长不能少于最小租期（{{ orderData.car.minRentalDays }}天）</span>
                                    </div>
                                </div>
                            </div>
                        </n-card>

                        <!-- 取还车地址 -->
                        <n-card :bordered="false">
                            <h2 class="os-section-title">
                                <n-icon :component="LocationOutline" size="28" color="#18a058" />
                                取还车地址
                            </h2>
                            
                            <div class="os-address-section">
                                <div class="os-address-input">
                                    <n-input
                                        v-model:value="address"
                                        type="textarea"
                                        placeholder="请输入取还车地址（必填）"
                                        :autosize="{
                                            minRows: 3,
                                            maxRows: 5
                                        }"
                                        :maxlength="255"
                                        show-count
                                        clearable
                                    />
                                </div>
                                <div class="os-address-tip">
                                    <n-icon :component="InformationCircleOutline" size="16" />
                                    <span>请填写详细的取还车地址，便于我们为您提供服务</span>
                                </div>
                            </div>
                        </n-card>

                        <!-- 底部操作栏 -->
                        <div class="os-footer">
                            <div class="os-footer-content">
                                <div class="os-price-summary">
                                    <div class="os-total-label">总计：</div>
                                    <div class="os-total-price">¥{{ totalPrice }}</div>
                                </div>
                                <n-button 
                                    type="warning" 
                                    size="large"
                                    class="os-submit-button"
                                    @click="handleSubmitOrder"
                                    :disabled="!canSubmit"
                                    :loading="isSubmitting"
                                >
                                    <template #icon>
                                        <n-icon :component="CheckmarkCircleOutline" />
                                    </template>
                                    确认下单
                                </n-button>
                            </div>
                        </div>
                    </div>

                    <!-- 加载状态 -->
                    <div class="os-loading-section" v-else-if="isLoading">
                        <n-spin size="large" />
                        <span>加载订单信息中...</span>
                    </div>

                    <!-- 错误状态 -->
                    <div class="os-error-section" v-else>
                        <n-icon :component="AlertCircleOutline" size="64" color="rgba(255, 255, 255, 0.3)" />
                        <div class="os-error-text">加载失败，请返回重试</div>
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
    NTag,
    NImage,
    NSpin,
    NConfigProvider,
    NDatePicker,
    NInput
} from 'naive-ui';
import {
    ArrowBackOutline,
    CarSportOutline,
    CalendarOutline,
    InformationCircleOutline,
    CheckmarkCircleOutline,
    TimeOutline,
    WarningOutline,
    AlertCircleOutline,
    LocationOutline
} from '@vicons/ionicons5';

// 引入样式
import '../assets/css/order-start.css';

// 引入API
import { orderApi } from '../api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 订单数据
const orderData = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);

// 时间选择
const startTime = ref(null);
const endTime = ref(null);

// 取还车地址
const address = ref('');

// 车辆图片
const carImage = computed(() => {
    if (orderData.value && orderData.value.car.images) {
        const images = orderData.value.car.images.split(',').filter(img => img.trim());
        return images[0] || 'https://via.placeholder.com/200x150/2c3e50/ffffff?text=Car';
    }
    return 'https://via.placeholder.com/200x150/2c3e50/ffffff?text=Car';
});

// 不可租时间段（转换为数组）
const unavailableTimeRanges = computed(() => {
    if (!orderData.value || !orderData.value.rentTime) {
        return [];
    }
    
    const ranges = [];
    const rentTime = orderData.value.rentTime;
    
    // rentTime 是一个对象，key-value 对应开始-结束时间（不可租时间段）
    Object.entries(rentTime).forEach(([start, end]) => {
        ranges.push({
            start: new Date(start).getTime(),
            end: new Date(end).getTime()
        });
    });
    
    return ranges;
});

// 计算租赁天数
const rentalDays = computed(() => {
    if (!startTime.value || !endTime.value) {
        return 0;
    }
    
    const start = new Date(startTime.value);
    const end = new Date(endTime.value);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(diffDays, 0);
});

// 计算总价
const totalPrice = computed(() => {
    if (!orderData.value || !rentalDays.value) {
        return 0;
    }
    
    return (orderData.value.car.dailyRent * rentalDays.value).toFixed(2);
});

// 是否可以提交
const canSubmit = computed(() => {
    if (!startTime.value || !endTime.value || !orderData.value) {
        return false;
    }
    
    // 检查地址是否填写
    if (!address.value || address.value.trim().length === 0) {
        return false;
    }
    
    // 检查地址长度
    if (address.value.trim().length > 255) {
        return false;
    }
    
    // 检查租赁时长是否满足最小租期
    if (rentalDays.value < orderData.value.car.minRentalDays) {
        return false;
    }
    
    // 检查选择的时间是否在可租时间段内
    const start = new Date(startTime.value).getTime();
    const end = new Date(endTime.value).getTime();
    
    return isTimeRangeAvailable(start, end);
});

// 检查时间范围是否可用
const isTimeRangeAvailable = (start, end) => {
    // 检查选择的时间段是否与任何不可租时间段冲突
    for (const range of unavailableTimeRanges.value) {
        // 如果选择的时间段与不可租时间段有重叠，则不可用
        if (start < range.end && end > range.start) {
            return false;
        }
    }
    // 没有冲突，时间段可用
    return true;
};

// 禁用开始日期
const isStartDateDisabled = (timestamp) => {
    const now = Date.now();
    
    // 禁用过去的日期
    if (timestamp < now - 86400000) { // 减去一天的毫秒数，允许选择今天
        return true;
    }
    
    // 禁用超过60天的日期
    const maxDate = now + (60 * 24 * 60 * 60 * 1000); // 当前时间 + 60天
    if (timestamp > maxDate) {
        return true;
    }
    
    // 如果没有不可租时间段，所有日期都可选
    if (unavailableTimeRanges.value.length === 0) {
        return false;
    }
    
    const dayStart = new Date(timestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(timestamp).setHours(23, 59, 59, 999);
    
    // 如果这一天完全在某个不可租时间段内，则禁用
    for (const range of unavailableTimeRanges.value) {
        // 如果整天都被占用，禁用这一天
        if (dayStart >= range.start && dayEnd <= range.end) {
            return true;
        }
    }
    
    // 否则不禁用（即使部分时间被占用，用户也可以选择这一天的其他时间）
    return false;
};

// 禁用开始时间
const isStartTimeDisabled = (timestamp) => {
    const now = Date.now();
    
    // 禁用过去的时间
    if (timestamp < now) {
        return true;
    }
    
    // 禁用超过60天的时间
    const maxDate = now + (60 * 24 * 60 * 60 * 1000); // 当前时间 + 60天
    if (timestamp > maxDate) {
        return true;
    }
    
    // 如果没有不可租时间段，所有时间都可选
    if (unavailableTimeRanges.value.length === 0) {
        return false;
    }
    
    // 检查时间是否在任何不可租时间段内
    for (const range of unavailableTimeRanges.value) {
        if (timestamp >= range.start && timestamp <= range.end) {
            return true; // 在不可租时间段内，禁用
        }
    }
    
    return false; // 不在任何不可租时间段内，不禁用
};

// 禁用结束日期
const isEndDateDisabled = (timestamp) => {
    if (!startTime.value) {
        return true;
    }
    
    const start = new Date(startTime.value).getTime();
    const now = Date.now();
    
    // 禁用开始时间之前的日期
    if (timestamp < start) {
        return true;
    }
    
    // 禁用超过60天的日期
    const maxDate = now + (60 * 24 * 60 * 60 * 1000); // 当前时间 + 60天
    if (timestamp > maxDate) {
        return true;
    }
    
    // 如果没有不可租时间段，所有日期都可选
    if (unavailableTimeRanges.value.length === 0) {
        return false;
    }
    
    const dayStart = new Date(timestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(timestamp).setHours(23, 59, 59, 999);
    
    // 如果这一天完全在某个不可租时间段内，则禁用
    for (const range of unavailableTimeRanges.value) {
        // 如果整天都被占用，禁用这一天
        if (dayStart >= range.start && dayEnd <= range.end) {
            return true;
        }
    }
    
    // 否则不禁用（即使部分时间被占用，用户也可以选择这一天的其他时间）
    return false;
};

// 禁用结束时间
const isEndTimeDisabled = (timestamp) => {
    if (!startTime.value) {
        return true;
    }
    
    const start = new Date(startTime.value).getTime();
    const now = Date.now();
    
    // 禁用开始时间之前的时间
    if (timestamp <= start) {
        return true;
    }
    
    // 禁用超过60天的时间
    const maxDate = now + (60 * 24 * 60 * 60 * 1000); // 当前时间 + 60天
    if (timestamp > maxDate) {
        return true;
    }
    
    // 如果没有不可租时间段，所有时间都可选
    if (unavailableTimeRanges.value.length === 0) {
        return false;
    }
    
    // 检查时间是否在任何不可租时间段内
    for (const range of unavailableTimeRanges.value) {
        if (timestamp >= range.start && timestamp <= range.end) {
            return true; // 在不可租时间段内，禁用
        }
    }
    
    return false; // 不在任何不可租时间段内，不禁用
};

// 格式化日期时间
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
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
    router.back();
};

// 获取订单信息
const fetchOrderData = async () => {
    const carId = route.query.carId;
    if (!carId) {
        message.error('车辆ID不存在');
        router.back();
        return;
    }

    isLoading.value = true;
    try {
        const response = await orderApi.startOrder(carId);
        
        if (response.code === 200 && response.data) {
            orderData.value = response.data;
        } else {
            message.error(response.msg || '获取订单信息失败');
            // 如果是身份证或驾驶证信息不完整，提示跳转到个人资料页面
            if (response.msg && response.msg.includes('驾驶证') || response.msg && response.msg.includes('身份证')) {
                setTimeout(() => {
                    router.push('/profile');
                }, 2000);
            }
        }
    } catch (error) {
        console.error('获取订单信息失败:', error);
        message.error('获取订单信息失败');
    } finally {
        isLoading.value = false;
    }
};

// 提交订单
const handleSubmitOrder = async () => {
    if (!canSubmit.value) {
        message.warning('请完整填写租赁信息');
        return;
    }

    isSubmitting.value = true;
    try {
        // 准备订单数据，参数名称需要匹配后端 BookingDto
        const bookingData = {
            carId: parseInt(orderData.value.car.id), // 确保是 Long 类型
            startRentalTime: new Date(startTime.value).toISOString(), // 改为 startRentalTime
            endRentalTime: new Date(endTime.value).toISOString(), // 改为 endRentalTime
            address: address.value.trim() // 添加地址参数
        };

        const response = await orderApi.createOrder(bookingData);
        
        if (response.code === 200) {
            // 使用后端返回的消息
            message.success(response.msg || response.message || '订单创建成功');
            
            // 跳转到订单详情页面（从响应中获取订单ID，如果没有则使用临时方案）
            const orderId = response.data || 'latest'; // 如果后端返回订单ID，使用它；否则使用 'latest'
            
            router.push({
                path: '/order/detail',
                query: {
                    orderId: orderId,
                    // 传递基本信息作为备用
                    carId: orderData.value.car.id,
                    startTime: startTime.value,
                    endTime: endTime.value,
                    address: address.value.trim()
                }
            });
        } else {
            message.error(response.msg || '创建订单失败');
        }
    } catch (error) {
        console.error('创建订单失败:', error);
        message.error('创建订单失败，请重试');
    } finally {
        isSubmitting.value = false;
    }
};

// 组件挂载时获取数据
onMounted(() => {
    fetchOrderData();
});
</script>

<style scoped>
/* 样式已在独立的CSS文件中定义: src/assets/css/order-start.css */
</style>


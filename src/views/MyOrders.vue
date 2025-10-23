<template>
    <n-config-provider :theme="darkTheme">
        <div class="mo-container">
            <!-- 顶部导航栏 -->
            <n-layout-header class="mo-header" bordered>
                <div class="mo-header-content">
                    <div class="mo-header-left">
                        <n-button text @click="goBack" class="mo-back-button">
                            <template #icon>
                                <n-icon :component="ArrowBackOutline" size="24" />
                            </template>
                        </n-button>
                        <n-icon size="28" :component="ReceiptOutline" color="#18a058" />
                        <span class="mo-title">我的订单</span>
                    </div>
                    <div class="mo-header-right">
                        <n-avatar
                            size="small"
                            :src="userAvatar || ''"
                            fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                            round
                        />
                        <span class="mo-username">{{ username }}</span>
                    </div>
                </div>
            </n-layout-header>

            <!-- 主要内容区域 -->
            <n-layout-content class="mo-main-content">
                <n-card :bordered="false" class="mo-content-card">
                    <!-- 搜索和筛选栏 -->
                    <n-space vertical :size="16">
                        <n-space justify="space-between" wrap>
                            <n-space wrap>
                                <n-input-group>
                                    <n-input
                                        v-model:value="searchKeyword"
                                        placeholder="搜索订单（车辆名称）"
                                        clearable
                                        style="width: 260px"
                                        @keyup.enter="handleSearch"
                                    >
                                        <template #prefix>
                                            <n-icon :component="SearchOutline" />
                                        </template>
                                    </n-input>
                                    <n-button type="primary" @click="handleSearch">
                                        搜索
                                    </n-button>
                                </n-input-group>
                                <n-select
                                    v-model:value="statusFilter"
                                    :options="statusOptions"
                                    placeholder="订单状态"
                                    style="width: 140px"
                                    @update:value="handleFilterChange"
                                />
                                <n-date-picker
                                    v-model:value="dateRange"
                                    type="daterange"
                                    clearable
                                    placeholder="选择日期范围"
                                    style="width: 280px"
                                    @update:value="handleFilterChange"
                                />
                            </n-space>
                        </n-space>

                        <!-- 订单统计卡片 -->
                        <n-grid :x-gap="16" :y-gap="16" :cols="5" responsive="screen">
                            <n-grid-item>
                                <n-card class="mo-stat-card mo-stat-total" :bordered="false">
                                    <div class="mo-stat-content">
                                        <n-icon :component="ReceiptOutline" size="32" />
                                        <div class="mo-stat-info">
                                            <div class="mo-stat-label">全部订单</div>
                                            <div class="mo-stat-value">{{ statistics.total }}</div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-grid-item>
                            <n-grid-item>
                                <n-card class="mo-stat-card mo-stat-pending" :bordered="false">
                                    <div class="mo-stat-content">
                                        <n-icon :component="TimeOutline" size="32" />
                                        <div class="mo-stat-info">
                                            <div class="mo-stat-label">待支付</div>
                                            <div class="mo-stat-value">{{ statistics.pending }}</div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-grid-item>
                            <n-grid-item>
                                <n-card class="mo-stat-card mo-stat-paid" :bordered="false">
                                    <div class="mo-stat-content">
                                        <n-icon :component="CheckmarkCircleOutline" size="32" />
                                        <div class="mo-stat-info">
                                            <div class="mo-stat-label">已支付</div>
                                            <div class="mo-stat-value">{{ statistics.paid }}</div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-grid-item>
                            <n-grid-item>
                                <n-card class="mo-stat-card mo-stat-renting" :bordered="false">
                                    <div class="mo-stat-content">
                                        <n-icon :component="CarSportOutline" size="32" />
                                        <div class="mo-stat-info">
                                            <div class="mo-stat-label">租赁中</div>
                                            <div class="mo-stat-value">{{ statistics.renting }}</div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-grid-item>
                            <n-grid-item>
                                <n-card class="mo-stat-card mo-stat-completed" :bordered="false">
                                    <div class="mo-stat-content">
                                        <n-icon :component="CheckmarkDoneCircleOutline" size="32" />
                                        <div class="mo-stat-info">
                                            <div class="mo-stat-label">已完成</div>
                                            <div class="mo-stat-value">{{ statistics.completed }}</div>
                                        </div>
                                    </div>
                                </n-card>
                            </n-grid-item>
                        </n-grid>

                        <!-- 订单列表 -->
                        <n-spin :show="loading">
                            <n-empty v-if="!loading && orderList.length === 0" description="暂无订单" />
                            <n-space v-else vertical :size="16">
                                <n-card
                                    v-for="order in orderList"
                                    :key="order.id"
                                    class="mo-order-card"
                                    hoverable
                                >
                                    <div class="mo-order-content">
                                        <!-- 车辆图片 -->
                                        <div class="mo-order-image">
                                            <n-image
                                                :src="order.carImage ? order.carImage.split(',')[0].trim() : ''"
                                                width="180"
                                                height="120"
                                                object-fit="cover"
                                                fallback-src="https://via.placeholder.com/180x120/2c3e50/ffffff?text=Car"
                                            />
                                            <div class="mo-status-container">
                                                <n-tag
                                                    :type="getStatusType(order.status)"
                                                    size="small"
                                                    class="mo-order-status-badge"
                                                >
                                                    {{ getStatusText(order.status) }}
                                                </n-tag>
                                            </div>
                                        </div>

                                        <!-- 订单信息 -->
                                        <div class="mo-order-info">
                                            <div class="mo-order-header">
                                                <h3 class="mo-car-name">{{ order.carName }}</h3>
                                                <div class="mo-order-price">
                                                    <span class="mo-price-label">订单金额</span>
                                                    <span class="mo-price-value">¥{{ order.price }}</span>
                                                </div>
                                            </div>

                                            <n-space vertical :size="8" class="mo-order-details">
                                                <div class="mo-detail-item">
                                                    <n-icon :component="CalendarOutline" size="16" />
                                                    <span class="mo-detail-label">起租时间：</span>
                                                    <span class="mo-detail-value">{{ formatDate(order.startTime) }}</span>
                                                </div>
                                                <div class="mo-detail-item">
                                                    <n-icon :component="CalendarOutline" size="16" />
                                                    <span class="mo-detail-label">结束时间：</span>
                                                    <span class="mo-detail-value">{{ formatDate(order.endTime) }}</span>
                                                </div>
                                                <div class="mo-detail-item">
                                                    <n-icon :component="TimeOutline" size="16" />
                                                    <span class="mo-detail-label">租赁天数：</span>
                                                    <span class="mo-detail-value">{{ calculateDays(order.startTime, order.endTime) }}天</span>
                                                </div>
                                                <div class="mo-detail-item" v-if="order.score !== null && order.score !== undefined">
                                                    <n-icon :component="StarOutline" size="16" />
                                                    <span class="mo-detail-label">我的评分：</span>
                                                    <n-rate :value="order.score / 2" readonly size="small" />
                                                    <span class="mo-detail-value">{{ order.score }}分</span>
                                                </div>
                                                <div class="mo-detail-item">
                                                    <n-icon :component="CreateOutline" size="16" />
                                                    <span class="mo-detail-label">创建时间：</span>
                                                    <span class="mo-detail-value">{{ formatDate(order.createTime) }}</span>
                                                </div>
                                            </n-space>
                                        </div>

                                        <!-- 操作按钮 -->
                                        <div class="mo-order-actions">
                                            <n-space vertical>
                                                <n-button
                                                    type="info"
                                                    @click="handleViewDetail(order)"
                                                    block
                                                >
                                                    <template #icon>
                                                        <n-icon :component="EyeOutline" />
                                                    </template>
                                                    查看详情
                                                </n-button>
                                                <n-button
                                                    v-if="order.status === 0"
                                                    type="success"
                                                    @click="handlePay(order)"
                                                    :loading="payingOrderId === order.id"
                                                    :disabled="payingOrderId !== null && payingOrderId !== order.id"
                                                    block
                                                >
                                                    <template #icon>
                                                        <n-icon :component="CardOutline" />
                                                    </template>
                                                    立即支付
                                                </n-button>
                                                <n-popconfirm
                                                    v-if="order.status === 0 || order.status === 1"
                                                    @positive-click="handleCancel(order)"
                                                >
                                                    <template #trigger>
                                                        <n-button type="error" block>
                                                            <template #icon>
                                                                <n-icon :component="CloseCircleOutline" />
                                                            </template>
                                                            取消订单
                                                        </n-button>
                                                    </template>
                                                    确定要取消该订单吗？{{ order.status === 1 ? '取消后将进行退款处理。' : '' }}
                                                </n-popconfirm>
                                            </n-space>
                                        </div>
                                    </div>
                                </n-card>
                            </n-space>
                        </n-spin>

                        <!-- 分页 -->
                        <n-pagination
                            v-if="paginationReactive.itemCount > 0"
                            v-model:page="paginationReactive.page"
                            v-model:page-size="paginationReactive.pageSize"
                            :item-count="paginationReactive.itemCount"
                            :page-sizes="paginationReactive.pageSizes"
                            show-size-picker
                            :on-update:page="paginationReactive.onChange"
                            :on-update:page-size="paginationReactive.onUpdatePageSize"
                            style="justify-content: center; margin-top: 24px"
                        >
                            <template #prefix="{ itemCount }">
                                共 {{ itemCount }} 条
                            </template>
                        </n-pagination>
                    </n-space>
                </n-card>
            </n-layout-content>

            <!-- 订单详情对话框 -->
            <n-modal
                v-model:show="showDetailModal"
                preset="dialog"
                title="订单详情"
                style="width: 700px"
            >
                <n-space v-if="currentOrder" vertical :size="16" style="margin-top: 16px">
                    <!-- 车辆图片 -->
                    <n-image
                        v-if="currentOrder.carImage"
                        :src="currentOrder.carImage.split(',')[0].trim()"
                        width="100%"
                        object-fit="cover"
                        style="border-radius: 8px"
                    />
                    
                    <n-descriptions label-placement="left" :column="2" bordered>
                        <n-descriptions-item label="订单ID">{{ currentOrder.id }}</n-descriptions-item>
                        <n-descriptions-item label="订单状态">
                            <n-tag :type="getStatusType(currentOrder.status)" size="small">
                                {{ getStatusText(currentOrder.status) }}
                            </n-tag>
                        </n-descriptions-item>
                        <n-descriptions-item label="车辆ID">{{ currentOrder.carId }}</n-descriptions-item>
                        <n-descriptions-item label="车辆名称">{{ currentOrder.carName }}</n-descriptions-item>
                        <n-descriptions-item label="起租时间">
                            {{ formatDate(currentOrder.startTime) }}
                        </n-descriptions-item>
                        <n-descriptions-item label="结束时间">
                            {{ formatDate(currentOrder.endTime) }}
                        </n-descriptions-item>
                        <n-descriptions-item label="租赁天数">
                            {{ calculateDays(currentOrder.startTime, currentOrder.endTime) }}天
                        </n-descriptions-item>
                        <n-descriptions-item label="订单评分">
                            <n-tag v-if="currentOrder.score !== null && currentOrder.score !== undefined" type="warning">
                                {{ currentOrder.score }} 分
                            </n-tag>
                            <span v-else>未评分</span>
                        </n-descriptions-item>
                        <n-descriptions-item label="取还车地址" :span="2" v-if="currentOrder.address">
                            {{ currentOrder.address }}
                        </n-descriptions-item>
                        <n-descriptions-item label="订单金额" :span="2">
                            <n-text type="error" strong style="font-size: 18px">¥{{ currentOrder.price || 0 }}</n-text>
                        </n-descriptions-item>
                        <n-descriptions-item label="创建时间">
                            {{ formatDate(currentOrder.createTime) }}
                        </n-descriptions-item>
                        <n-descriptions-item label="更新时间">
                            {{ formatDate(currentOrder.updateTime) }}
                        </n-descriptions-item>
                    </n-descriptions>
                </n-space>

                <template #action>
                    <n-button @click="showDetailModal = false">关闭</n-button>
                </template>
            </n-modal>
        </div>
    </n-config-provider>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage, darkTheme } from 'naive-ui';
import {
    NConfigProvider,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NCard,
    NSpace,
    NInput,
    NInputGroup,
    NButton,
    NIcon,
    NAvatar,
    NTag,
    NSelect,
    NDatePicker,
    NGrid,
    NGridItem,
    NSpin,
    NEmpty,
    NImage,
    NPagination,
    NModal,
    NDescriptions,
    NDescriptionsItem,
    NText,
    NPopconfirm,
    NRate
} from 'naive-ui';
import {
    ArrowBackOutline,
    ReceiptOutline,
    SearchOutline,
    TimeOutline,
    CheckmarkCircleOutline,
    CheckmarkDoneCircleOutline,
    CarSportOutline,
    CalendarOutline,
    StarOutline,
    CreateOutline,
    EyeOutline,
    CardOutline,
    CloseCircleOutline
} from '@vicons/ionicons5';
import { orderApi, userApi } from '@/api';

const router = useRouter();
const message = useMessage();

// 用户信息
const username = ref(localStorage.getItem('username') || '用户');
const userAvatar = ref('');

// 搜索和筛选
const searchKeyword = ref('');
const statusFilter = ref(null);
const dateRange = ref(null);

// 订单列表
const orderList = ref([]);
const loading = ref(false);
const payingOrderId = ref(null); // 正在支付的订单ID

// 搜索参数
const searchParams = reactive({
    keyWord: '',
    startDate: null,
    endDate: null,
    status: null,
    pageNum: 1,
    pageSize: 10
});

// 分页配置
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    onChange: (page) => {
        searchParams.pageNum = page;
        fetchOrderList();
    },
    onUpdatePageSize: (pageSize) => {
        searchParams.pageSize = pageSize;
        searchParams.pageNum = 1;
        paginationReactive.page = 1;
        fetchOrderList();
    }
});

// 状态选项
const statusOptions = [
    { label: '全部', value: null },
    { label: '待支付', value: 0 },
    { label: '已支付', value: 1 },
    { label: '租赁中', value: 2 },
    { label: '已完成', value: 3 },
    { label: '已取消', value: 4 },
    { label: '待退款', value: 5 },
    { label: '已退款', value: 6 }
];

// 统计数据
const statistics = computed(() => {
    return {
        total: orderList.value.length,
        pending: orderList.value.filter(o => o.status === 0).length,
        paid: orderList.value.filter(o => o.status === 1).length,
        renting: orderList.value.filter(o => o.status === 2).length,
        completed: orderList.value.filter(o => o.status === 3).length
    };
});

// 获取状态文本
const getStatusText = (status) => {
    const map = { 
        0: '待支付', 
        1: '已支付', 
        2: '租赁中', 
        3: '已完成', 
        4: '已取消',
        5: '待退款',
        6: '已退款'
    };
    return map[status] || '未知';
};

// 获取状态类型
const getStatusType = (status) => {
    const map = { 
        0: 'warning', 
        1: 'success', 
        2: 'info', 
        3: 'success', 
        4: 'default',
        5: 'warning',
        6: 'info'
    };
    return map[status] || 'default';
};

// 计算租赁天数
const calculateDays = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 获取订单列表
const fetchOrderList = async () => {
    loading.value = true;
    try {
        const params = {
            pageNum: searchParams.pageNum,
            pageSize: searchParams.pageSize
        };
        
        if (searchParams.keyWord) {
            params.keyWord = searchParams.keyWord;
        }
        
        if (searchParams.status !== null && searchParams.status !== undefined) {
            params.status = searchParams.status;
        }
        
        // 日期参数转换为ISO字符串
        if (searchParams.startDate) {
            params.startDate = new Date(searchParams.startDate).toISOString();
        }
        if (searchParams.endDate) {
            params.endDate = new Date(searchParams.endDate).toISOString();
        }
        
        const res = await orderApi.getUserOrderList(params);
        
        if (res.code === 200) {
            orderList.value = res.data || [];
            paginationReactive.itemCount = res.count || 0;
            paginationReactive.page = searchParams.pageNum;
        } else {
            message.error(res.message || '获取订单列表失败');
        }
    } catch (error) {
        console.error('获取订单列表失败:', error);
        message.error('获取订单列表失败，请检查网络连接');
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    searchParams.keyWord = searchKeyword.value;
    searchParams.pageNum = 1;
    paginationReactive.page = 1;
    fetchOrderList();
};

// 筛选变化
const handleFilterChange = () => {
    searchParams.status = statusFilter.value;
    
    if (dateRange.value && dateRange.value.length === 2) {
        searchParams.startDate = dateRange.value[0];
        searchParams.endDate = dateRange.value[1];
    } else {
        searchParams.startDate = null;
        searchParams.endDate = null;
    }
    
    searchParams.pageNum = 1;
    paginationReactive.page = 1;
    fetchOrderList();
};

// 对话框
const showDetailModal = ref(false);
const currentOrder = ref(null);

// 查看详情
const handleViewDetail = (order) => {
    currentOrder.value = order;
    showDetailModal.value = true;
};

// 支付订单
const handlePay = async (order) => {
    // 设置正在支付的订单ID
    payingOrderId.value = order.id;
    
    try {
        // 调用支付接口
        const payResponse = await orderApi.payOrder(order.id);
        
        // 根据调试结果，成功状态码为 500，message 中包含支付表单
        if (payResponse.code === 500 && payResponse.message) {
            // 支付表单创建成功
            const paymentForm = payResponse.message;
            
            // 在新标签页中打开支付表单
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(paymentForm);
                newWindow.document.close();
                
                // 提示用户支付结果会稍后推送
                message.info('支付页面已在新标签页打开，支付结果会稍后推送', {
                    duration: 4000
                });
                
                // 延迟刷新订单列表
                setTimeout(() => {
                    message.success('正在刷新订单列表...');
                    fetchOrderList();
                }, 3000);
            } else {
                // 浏览器阻止了弹窗
                message.warning('浏览器阻止了支付页面弹窗，请允许弹窗后重试', {
                    duration: 4000
                });
            }
        } else {
            // 支付请求失败
            message.error(payResponse.message || payResponse.msg || '支付请求失败，请稍后重试', {
                duration: 4000
            });
        }
    } catch (error) {
        console.error('支付请求失败:', error);
        message.error('支付请求失败，请稍后重试', {
            duration: 4000
        });
    } finally {
        // 清除支付状态
        payingOrderId.value = null;
    }
};

// 取消订单
const handleCancel = async (order) => {
    try {
        loading.value = true;
        const response = await orderApi.cancelOrder(order.id);
        
        if (response.code === 200) {
            message.success('订单取消成功' + (order.status === 1 ? '，退款处理中' : ''));
            // 刷新订单列表
            await fetchOrderList();
        } else {
            message.error(response.message || '取消订单失败');
        }
    } catch (error) {
        console.error('取消订单失败:', error);
        message.error('取消订单失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 返回
const goBack = () => {
    router.back();
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await userApi.getUserInfo();
        if (response.code === 200 && response.data) {
            username.value = response.data.username || '用户';
            userAvatar.value = response.data.avatarUrl || '';
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

// 组件挂载
onMounted(() => {
    fetchUserInfo();
    fetchOrderList();
});
</script>

<style scoped>
@import '../assets/css/my-orders.css';
</style>


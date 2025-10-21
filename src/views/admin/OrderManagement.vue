<template>
    <n-card title="订单管理" :bordered="false">
        <!-- 搜索和筛选栏 -->
        <n-space vertical :size="16">
            <n-space justify="space-between">
                <n-space>
                    <n-input-group>
                        <n-input
                            v-model:value="searchKeyword"
                            placeholder="搜索订单号、用户名..."
                            clearable
                            style="width: 300px"
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
                        style="width: 150px"
                        @update:value="handleFilterChange"
                    />
                    <n-date-picker
                        v-model:value="dateRange"
                        type="daterange"
                        clearable
                        placeholder="选择日期范围"
                        @update:value="handleFilterChange"
                    />
                </n-space>
            </n-space>

            <!-- 统计卡片 -->
            <n-grid :x-gap="16" :y-gap="16" :cols="4">
                <n-grid-item>
                    <n-statistic label="总订单数" :value="statistics.total">
                        <template #prefix>
                            <n-icon :component="ReceiptOutline" size="24" color="#18a058" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="待支付" :value="statistics.pending">
                        <template #prefix>
                            <n-icon :component="TimeOutline" size="24" color="#f0a020" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="进行中" :value="statistics.ongoing">
                        <template #prefix>
                            <n-icon :component="CheckmarkCircleOutline" size="24" color="#2080f0" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="已完成" :value="statistics.completed">
                        <template #prefix>
                            <n-icon :component="CheckmarkDoneCircleOutline" size="24" color="#18a058" />
                        </template>
                    </n-statistic>
                </n-grid-item>
            </n-grid>

            <!-- 订单列表表格 -->
            <n-data-table
                :columns="columns"
                :data="orderList"
                :loading="loading"
                :pagination="paginationReactive"
                :bordered="false"
                :single-line="false"
                remote
            />
        </n-space>

        <!-- 订单详情对话框 -->
        <n-modal
            v-model:show="showDetailModal"
            preset="dialog"
            title="订单详情"
            style="width: 700px"
        >
            <n-space v-if="currentOrder" vertical :size="16" style="margin-top: 16px">
                <!-- 车辆图片 - 取第一个 -->
                <n-image
                    v-if="currentOrder.carImage"
                    :src="currentOrder.carImage.split(',')[0].trim()"
                    width="200"
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
                    <n-descriptions-item label="用户ID">{{ currentOrder.userId }}</n-descriptions-item>
                    <n-descriptions-item label="用户名">{{ currentOrder.username }}</n-descriptions-item>
                    <n-descriptions-item label="车辆ID">{{ currentOrder.carId }}</n-descriptions-item>
                    <n-descriptions-item label="车辆名称">{{ currentOrder.carName }}</n-descriptions-item>
                    <n-descriptions-item label="起租时间">
                        {{ currentOrder.startTime ? new Date(currentOrder.startTime).toLocaleString('zh-CN') : '-' }}
                    </n-descriptions-item>
                    <n-descriptions-item label="结束时间">
                        {{ currentOrder.endTime ? new Date(currentOrder.endTime).toLocaleString('zh-CN') : '-' }}
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
                    <n-descriptions-item label="订单金额" :span="2">
                        <n-text type="error" strong style="font-size: 18px">¥{{ currentOrder.price || 0 }}</n-text>
                    </n-descriptions-item>
                    <n-descriptions-item label="创建时间">
                        {{ currentOrder.createTime ? new Date(currentOrder.createTime).toLocaleString('zh-CN') : '-' }}
                    </n-descriptions-item>
                    <n-descriptions-item label="更新时间">
                        {{ currentOrder.updateTime ? new Date(currentOrder.updateTime).toLocaleString('zh-CN') : '-' }}
                    </n-descriptions-item>
                </n-descriptions>
            </n-space>

            <template #action>
                <n-button @click="showDetailModal = false">关闭</n-button>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup>
import { ref, reactive, h, computed, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import {
    NCard,
    NSpace,
    NInputGroup,
    NInput,
    NButton,
    NDataTable,
    NIcon,
    NTag,
    NPopconfirm,
    NModal,
    NSelect,
    NDatePicker,
    NGrid,
    NGridItem,
    NStatistic,
    NDescriptions,
    NDescriptionsItem,
    NText,
    NImage
} from 'naive-ui';
import {
    SearchOutline,
    EyeOutline,
    CloseCircleOutline,
    ReceiptOutline,
    TimeOutline,
    CheckmarkCircleOutline,
    CheckmarkDoneCircleOutline
} from '@vicons/ionicons5';
import { orderApi } from '@/api';

const message = useMessage();

// 搜索关键词
const searchKeyword = ref('');
const statusFilter = ref(null);
const dateRange = ref(null);

// 订单列表
const orderList = ref([]);

// 加载状态
const loading = ref(false);

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
    pageSizes: [10, 20, 50, 100],
    prefix: (info) => `共 ${info.itemCount} 条`,
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

// 状态选项 - 对应后端：0=新建/待支付，1=已支付，2=租赁中，3=已完成，4=已取消
const statusOptions = [
    { label: '全部', value: null },
    { label: '待支付', value: 0 },
    { label: '已支付', value: 1 },
    { label: '租赁中', value: 2 },
    { label: '已完成', value: 3 },
    { label: '已取消', value: 4 }
];

// 统计数据
const statistics = computed(() => {
    return {
        total: orderList.value.length,
        pending: orderList.value.filter(o => o.status === 0).length,
        ongoing: orderList.value.filter(o => o.status === 1 || o.status === 2).length,
        completed: orderList.value.filter(o => o.status === 3).length
    };
});

// 获取状态文本
const getStatusText = (status) => {
    const map = { 0: '待支付', 1: '已支付', 2: '租赁中', 3: '已完成', 4: '已取消' };
    return map[status] || '未知';
};

// 获取状态类型
const getStatusType = (status) => {
    const map = { 0: 'warning', 1: 'success', 2: 'info', 3: 'success', 4: 'default' };
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

// 表格列配置
const columns = [
    {
        title: '订单ID',
        key: 'id',
        width: 100
    },
    {
        title: '车辆图片',
        key: 'carImage',
        width: 100,
        render: (row) => {
            // 取逗号分隔的第一个图片URL
            const imageUrl = row.carImage ? row.carImage.split(',')[0].trim() : '';
            return imageUrl ? h(NImage, {
                src: imageUrl,
                width: 70,
                height: 45,
                objectFit: 'cover',
                style: { borderRadius: '4px' }
            }) : h('span', '-');
        }
    },
    {
        title: '车辆名称',
        key: 'carName',
        width: 150,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '用户名',
        key: 'username',
        width: 120
    },
    {
        title: '起租时间',
        key: 'startTime',
        width: 160,
        render: (row) => {
            return row.startTime ? new Date(row.startTime).toLocaleString('zh-CN', { 
                month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
            }) : '-';
        }
    },
    {
        title: '结束时间',
        key: 'endTime',
        width: 160,
        render: (row) => {
            return row.endTime ? new Date(row.endTime).toLocaleString('zh-CN', { 
                month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
            }) : '-';
        }
    },
    {
        title: '租期',
        key: 'days',
        width: 80,
        render: (row) => `${calculateDays(row.startTime, row.endTime)}天`
    },
    {
        title: '订单金额',
        key: 'price',
        width: 110,
        render: (row) => h('span', { style: { color: '#d03050', fontWeight: 'bold' } }, `¥${row.price || 0}`)
    },
    {
        title: '评分',
        key: 'score',
        width: 80,
        render: (row) => row.score !== null && row.score !== undefined ? `${row.score}分` : '-'
    },
    {
        title: '状态',
        key: 'status',
        width: 100,
        render: (row) => {
            return h(
                NTag,
                { type: getStatusType(row.status), size: 'small' },
                { default: () => getStatusText(row.status) }
            );
        }
    },
    {
        title: '创建时间',
        key: 'createTime',
        width: 180,
        render: (row) => {
            return row.createTime ? new Date(row.createTime).toLocaleString('zh-CN') : '-';
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 90,
        fixed: 'right',
        render: (row) => {
            return h(
                NSpace,
                {},
                {
                    default: () => [
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'info',
                                onClick: () => handleViewDetail(row)
                            },
                            {
                                icon: () => h(NIcon, { component: EyeOutline }),
                                default: () => '详情'
                            }
                        )
                        // ,(row.status === 0 || row.status === 1) && h(
                        //     NPopconfirm,
                        //     {
                        //         onPositiveClick: () => handleCancel(row.id)
                        //     },
                        //     {
                        //         trigger: () =>
                        //             h(
                        //                 NButton,
                        //                 {
                        //                     size: 'small',
                        //                     type: 'error'
                        //                 },
                        //                 {
                        //                     icon: () => h(NIcon, { component: CloseCircleOutline }),
                        //                     default: () => '取消'
                        //                 }
                        //             ),
                        //         default: () => '确定要取消该订单吗？'
                        //     }
                        // )
                    ]
                }
            );
        }
    }
];

// 对话框显示状态
const showDetailModal = ref(false);
const currentOrder = ref(null);

// 获取订单列表
const fetchOrderList = async () => {
    loading.value = true;
    try {
        const params = {
            pageNum: searchParams.pageNum,
            pageSize: searchParams.pageSize
        };
        
        // 添加关键词搜索
        if (searchParams.keyWord) {
            params.keyWord = searchParams.keyWord;
        }
        
        // 添加状态筛选（status可以为0，所以需要判断是否为null/undefined）
        if (searchParams.status !== null && searchParams.status !== undefined) {
            params.status = searchParams.status;
        }
        
        // 添加日期范围筛选
        if (searchParams.startDate) {
            params.startDate = searchParams.startDate;
        }
        if (searchParams.endDate) {
            params.endDate = searchParams.endDate;
        }
        
        const res = await orderApi.getOrderList(params);
        
        if (res.code === 200) {
            orderList.value = res.data || [];
            // API返回的总数字段是count
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
    // 更新状态筛选
    searchParams.status = statusFilter.value;
    
    // 处理日期范围筛选
    if (dateRange.value && dateRange.value.length === 2) {
        // dateRange.value 是时间戳数组 [startTimestamp, endTimestamp]
        searchParams.startDate = new Date(dateRange.value[0]);
        searchParams.endDate = new Date(dateRange.value[1]);
    } else {
        searchParams.startDate = null;
        searchParams.endDate = null;
    }
    
    searchParams.pageNum = 1;
    paginationReactive.page = 1;
    fetchOrderList();
};

// 查看详情
const handleViewDetail = (row) => {
    currentOrder.value = row;
    showDetailModal.value = true;
};

// 取消订单
const handleCancel = (id) => {
    // TODO: 实现取消订单的API调用
    message.warning('取消订单功能待后端接口支持');
};

// 组件挂载时获取订单列表
onMounted(() => {
    fetchOrderList();
});
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>


<template>
    <n-card title="订单管理" :bordered="false">
        <template #header-extra>
            <n-tag type="warning" size="small">
                <template #icon>
                    <n-icon :component="ConstructOutline" />
                </template>
                开发中
            </n-tag>
        </template>

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
                :pagination="pagination"
                :bordered="false"
                :single-line="false"
            />
        </n-space>

        <!-- 订单详情对话框 -->
        <n-modal
            v-model:show="showDetailModal"
            preset="dialog"
            title="订单详情"
            style="width: 700px"
        >
            <n-descriptions v-if="currentOrder" label-placement="left" :column="2" bordered style="margin-top: 24px">
                <n-descriptions-item label="订单号">{{ currentOrder.orderNo }}</n-descriptions-item>
                <n-descriptions-item label="订单状态">
                    <n-tag :type="getStatusType(currentOrder.status)" size="small">
                        {{ getStatusText(currentOrder.status) }}
                    </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="用户名">{{ currentOrder.username }}</n-descriptions-item>
                <n-descriptions-item label="手机号">{{ currentOrder.phone }}</n-descriptions-item>
                <n-descriptions-item label="车辆名称">{{ currentOrder.carName }}</n-descriptions-item>
                <n-descriptions-item label="车辆品牌">{{ currentOrder.carBrand }}</n-descriptions-item>
                <n-descriptions-item label="租赁开始时间">{{ currentOrder.startTime }}</n-descriptions-item>
                <n-descriptions-item label="租赁结束时间">{{ currentOrder.endTime }}</n-descriptions-item>
                <n-descriptions-item label="租赁天数">{{ currentOrder.days }}天</n-descriptions-item>
                <n-descriptions-item label="日租金">¥{{ currentOrder.dailyPrice }}</n-descriptions-item>
                <n-descriptions-item label="总金额" :span="2">
                    <n-text type="error" strong style="font-size: 18px">¥{{ currentOrder.totalAmount }}</n-text>
                </n-descriptions-item>
                <n-descriptions-item label="创建时间">{{ currentOrder.createTime }}</n-descriptions-item>
                <n-descriptions-item label="更新时间">{{ currentOrder.updateTime }}</n-descriptions-item>
                <n-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '无' }}</n-descriptions-item>
            </n-descriptions>

            <template #action>
                <n-button @click="showDetailModal = false">关闭</n-button>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup>
import { ref, reactive, h, computed } from 'vue';
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
    NText
} from 'naive-ui';
import {
    SearchOutline,
    EyeOutline,
    CloseCircleOutline,
    ConstructOutline,
    ReceiptOutline,
    TimeOutline,
    CheckmarkCircleOutline,
    CheckmarkDoneCircleOutline
} from '@vicons/ionicons5';

const message = useMessage();

// 搜索关键词
const searchKeyword = ref('');
const statusFilter = ref(null);
const dateRange = ref(null);

// 模拟订单数据
const mockOrderData = [
    {
        id: 1,
        orderNo: 'ORD20240116001',
        username: '张三',
        phone: '13800138000',
        carName: '奔驰E300L',
        carBrand: '奔驰',
        startTime: '2024-01-20 09:00',
        endTime: '2024-01-25 18:00',
        days: 5,
        dailyPrice: 599,
        totalAmount: 2995,
        status: 1, // 0=待支付, 1=已支付/进行中, 2=已完成, 3=已取消
        remark: '',
        createTime: '2024-01-16 10:30:00',
        updateTime: '2024-01-16 10:30:00'
    },
    {
        id: 2,
        orderNo: 'ORD20240116002',
        username: '李四',
        phone: '13900139000',
        carName: '宝马5系',
        carBrand: '宝马',
        startTime: '2024-01-18 10:00',
        endTime: '2024-01-20 18:00',
        days: 2,
        dailyPrice: 699,
        totalAmount: 1398,
        status: 2,
        remark: '提前还车',
        createTime: '2024-01-16 11:20:00',
        updateTime: '2024-01-20 18:30:00'
    },
    {
        id: 3,
        orderNo: 'ORD20240116003',
        username: '王五',
        phone: '13700137000',
        carName: '特斯拉Model 3',
        carBrand: '特斯拉',
        startTime: '2024-01-22 14:00',
        endTime: '2024-01-25 14:00',
        days: 3,
        dailyPrice: 499,
        totalAmount: 1497,
        status: 0,
        remark: '',
        createTime: '2024-01-16 14:15:00',
        updateTime: '2024-01-16 14:15:00'
    },
    {
        id: 4,
        orderNo: 'ORD20240116004',
        username: '赵六',
        phone: '13600136000',
        carName: '理想L9',
        carBrand: '理想',
        startTime: '2024-01-17 09:00',
        endTime: '2024-01-24 09:00',
        days: 7,
        dailyPrice: 799,
        totalAmount: 5593,
        status: 1,
        remark: '长期租赁',
        createTime: '2024-01-16 15:00:00',
        updateTime: '2024-01-17 09:30:00'
    },
    {
        id: 5,
        orderNo: 'ORD20240116005',
        username: '孙七',
        phone: '13500135000',
        carName: '别克GL8',
        carBrand: '别克',
        startTime: '2024-01-19 08:00',
        endTime: '2024-01-21 20:00',
        days: 2,
        dailyPrice: 599,
        totalAmount: 1198,
        status: 3,
        remark: '用户取消',
        createTime: '2024-01-16 16:45:00',
        updateTime: '2024-01-18 10:00:00'
    }
];

// 订单列表
const orderList = ref([...mockOrderData]);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: mockOrderData.length,
    showSizePicker: true,
    pageSizes: [10, 20, 50]
});

// 状态选项
const statusOptions = [
    { label: '全部', value: null },
    { label: '待支付', value: 0 },
    { label: '进行中', value: 1 },
    { label: '已完成', value: 2 },
    { label: '已取消', value: 3 }
];

// 统计数据
const statistics = computed(() => {
    return {
        total: orderList.value.length,
        pending: orderList.value.filter(o => o.status === 0).length,
        ongoing: orderList.value.filter(o => o.status === 1).length,
        completed: orderList.value.filter(o => o.status === 2).length
    };
});

// 获取状态文本
const getStatusText = (status) => {
    const map = { 0: '待支付', 1: '进行中', 2: '已完成', 3: '已取消' };
    return map[status] || '未知';
};

// 获取状态类型
const getStatusType = (status) => {
    const map = { 0: 'warning', 1: 'info', 2: 'success', 3: 'default' };
    return map[status] || 'default';
};

// 表格列配置
const columns = [
    {
        title: 'ID',
        key: 'id',
        width: 60
    },
    {
        title: '订单号',
        key: 'orderNo',
        width: 160
    },
    {
        title: '用户名',
        key: 'username',
        width: 100
    },
    {
        title: '手机号',
        key: 'phone',
        width: 130
    },
    {
        title: '车辆信息',
        key: 'carInfo',
        width: 180,
        render: (row) => `${row.carBrand} ${row.carName}`
    },
    {
        title: '租赁时间',
        key: 'rentalTime',
        width: 200,
        render: (row) => `${row.startTime} 至 ${row.endTime}`
    },
    {
        title: '天数',
        key: 'days',
        width: 80,
        render: (row) => `${row.days}天`
    },
    {
        title: '总金额',
        key: 'totalAmount',
        width: 100,
        render: (row) => h('span', { style: { color: '#d03050', fontWeight: 'bold' } }, `¥${row.totalAmount}`)
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
        width: 180
    },
    {
        title: '操作',
        key: 'actions',
        width: 180,
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
                        ),
                        row.status === 0 && h(
                            NPopconfirm,
                            {
                                onPositiveClick: () => handleCancel(row.id)
                            },
                            {
                                trigger: () =>
                                    h(
                                        NButton,
                                        {
                                            size: 'small',
                                            type: 'error'
                                        },
                                        {
                                            icon: () => h(NIcon, { component: CloseCircleOutline }),
                                            default: () => '取消'
                                        }
                                    ),
                                default: () => '确定要取消该订单吗？'
                            }
                        )
                    ]
                }
            );
        }
    }
];

// 对话框显示状态
const showDetailModal = ref(false);
const currentOrder = ref(null);

// 搜索
const handleSearch = () => {
    if (!searchKeyword.value) {
        orderList.value = [...mockOrderData];
        return;
    }
    orderList.value = mockOrderData.filter(order => 
        order.orderNo.includes(searchKeyword.value) || 
        order.username.includes(searchKeyword.value)
    );
    message.info(`搜索关键词: ${searchKeyword.value}`);
};

// 筛选变化
const handleFilterChange = () => {
    let filtered = [...mockOrderData];
    
    // 状态筛选
    if (statusFilter.value !== null) {
        filtered = filtered.filter(order => order.status === statusFilter.value);
    }
    
    // 日期范围筛选（这里只是模拟）
    if (dateRange.value && dateRange.value.length === 2) {
        message.info('日期筛选功能开发中');
    }
    
    orderList.value = filtered;
};

// 查看详情
const handleViewDetail = (row) => {
    currentOrder.value = row;
    showDetailModal.value = true;
};

// 取消订单
const handleCancel = (id) => {
    const order = orderList.value.find(o => o.id === id);
    if (order) {
        order.status = 3;
        order.remark = '管理员取消';
        order.updateTime = new Date().toLocaleString('zh-CN');
        message.success('订单已取消（模拟）');
    }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>


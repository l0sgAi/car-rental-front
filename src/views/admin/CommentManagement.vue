<template>
    <n-card title="评论管理" :bordered="false">
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
                            placeholder="搜索用户名、评论内容..."
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
                        placeholder="审核状态"
                        style="width: 150px"
                        @update:value="handleFilterChange"
                    />
                    <n-select
                        v-model:value="ratingFilter"
                        :options="ratingOptions"
                        placeholder="评分筛选"
                        style="width: 150px"
                        @update:value="handleFilterChange"
                    />
                </n-space>
            </n-space>

            <!-- 统计卡片 -->
            <n-grid :x-gap="16" :y-gap="16" :cols="4">
                <n-grid-item>
                    <n-statistic label="总评论数" :value="statistics.total">
                        <template #prefix>
                            <n-icon :component="ChatbubbleEllipsesOutline" size="24" color="#18a058" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="待审核" :value="statistics.pending">
                        <template #prefix>
                            <n-icon :component="TimeOutline" size="24" color="#f0a020" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="已通过" :value="statistics.approved">
                        <template #prefix>
                            <n-icon :component="CheckmarkCircleOutline" size="24" color="#18a058" />
                        </template>
                    </n-statistic>
                </n-grid-item>
                <n-grid-item>
                    <n-statistic label="已拒绝" :value="statistics.rejected">
                        <template #prefix>
                            <n-icon :component="CloseCircleOutline" size="24" color="#d03050" />
                        </template>
                    </n-statistic>
                </n-grid-item>
            </n-grid>

            <!-- 评论列表 -->
            <n-space vertical :size="12">
                <n-card
                    v-for="comment in commentList"
                    :key="comment.id"
                    :bordered="true"
                    size="small"
                    hoverable
                >
                    <template #header>
                        <n-space align="center" justify="space-between">
                            <n-space align="center">
                                <n-avatar
                                    :size="40"
                                    :src="comment.userAvatar"
                                    fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                    round
                                />
                                <div>
                                    <div style="font-weight: 600;">{{ comment.username }}</div>
                                    <n-space :size="8" style="margin-top: 4px;">
                                        <n-rate :value="comment.rating" readonly size="small" />
                                        <span style="font-size: 12px; color: #999;">{{ comment.createTime }}</span>
                                    </n-space>
                                </div>
                            </n-space>
                            <n-tag :type="getStatusType(comment.status)" size="small">
                                {{ getStatusText(comment.status) }}
                            </n-tag>
                        </n-space>
                    </template>

                    <n-space vertical :size="12">
                        <!-- 关联车辆信息 -->
                        <n-space align="center">
                            <n-icon :component="CarSportOutline" size="18" color="#18a058" />
                            <span style="color: #18a058; font-weight: 500;">{{ comment.carBrand }} {{ comment.carName }}</span>
                        </n-space>

                        <!-- 评论内容 -->
                        <div style="line-height: 1.6;">{{ comment.content }}</div>

                        <!-- 评论图片（如果有） -->
                        <n-space v-if="comment.images && comment.images.length > 0">
                            <n-image
                                v-for="(img, index) in comment.images"
                                :key="index"
                                :src="img"
                                width="100"
                                height="100"
                                object-fit="cover"
                                style="border-radius: 4px;"
                            />
                        </n-space>

                        <!-- 操作按钮 -->
                        <n-space>
                            <n-button
                                v-if="comment.status === 0"
                                type="success"
                                size="small"
                                @click="handleApprove(comment.id)"
                            >
                                <template #icon>
                                    <n-icon :component="CheckmarkCircleOutline" />
                                </template>
                                通过
                            </n-button>
                            <n-button
                                v-if="comment.status === 0"
                                type="error"
                                size="small"
                                @click="handleReject(comment.id)"
                            >
                                <template #icon>
                                    <n-icon :component="CloseCircleOutline" />
                                </template>
                                拒绝
                            </n-button>
                            <n-popconfirm @positive-click="handleDelete(comment.id)">
                                <template #trigger>
                                    <n-button type="error" size="small">
                                        <template #icon>
                                            <n-icon :component="TrashOutline" />
                                        </template>
                                        删除
                                    </n-button>
                                </template>
                                确定要删除这条评论吗？
                            </n-popconfirm>
                            <n-button
                                text
                                size="small"
                                @click="handleReply(comment)"
                            >
                                <template #icon>
                                    <n-icon :component="ChatbubbleOutline" />
                                </template>
                                回复
                            </n-button>
                        </n-space>

                        <!-- 管理员回复 -->
                        <div v-if="comment.reply" style="background: rgba(24, 160, 88, 0.1); padding: 12px; border-radius: 4px; margin-top: 8px;">
                            <div style="font-weight: 600; color: #18a058; margin-bottom: 4px;">
                                <n-icon :component="PersonOutline" size="14" style="margin-right: 4px;" />
                                管理员回复：
                            </div>
                            <div style="color: #666;">{{ comment.reply }}</div>
                        </div>
                    </n-space>
                </n-card>

                <!-- 分页 -->
                <n-pagination
                    v-model:page="pagination.page"
                    v-model:page-size="pagination.pageSize"
                    :item-count="pagination.itemCount"
                    :page-sizes="pagination.pageSizes"
                    show-size-picker
                />
            </n-space>
        </n-space>

        <!-- 回复对话框 -->
        <n-modal
            v-model:show="showReplyModal"
            preset="dialog"
            title="回复评论"
            style="width: 500px"
        >
            <n-input
                v-model:value="replyContent"
                type="textarea"
                placeholder="请输入回复内容..."
                :rows="4"
                style="margin-top: 16px"
            />
            <template #action>
                <n-space>
                    <n-button @click="showReplyModal = false">取消</n-button>
                    <n-button type="primary" @click="handleSubmitReply">
                        提交
                    </n-button>
                </n-space>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useMessage } from 'naive-ui';
import {
    NCard,
    NSpace,
    NInputGroup,
    NInput,
    NButton,
    NIcon,
    NTag,
    NPopconfirm,
    NModal,
    NSelect,
    NGrid,
    NGridItem,
    NStatistic,
    NAvatar,
    NRate,
    NImage,
    NPagination
} from 'naive-ui';
import {
    SearchOutline,
    ChatbubbleEllipsesOutline,
    ChatbubbleOutline,
    TrashOutline,
    ConstructOutline,
    TimeOutline,
    CheckmarkCircleOutline,
    CloseCircleOutline,
    CarSportOutline,
    PersonOutline
} from '@vicons/ionicons5';

const message = useMessage();

// 搜索关键词
const searchKeyword = ref('');
const statusFilter = ref(null);
const ratingFilter = ref(null);

// 模拟评论数据
const mockCommentData = [
    {
        id: 1,
        username: '张三',
        userAvatar: '',
        carName: '奔驰E300L',
        carBrand: '奔驰',
        rating: 5,
        content: '车况非常好，服务态度也很棒！强烈推荐！',
        images: [],
        status: 1, // 0=待审核, 1=已通过, 2=已拒绝
        reply: '感谢您的好评，期待下次为您服务！',
        createTime: '2024-01-16 10:30:00'
    },
    {
        id: 2,
        username: '李四',
        userAvatar: '',
        carName: '宝马5系',
        carBrand: '宝马',
        rating: 4,
        content: '整体不错，就是取车流程稍微有点繁琐，希望能简化一下。',
        images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
        status: 0,
        reply: '',
        createTime: '2024-01-16 11:20:00'
    },
    {
        id: 3,
        username: '王五',
        userAvatar: '',
        carName: '特斯拉Model 3',
        carBrand: '特斯拉',
        rating: 5,
        content: '电动车体验太棒了！安静又省钱，下次还会租！',
        images: [],
        status: 1,
        reply: '感谢支持，欢迎再次光临！',
        createTime: '2024-01-16 14:15:00'
    },
    {
        id: 4,
        username: '赵六',
        userAvatar: '',
        carName: '理想L9',
        carBrand: '理想',
        rating: 3,
        content: '车是好车，但是价格有点贵，性价比一般。',
        images: [],
        status: 2,
        reply: '',
        createTime: '2024-01-16 15:00:00'
    },
    {
        id: 5,
        username: '孙七',
        userAvatar: '',
        carName: '别克GL8',
        carBrand: '别克',
        rating: 5,
        content: '商务接待首选！空间大，舒适度高，客户都很满意。',
        images: ['https://via.placeholder.com/100'],
        status: 0,
        reply: '',
        createTime: '2024-01-16 16:45:00'
    },
    {
        id: 6,
        username: '周八',
        userAvatar: '',
        carName: '奥迪A6L',
        carBrand: '奥迪',
        rating: 4,
        content: '豪华舒适，驾驶体验很好，就是油耗有点高。',
        images: [],
        status: 1,
        reply: '感谢您的评价，我们会继续努力提供更好的服务！',
        createTime: '2024-01-16 17:30:00'
    }
];

// 评论列表
const commentList = ref([...mockCommentData]);

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 5,
    itemCount: mockCommentData.length,
    pageSizes: [5, 10, 20]
});

// 状态选项
const statusOptions = [
    { label: '全部', value: null },
    { label: '待审核', value: 0 },
    { label: '已通过', value: 1 },
    { label: '已拒绝', value: 2 }
];

// 评分选项
const ratingOptions = [
    { label: '全部评分', value: null },
    { label: '5星', value: 5 },
    { label: '4星', value: 4 },
    { label: '3星', value: 3 },
    { label: '2星', value: 2 },
    { label: '1星', value: 1 }
];

// 统计数据
const statistics = computed(() => {
    return {
        total: commentList.value.length,
        pending: commentList.value.filter(c => c.status === 0).length,
        approved: commentList.value.filter(c => c.status === 1).length,
        rejected: commentList.value.filter(c => c.status === 2).length
    };
});

// 回复对话框
const showReplyModal = ref(false);
const replyContent = ref('');
const currentComment = ref(null);

// 获取状态文本
const getStatusText = (status) => {
    const map = { 0: '待审核', 1: '已通过', 2: '已拒绝' };
    return map[status] || '未知';
};

// 获取状态类型
const getStatusType = (status) => {
    const map = { 0: 'warning', 1: 'success', 2: 'error' };
    return map[status] || 'default';
};

// 搜索
const handleSearch = () => {
    if (!searchKeyword.value) {
        commentList.value = [...mockCommentData];
        return;
    }
    commentList.value = mockCommentData.filter(comment => 
        comment.username.includes(searchKeyword.value) || 
        comment.content.includes(searchKeyword.value)
    );
    message.info(`搜索关键词: ${searchKeyword.value}`);
};

// 筛选变化
const handleFilterChange = () => {
    let filtered = [...mockCommentData];
    
    // 状态筛选
    if (statusFilter.value !== null) {
        filtered = filtered.filter(comment => comment.status === statusFilter.value);
    }
    
    // 评分筛选
    if (ratingFilter.value !== null) {
        filtered = filtered.filter(comment => comment.rating === ratingFilter.value);
    }
    
    commentList.value = filtered;
    pagination.itemCount = filtered.length;
};

// 通过评论
const handleApprove = (id) => {
    const comment = commentList.value.find(c => c.id === id);
    if (comment) {
        comment.status = 1;
        message.success('评论已通过（模拟）');
    }
};

// 拒绝评论
const handleReject = (id) => {
    const comment = commentList.value.find(c => c.id === id);
    if (comment) {
        comment.status = 2;
        message.warning('评论已拒绝（模拟）');
    }
};

// 删除评论
const handleDelete = (id) => {
    const index = commentList.value.findIndex(c => c.id === id);
    if (index > -1) {
        commentList.value.splice(index, 1);
        pagination.itemCount = commentList.value.length;
        message.success('评论已删除（模拟）');
    }
};

// 回复评论
const handleReply = (comment) => {
    currentComment.value = comment;
    replyContent.value = comment.reply || '';
    showReplyModal.value = true;
};

// 提交回复
const handleSubmitReply = () => {
    if (!replyContent.value.trim()) {
        message.warning('请输入回复内容');
        return;
    }
    
    if (currentComment.value) {
        currentComment.value.reply = replyContent.value;
        message.success('回复成功（模拟）');
        showReplyModal.value = false;
    }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>


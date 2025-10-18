<template>
    <n-config-provider :theme="darkTheme">
        <n-card title="评论管理" :bordered="false" class="comment-management">
            <!-- 搜索和筛选栏 -->
            <n-space vertical :size="20">
                <n-space justify="space-between">
                    <n-input-group>
                        <n-input
                            v-model:value="searchKeyword"
                            placeholder="搜索用户名、车辆名称、评论内容..."
                            clearable
                            style="width: 350px"
                            @keyup.enter="handleSearch"
                        >
                            <template #prefix>
                                <n-icon :component="SearchOutline" />
                            </template>
                        </n-input>
                        <n-button type="primary" @click="handleSearch" :loading="loading">
                            搜索
                        </n-button>
                    </n-input-group>
                    <n-button @click="handleRefresh" :loading="loading">
                        <template #icon>
                            <n-icon :component="RefreshOutline" />
                        </template>
                        刷新
                    </n-button>
                </n-space>

                <!-- 统计卡片 -->
                <n-grid :x-gap="16" :y-gap="16" :cols="4" responsive="screen">
                    <n-grid-item>
                        <n-card size="small" hoverable>
                            <n-statistic label="总评论数" :value="statistics.total">
                                <template #prefix>
                                    <n-icon :component="ChatbubbleEllipsesOutline" size="24" color="#18a058" />
                                </template>
                            </n-statistic>
                        </n-card>
                    </n-grid-item>
                    <!-- <n-grid-item>
                        <n-card size="small" hoverable>
                            <n-statistic label="租户评论" :value="statistics.tenant">
                                <template #prefix>
                                    <n-icon :component="PersonOutline" size="24" color="#2080f0" />
                                </template>
                            </n-statistic>
                        </n-card>
                    </n-grid-item>
                    <n-grid-item>
                        <n-card size="small" hoverable>
                            <n-statistic label="有回复评论" :value="statistics.replied">
                                <template #prefix>
                                    <n-icon :component="CheckmarkCircleOutline" size="24" color="#18a058" />
                                </template>
                            </n-statistic>
                        </n-card>
                    </n-grid-item>
                    <n-grid-item>
                        <n-card size="small" hoverable>
                            <n-statistic label="总点赞数" :value="statistics.totalLikes">
                                <template #prefix>
                                    <n-icon :component="HeartOutline" size="24" color="#d03050" />
                                </template>
                            </n-statistic>
                        </n-card>
                    </n-grid-item> -->
                </n-grid>

                <!-- 评论列表 -->
                <n-spin :show="loading">
                    <n-space vertical :size="12">
                        <n-empty 
                            v-if="commentList.length === 0 && !loading" 
                            description="暂无评论数据"
                            size="large"
                            style="padding: 60px 0"
                        >
                            <template #icon>
                                <n-icon :component="ChatbubbleEllipsesOutline" size="48" />
                            </template>
                        </n-empty>

                        <n-card
                            v-for="comment in commentList"
                            :key="comment.id"
                            :bordered="true"
                            size="small"
                            hoverable
                            class="comment-card"
                        >
                            <template #header>
                                <n-space align="center" justify="space-between">
                                    <n-space align="center">
                                        <n-avatar
                                            :size="40"
                                            :src="comment.avatar"
                                            fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                            round
                                        />
                                        <div>
                                            <n-space :size="8" align="center">
                                                <div style="font-weight: 600; font-size: 15px;">
                                                    {{ comment.username || '匿名用户' }}
                                                </div>
                                                <n-tag 
                                                    :type="getUserTypeTagType(comment.userType)" 
                                                    size="tiny"
                                                    round
                                                >
                                                    {{ getUserTypeText(comment.userType) }}
                                                </n-tag>
                                            </n-space>
                                            <n-space :size="8" style="margin-top: 4px;">
                                                <n-rate 
                                                    v-if="comment.score" 
                                                    :value="comment.score" 
                                                    readonly 
                                                    size="small" 
                                                />
                                                <span v-else style="font-size: 12px; color: #999;">
                                                    未评分
                                                </span>
                                                <span style="font-size: 12px; color: #999;">
                                                    {{ formatTime(comment.createTime) }}
                                                </span>
                                            </n-space>
                                        </div>
                                    </n-space>
                                    <n-space :size="8">
                                        <n-tag 
                                            v-if="comment.parentCommentId && comment.parentCommentId !== 0" 
                                            type="info" 
                                            size="small"
                                        >
                                            <template #icon>
                                                <n-icon :component="ReturnDownForwardOutline" />
                                            </template>
                                            回复评论
                                        </n-tag>
                                        <n-tag type="default" size="small">
                                            <template #icon>
                                                <n-icon :component="HeartOutline" />
                                            </template>
                                            {{ comment.likeCount || 0 }}
                                        </n-tag>
                                    </n-space>
                                </n-space>
                            </template>

                            <n-space vertical :size="12">
                                <!-- 关联车辆信息 -->
                                <n-space align="center" v-if="comment.carName">
                                    <n-icon :component="CarSportOutline" size="18" color="#18a058" />
                                    <span style="color: #18a058; font-weight: 500;">
                                        {{ comment.carName }}
                                    </span>
                                </n-space>

                                <!-- 评论内容 -->
                                <div style="line-height: 1.8; font-size: 14px; color: #d1d5db;">
                                    <n-icon 
                                        v-if="comment.parentCommentId && comment.parentCommentId !== 0"
                                        :component="ReturnDownForwardOutline" 
                                        size="14" 
                                        style="margin-right: 4px; color: #2080f0;"
                                    />
                                    {{ comment.content || '暂无评论内容' }}
                                </div>

                                <!-- 操作按钮 -->
                                <n-space style="margin-top: 8px;">
                                    <n-button
                                        type="primary"
                                        size="small"
                                        @click="handleReply(comment)"
                                    >
                                        <template #icon>
                                            <n-icon :component="ChatbubbleOutline" />
                                        </template>
                                        回复
                                    </n-button>
                                    <n-popconfirm 
                                        @positive-click="handleDelete(comment.id)"
                                        negative-text="取消"
                                        positive-text="确定删除"
                                    >
                                        <template #trigger>
                                            <n-button type="error" size="small">
                                                <template #icon>
                                                    <n-icon :component="TrashOutline" />
                                                </template>
                                                删除
                                            </n-button>
                                        </template>
                                        确定要删除这条评论吗？删除后无法恢复。
                                    </n-popconfirm>
                                </n-space>
                            </n-space>
                        </n-card>

                        <!-- 分页 -->
                        <n-pagination
                            v-if="commentList.length > 0"
                            v-model:page="pagination.page"
                            v-model:page-size="pagination.pageSize"
                            :item-count="pagination.total"
                            :page-sizes="[10, 20, 30, 50]"
                            show-size-picker
                            @update:page="handlePageChange"
                            @update:page-size="handlePageSizeChange"
                            style="justify-content: center; margin-top: 20px;"
                        />
                    </n-space>
                </n-spin>
            </n-space>

            <!-- 回复对话框 -->
            <n-modal
                v-model:show="showReplyModal"
                preset="card"
                title="回复评论"
                style="width: 600px; max-width: 90vw;"
                :bordered="false"
                :segmented="{
                    content: true,
                    footer: 'soft'
                }"
            >
                <n-space vertical :size="16">
                    <n-alert type="info" :bordered="false">
                        <template #icon>
                            <n-icon :component="InformationCircleOutline" />
                        </template>
                        回复给用户：<strong>{{ currentComment?.username || '匿名用户' }}</strong>
                        <n-tag 
                            :type="getUserTypeTagType(currentComment?.userType)" 
                            size="tiny"
                            round
                            style="margin-left: 8px;"
                        >
                            {{ getUserTypeText(currentComment?.userType) }}
                        </n-tag>
                    </n-alert>

                    <div v-if="currentComment?.carName">
                        <div style="margin-bottom: 8px; color: #999; font-size: 13px;">关联车辆：</div>
                        <div style="padding: 8px 12px; background: rgba(24, 160, 88, 0.1); border-radius: 4px; color: #18a058; font-weight: 500;">
                            <n-icon :component="CarSportOutline" size="16" style="margin-right: 6px;" />
                            {{ currentComment.carName }}
                        </div>
                    </div>

                    <div>
                        <div style="margin-bottom: 8px; color: #999; font-size: 13px;">原评论内容：</div>
                        <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 4px; line-height: 1.6;">
                            {{ currentComment?.content }}
                        </div>
                        <div v-if="currentComment?.score" style="margin-top: 8px;">
                            <n-rate :value="currentComment.score" readonly size="small" />
                            <span style="margin-left: 8px; color: #999; font-size: 13px;">
                                {{ currentComment.score }} 分
                            </span>
                        </div>
                    </div>

                    <div>
                        <div style="margin-bottom: 8px; color: #999; font-size: 13px;">回复内容：</div>
                        <n-input
                            v-model:value="replyForm.content"
                            type="textarea"
                            placeholder="请输入回复内容..."
                            :rows="5"
                            :maxlength="500"
                            show-count
                        />
                    </div>
                </n-space>

                <template #footer>
                    <n-space justify="end">
                        <n-button @click="showReplyModal = false">取消</n-button>
                        <n-button 
                            type="primary" 
                            @click="handleSubmitReply"
                            :loading="submitting"
                        >
                            提交回复
                        </n-button>
                    </n-space>
                </template>
            </n-modal>
        </n-card>
    </n-config-provider>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { darkTheme, useMessage } from 'naive-ui';
import {
    NConfigProvider,
    NCard,
    NSpace,
    NInputGroup,
    NInput,
    NButton,
    NIcon,
    NTag,
    NPopconfirm,
    NModal,
    NGrid,
    NGridItem,
    NStatistic,
    NAvatar,
    NRate,
    NPagination,
    NSpin,
    NEmpty,
    NAlert
} from 'naive-ui';
import {
    SearchOutline,
    ChatbubbleEllipsesOutline,
    ChatbubbleOutline,
    TrashOutline,
    CheckmarkCircleOutline,
    CarSportOutline,
    PersonOutline,
    RefreshOutline,
    InformationCircleOutline,
    HeartOutline,
    ReturnDownForwardOutline
} from '@vicons/ionicons5';
import { commentApi } from '@/api';

const message = useMessage();

// 加载状态
const loading = ref(false);
const submitting = ref(false);

// 搜索关键词
const searchKeyword = ref('');

// 评论列表
const commentList = ref([]);

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
});

// 统计数据
const statistics = computed(() => {
    const total = pagination.total;
    // 统计租户评论数（userType === 1）
    const tenant = commentList.value.filter(c => c.userType === 1).length;
    // 统计有回复的评论（parentCommentId !== 0）
    const replied = commentList.value.filter(c => c.parentCommentId && c.parentCommentId !== 0).length;
    // 统计总点赞数
    const totalLikes = commentList.value.reduce((sum, c) => sum + (c.likeCount || 0), 0);
    
    return {
        total,
        tenant,
        replied,
        totalLikes
    };
});

// 回复对话框
const showReplyModal = ref(false);
const currentComment = ref(null);
const replyForm = reactive({
    content: ''
});

// 获取用户类型文本
const getUserTypeText = (userType) => {
    const map = {
        0: '未租过',
        1: '租户',
        2: '管理员'
    };
    return map[userType] || '未知';
};

// 获取用户类型标签类型
const getUserTypeTagType = (userType) => {
    const map = {
        0: 'default',
        1: 'success',
        2: 'info'
    };
    return map[userType] || 'default';
};

// 格式化时间
const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取评论列表
const fetchCommentList = async () => {
    loading.value = true;
    try {
        const params = {
            pageNum: pagination.page,
            pageSize: pagination.pageSize
        };
        
        // 如果有搜索关键词，添加到参数中
        if (searchKeyword.value) {
            params.keyWord = searchKeyword.value;
        }
        
        const response = await commentApi.getCommentList(params);
        
        if (response.code === 200) {
            commentList.value = response.data || [];
            // API返回的总数字段是count，不是total
            pagination.total = response.count || 0;
        } else {
            message.error(response.message || response.msg || '获取评论列表失败');
        }
    } catch (error) {
        console.error('获取评论列表失败:', error);
        message.error(error.message || '获取评论列表失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    pagination.page = 1; // 重置到第一页
    fetchCommentList();
};

// 刷新
const handleRefresh = () => {
    searchKeyword.value = '';
    pagination.page = 1;
    fetchCommentList();
};

// 分页变化
const handlePageChange = (page) => {
    pagination.page = page;
    fetchCommentList();
};

// 分页大小变化
const handlePageSizeChange = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    fetchCommentList();
};

// 回复评论
const handleReply = (comment) => {
    currentComment.value = comment;
    replyForm.content = '';
    showReplyModal.value = true;
};

// 提交回复
const handleSubmitReply = async () => {
    if (!replyForm.content.trim()) {
        message.warning('请输入回复内容');
        return;
    }
    
    submitting.value = true;
    try {
        const data = {
            id: null, // 新增回复时为null
            userId: currentComment.value.userId, // 被回复用户的ID
            carId: currentComment.value.carId, // 车辆ID
            parentCommentId: currentComment.value.parentCommentId === 0 
                ? currentComment.value.id 
                : currentComment.value.parentCommentId, // 父评论ID（顶级评论的ID）
            followCommentId: currentComment.value.id, // 回复的评论ID（当前评论的ID）
            content: replyForm.content, // 回复内容
            score: null // 回复评论不需要评分
        };
        
        const response = await commentApi.addComment(data);
        
        if (response.code === 200) {
            message.success('回复成功');
            showReplyModal.value = false;
            replyForm.content = '';
            currentComment.value = null;
            // 刷新评论列表
            fetchCommentList();
        } else {
            message.error(response.msg || '回复失败');
        }
    } catch (error) {
        console.error('回复失败:', error);
        message.error(error.message || '回复失败，请稍后重试');
    } finally {
        submitting.value = false;
    }
};

// 删除评论
const handleDelete = async (id) => {
    try {
        const response = await commentApi.deleteComment(id);
        
        if (response.code === 200) {
            message.success('删除成功');
            // 如果当前页只有一条数据且不是第一页，则返回上一页
            if (commentList.value.length === 1 && pagination.page > 1) {
                pagination.page--;
            }
            fetchCommentList();
        } else {
            message.error(response.msg || '删除失败');
        }
    } catch (error) {
        console.error('删除失败:', error);
        message.error(error.message || '删除失败，请稍后重试');
    }
};

// 组件挂载时加载数据
onMounted(() => {
    fetchCommentList();
});
</script>

<style scoped>
.comment-management {
    min-height: 100vh;
}

.comment-card {
    transition: all 0.3s ease;
}

.comment-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.n-statistic .n-statistic-value__content) {
    font-size: 28px;
    font-weight: 600;
}

:deep(.n-card-header) {
    padding: 16px 20px;
}

:deep(.n-pagination) {
    margin-top: 24px;
}
</style>

<template>
    <n-config-provider :theme="darkTheme">
        <div class="car-detail-container">
            <!-- 顶部导航栏 -->
            <n-layout-header class="header" bordered>
                <div class="header-content">
                    <div class="back-button">
                        <n-button @click="goBack" text>
                            <template #icon>
                                <n-icon size="24" :component="ArrowBackOutline" />
                            </template>
                        </n-button>
                        <span class="header-title">车辆详情</span>
                    </div>
                </div>
            </n-layout-header>

            <!-- 主体内容 -->
            <n-layout-content class="detail-content">
                <n-spin :show="isLoading" size="large">
                    <div v-if="carDetail">
                        <!-- 车辆信息卡片 -->
                        <n-card :bordered="false" class="car-info-card">
                            <div class="car-info-layout">
                                <!-- 图片展示区域 -->
                                <div class="image-section">
                                    <div class="main-image">
                                        <n-image 
                                            :src="currentImage" 
                                            :alt="carDetail.name"
                                            object-fit="cover"
                                            :preview-src="currentImage"
                                        />
                                    </div>
                                    <div class="thumbnail-list" v-if="imageList.length > 1">
                                        <div 
                                            v-for="(img, index) in imageList" 
                                            :key="index"
                                            class="thumbnail-item"
                                            :class="{ active: currentImageIndex === index }"
                                            @click="currentImageIndex = index"
                                        >
                                            <img :src="img" :alt="`${carDetail.name} ${index + 1}`" />
                                        </div>
                                    </div>
                                </div>

                                <!-- 车辆信息区域 -->
                                <div class="info-section">
                                    <div>
                                        <h1 class="car-title">{{ carDetail.name }}</h1>
                                        <div class="car-subtitle">
                                            <n-tag type="success" size="small" :bordered="false">{{ carDetail.carType }}</n-tag>
                                            <n-tag type="info" size="small" :bordered="false">{{ carDetail.powerType }}</n-tag>
                                            <n-rate 
                                                :value="carRating" 
                                                :allow-half="true" 
                                                readonly 
                                                size="small" 
                                            />
                                            <span>{{ carRating.toFixed(1) }}分</span>
                                        </div>
                                    </div>

                                    <div class="price-section">
                                        <div class="price-label">租赁价格</div>
                                        <div class="price-value">
                                            <span>¥</span>
                                            <span>{{ carDetail.dailyRent }}</span>
                                            <span class="price-unit">/天</span>
                                        </div>
                                        <n-button 
                                            type="warning" 
                                            size="large" 
                                            class="rent-button"
                                            @click="handleRent"
                                        >
                                            <template #icon>
                                                <n-icon :component="CartOutline" />
                                            </template>
                                            马上租
                                        </n-button>
                                    </div>

                                    <div class="specs-grid">
                                        <div class="spec-item">
                                            <div class="spec-label">
                                                <n-icon :component="SpeedometerOutline" />
                                                油耗
                                            </div>
                                            <div class="spec-value">{{ carDetail.fuelConsumption || 0 }} L/100km</div>
                                        </div>
                                        <div class="spec-item">
                                            <div class="spec-label">
                                                <n-icon :component="PeopleOutline" />
                                                座位数
                                            </div>
                                            <div class="spec-value">{{ carDetail.seat }}座</div>
                                        </div>
                                        <div class="spec-item">
                                            <div class="spec-label">
                                                <n-icon :component="FlameOutline" />
                                                热度评分
                                            </div>
                                            <div class="spec-value">{{ carDetail.hotScore || 0 }}</div>
                                        </div>
                                        <div class="spec-item">
                                            <div class="spec-label">
                                                <n-icon :component="CalendarOutline" />
                                                最小租期
                                            </div>
                                            <div class="spec-value">{{ carDetail.minRentalDays }}天</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </n-card>

                        <!-- 详细参数卡片 -->
                        <n-card :bordered="false" class="params-card">
                            <h2 class="section-title">
                                <n-icon :component="InformationCircleOutline" size="28" color="#18a058" />
                                详细参数
                            </h2>
                            <div class="params-grid">
                                <div class="param-item">
                                    <div class="param-label">车牌号</div>
                                    <div class="param-value">{{ carDetail.number || '未设置' }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">车型</div>
                                    <div class="param-value">{{ carDetail.carType }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">动力类型</div>
                                    <div class="param-value">{{ carDetail.powerType }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">座位数</div>
                                    <div class="param-value">{{ carDetail.seat }}座</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">日租金</div>
                                    <div class="param-value">¥{{ carDetail.dailyRent }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">最小租期</div>
                                    <div class="param-value">{{ carDetail.minRentalDays }}天</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">购买日期</div>
                                    <div class="param-value">{{ formatDate(carDetail.purchaseTime) }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">马力</div>
                                    <div class="param-value">{{ carDetail.horsepower || 0 }}马力</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">最大扭矩</div>
                                    <div class="param-value">{{ carDetail.torque || 0 }}N·m</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">百公里油耗</div>
                                    <div class="param-value">{{ carDetail.fuelConsumption || 0 }}L</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">理论续航</div>
                                    <div class="param-value">{{ carDetail.endurance || 0 }}km</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">车身尺寸</div>
                                    <div class="param-value">{{ carDetail.size || '未知' }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">车重</div>
                                    <div class="param-value">{{ carDetail.weight || 0 }}kg</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">储物容积</div>
                                    <div class="param-value">{{ carDetail.volume || 0 }}L</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">百公里加速</div>
                                    <div class="param-value">{{ carDetail.acceleration || 0 }}s</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">综合评分</div>
                                    <div class="param-value">{{ carRating.toFixed(1) }}分</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">热度评分</div>
                                    <div class="param-value">{{ carDetail.hotScore || 0 }}</div>
                                </div>
                                <div class="param-item">
                                    <div class="param-label">车辆状态</div>
                                    <div class="param-value">
                                        <n-tag :type="carDetail.status === 0 ? 'success' : 'error'" size="small">
                                            {{ carDetail.status === 0 ? '可租' : '不可租' }}
                                        </n-tag>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 车辆描述 -->
                            <div v-if="carDetail.description" class="car-description">
                                <h3 class="description-title">车辆描述</h3>
                                <p class="description-text">{{ carDetail.description }}</p>
                            </div>
                        </n-card>

                        <!-- 评论区 -->
                        <n-card :bordered="false" class="comment-section">
                            <div class="comment-header">
                                <div>
                                    <h2 class="section-title" style="margin: 0;">
                                        <n-icon :component="ChatbubblesOutline" size="28" color="#18a058" />
                                        用户评价
                                        <span class="comment-count">({{ totalComments }}条评论)</span>
                                    </h2>
                                </div>
                            </div>

                            <!-- 发布评论 -->
                            <div class="post-comment">
                                <n-input
                                    v-model:value="newComment.content"
                                    type="textarea"
                                    placeholder="分享你的用车体验..."
                                    :autosize="{
                                        minRows: 3,
                                        maxRows: 6
                                    }"
                                    :maxlength="500"
                                    show-count
                                />
                                <div class="post-actions">
                                    <!-- <div>
                                        <span class="post-tip">评分：</span>
                                        <n-rate 
                                            v-model:value="newComment.score" 
                                            :allow-half="true"
                                            size="medium"
                                        />
                                    </div> -->
                                    <n-button 
                                        type="primary" 
                                        @click="handlePostComment"
                                        :loading="isPostingComment"
                                        :disabled="!newComment.content.trim()"
                                    >
                                        <template #icon>
                                            <n-icon :component="SendOutline" />
                                        </template>
                                        发表评论
                                    </n-button>
                                </div>
                                <div class="post-tip" style="margin-top: 8px; font-size: 12px;">
                                    <n-icon :component="InformationCircleOutline" size="14" />
                                    评论发布后将由AI审核，审核通过后即可显示
                                </div>
                            </div>

                            <!-- 评论列表 -->
                            <div class="comment-list" v-if="commentList.length > 0">
                                <div 
                                    v-for="comment in commentList" 
                                    :key="comment.id"
                                    class="comment-item"
                                >
                                    <div class="comment-main">
                                        <div class="comment-avatar">
                                            <n-avatar
                                                :size="48"
                                                :src="comment.avatar"
                                                fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                                round
                                            />
                                        </div>
                                        <div class="comment-content-wrapper">
                                            <div class="comment-header-info">
                                                <span class="comment-username">{{ comment.username }}</span>
                                                <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                                                <n-tag 
                                                    v-if="comment.userType === 1" 
                                                    type="success" 
                                                    size="small"
                                                    :bordered="false"
                                                >
                                                    租户
                                                </n-tag>
                                                <n-tag 
                                                    v-else-if="comment.userType === 2" 
                                                    type="warning" 
                                                    size="small"
                                                    :bordered="false"
                                                >
                                                    管理员
                                                </n-tag>
                                            </div>
                                            <div class="comment-rating" v-if="comment.score">
                                                <n-rate 
                                                    :value="comment.score / 2" 
                                                    :allow-half="true" 
                                                    readonly 
                                                    size="small"
                                                />
                                                <span class="rating-text">{{ (comment.score / 2).toFixed(1) }}分</span>
                                            </div>
                                            <div class="comment-text">{{ comment.content }}</div>
                                            <div class="comment-actions">
                                                <button 
                                                    class="comment-action-btn"
                                                    @click="handleReplyClick(comment)"
                                                >
                                                    <n-icon :component="ChatbubbleOutline" size="16" />
                                                    回复
                                                </button>
                                                <button class="comment-action-btn" v-if="comment.likeCount > 0">
                                                    <n-icon :component="HeartOutline" size="16" />
                                                    {{ comment.likeCount }}
                                                </button>
                                            </div>

                                            <!-- 回复区域 -->
                                            <div class="reply-section" v-if="comment.replyList && comment.replyList.length > 0">
                                                <div class="reply-list">
                                                    <div 
                                                        v-for="(reply, index) in getVisibleReplies(comment)" 
                                                        :key="reply.id"
                                                        class="reply-item"
                                                    >
                                                        <div class="reply-avatar">
                                                            <n-avatar
                                                                :size="32"
                                                                :src="reply.avatar"
                                                                fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                                                round
                                                            />
                                                        </div>
                                                        <div class="reply-content">
                                                            <div class="reply-header">
                                                                <span class="reply-username">{{ reply.username }}</span>
                                                                <span class="reply-time">{{ formatTime(reply.createTime) }}</span>
                                                            </div>
                                                            <div class="reply-text">{{ reply.content }}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- 查看更多回复按钮 -->
                                                <div class="load-more-replies" v-if="shouldShowLoadMore(comment)">
                                                    <n-button 
                                                        text 
                                                        type="primary"
                                                        @click="handleLoadMoreReplies(comment)"
                                                        :loading="comment.isLoadingReplies"
                                                    >
                                                        <template #icon>
                                                            <n-icon :component="ChevronDownOutline" />
                                                        </template>
                                                        查看更多回复 ({{ comment.replyCount - getVisibleReplies(comment).length }})
                                                    </n-button>
                                                </div>
                                            </div>

                                            <!-- 回复输入框 -->
                                            <div class="reply-input-section" v-if="replyingCommentId === comment.id">
                                                <n-input
                                                    v-model:value="replyContent"
                                                    type="textarea"
                                                    :placeholder="`回复 ${comment.username}...`"
                                                    :autosize="{
                                                        minRows: 2,
                                                        maxRows: 4
                                                    }"
                                                    :maxlength="200"
                                                    show-count
                                                />
                                                <div class="reply-input-actions">
                                                    <n-button size="small" @click="cancelReply">取消</n-button>
                                                    <n-button 
                                                        type="primary" 
                                                        size="small"
                                                        @click="handlePostReply(comment)"
                                                        :loading="isPostingReply"
                                                        :disabled="!replyContent.trim()"
                                                    >
                                                        发送
                                                    </n-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 空状态 -->
                            <div class="empty-state" v-else-if="!isLoadingComments">
                                <n-icon :component="ChatbubblesOutline" size="64" color="rgba(255, 255, 255, 0.2)" />
                                <div class="empty-state-text">暂无评论，快来发表第一条评论吧~</div>
                            </div>

                            <!-- 加载状态 -->
                            <div class="loading-section" v-if="isLoadingComments">
                                <n-spin size="large" />
                                <span>加载评论中...</span>
                            </div>

                            <!-- 分页 -->
                            <div class="comment-pagination" v-if="totalComments > commentPageSize">
                                <n-pagination
                                    v-model:page="commentPage"
                                    :page-count="Math.ceil(totalComments / commentPageSize)"
                                    :page-size="commentPageSize"
                                    show-size-picker
                                    :page-sizes="[10, 20, 30, 50]"
                                    @update:page="handleCommentPageChange"
                                    @update:page-size="handleCommentPageSizeChange"
                                />
                            </div>
                        </n-card>
                    </div>

                    <!-- 加载状态 -->
                    <div class="loading-section" v-else-if="isLoading">
                        <n-spin size="large" />
                        <span>加载车辆详情中...</span>
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
    NAvatar,
    NTag,
    NRate,
    NImage,
    NInput,
    NSpin,
    NPagination,
    NConfigProvider
} from 'naive-ui';
import {
    ArrowBackOutline,
    SpeedometerOutline,
    PeopleOutline,
    CarSportOutline,
    CalendarOutline,
    InformationCircleOutline,
    ChatbubblesOutline,
    ChatbubbleOutline,
    SendOutline,
    ChevronDownOutline,
    CartOutline,
    HeartOutline,
    FlameOutline
} from '@vicons/ionicons5';

// 引入样式
import '../assets/css/car-detail.css';

// 引入API
import { carApi, commentApi } from '../api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 车辆详情
const carDetail = ref(null);
const isLoading = ref(false);

// 图片相关
const imageList = ref([]);
const currentImageIndex = ref(0);
const currentImage = computed(() => imageList.value[currentImageIndex.value] || '');

// 评分
const carRating = computed(() => {
    if (carDetail.value && carDetail.value.avgScore) {
        return Math.min(carDetail.value.avgScore / 2, 5);
    }
    return 0;
});

// 评论相关
const commentList = ref([]);
const totalComments = ref(0);
const commentPage = ref(1);
const commentPageSize = ref(10);
const isLoadingComments = ref(false);

// 发布评论
const newComment = ref({
    content: '',
    score: 5
});
const isPostingComment = ref(false);

// 回复相关
const replyingCommentId = ref(null);
const replyContent = ref('');
const isPostingReply = ref(false);

// 返回上一页
const goBack = () => {
    router.back();
};

// 获取车辆详情
const fetchCarDetail = async () => {
    const carId = route.params.id;
    if (!carId) {
        message.error('车辆ID不存在');
        return;
    }

    isLoading.value = true;
    try {
        const response = await carApi.getCarDetail(carId);
        console.log('车辆详情响应:', response);
        
        if (response.code === 200 && response.data) {
            carDetail.value = response.data;
            
            // 处理图片列表
            if (carDetail.value.images) {
                imageList.value = carDetail.value.images.split(',').filter(img => img.trim());
            }
            
            // 如果没有图片，使用默认图片
            if (imageList.value.length === 0) {
                imageList.value = ['https://via.placeholder.com/800x600/2c3e50/ffffff?text=Car'];
            }
            
            console.log('图片列表:', imageList.value);
        } else {
            message.error(response.msg || '获取车辆详情失败');
        }
    } catch (error) {
        console.error('获取车辆详情失败:', error);
        message.error('获取车辆详情失败');
    } finally {
        isLoading.value = false;
    }
};

// 获取评论列表
const fetchComments = async () => {
    const carId = route.params.id;
    if (!carId) return;

    isLoadingComments.value = true;
    try {
        const response = await commentApi.getCarComments({
            carId,
            pageNum: commentPage.value,
            pageSize: commentPageSize.value
        });
        
        console.log('评论列表响应:', response);
        
        if (response.code === 200 && response.data) {
            const comments = Array.isArray(response.data) ? response.data : response.data.records || [];
            
            // 处理每个评论，初始化回复相关字段
            commentList.value = comments.map(comment => {
                const replyList = comment.replyList || [];
                const replyCount = comment.replyCount || 0;
                
                return {
                    ...comment,
                    replyList: replyList,
                    replyCount: replyCount,
                    showAllReplies: false,
                    isLoadingReplies: false,
                    replyPage: 1,
                    // 如果实际回复数大于已加载的回复数，说明还有更多
                    hasMoreReplies: replyCount > replyList.length
                };
            });
            
            totalComments.value = response.data.total || comments.length;
            
            console.log('处理后的评论列表:', commentList.value);
            console.log('评论详情:', commentList.value.map(c => ({
                id: c.id,
                content: c.content,
                replyCount: c.replyCount,
                replyListLength: c.replyList.length,
                hasMoreReplies: c.hasMoreReplies
            })));
        } else {
            message.error(response.msg || '获取评论列表失败');
        }
    } catch (error) {
        console.error('获取评论列表失败:', error);
        message.error('获取评论列表失败');
    } finally {
        isLoadingComments.value = false;
    }
};

// 发布评论
const handlePostComment = async () => {
    if (!newComment.value.content.trim()) {
        message.warning('请输入评论内容');
        return;
    }

    const carId = route.params.id;
    if (!carId) {
        message.error('车辆ID不存在');
        return;
    }

    isPostingComment.value = true;
    try {
        const response = await commentApi.userAddComment({
            carId: parseInt(carId),
            content: newComment.value.content,
            parentCommentId: 0, // 顶级评论
            followCommentId: 0  // 非回复评论
        });
        
        console.log('发布评论响应:', response);
        
        if (response.code === 200) {
            message.success('评论发布成功，等待AI审核中...');
            
            // 清空输入框
            newComment.value = {
                content: '',
                score: 5
            };
            
            // 重新加载评论列表
            commentPage.value = 1;
            await fetchComments();
        } else {
            message.error(response.msg || '发布评论失败');
        }
    } catch (error) {
        console.error('发布评论失败:', error);
        message.error('发布评论失败');
    } finally {
        isPostingComment.value = false;
    }
};

// 点击回复按钮
const handleReplyClick = (comment) => {
    replyingCommentId.value = comment.id;
    replyContent.value = '';
};

// 取消回复
const cancelReply = () => {
    replyingCommentId.value = null;
    replyContent.value = '';
};

// 发布回复
const handlePostReply = async (comment) => {
    if (!replyContent.value.trim()) {
        message.warning('请输入回复内容');
        return;
    }

    const carId = route.params.id;
    if (!carId) {
        message.error('车辆ID不存在');
        return;
    }

    isPostingReply.value = true;
    try {
        // 确定 parentCommentId：如果当前评论是顶级评论，则用它的ID；否则用它的parentCommentId
        const parentCommentId = comment.parentCommentId === 0 ? comment.id : comment.parentCommentId;
        
        const response = await commentApi.userAddComment({
            carId: parseInt(carId),
            content: replyContent.value,
            score: 0, // 回复不需要评分
            parentCommentId: parentCommentId, // 顶级评论ID
            followCommentId: comment.id       // 被回复的评论ID
        });
        
        console.log('发布回复响应:', response);
        
        if (response.code === 200) {
            message.success('回复发布成功，等待AI审核中...');
            
            // 清空输入框并关闭回复区域
            cancelReply();
            
            // 重新加载评论列表
            await fetchComments();
        } else {
            message.error(response.msg || '发布回复失败');
        }
    } catch (error) {
        console.error('发布回复失败:', error);
        message.error('发布回复失败');
    } finally {
        isPostingReply.value = false;
    }
};

// 获取可见的回复列表
const getVisibleReplies = (comment) => {
    if (!comment.replyList || comment.replyList.length === 0) {
        return [];
    }
    
    // 如果显示全部回复，返回所有回复
    if (comment.showAllReplies) {
        return comment.replyList;
    }
    
    // 否则只显示前2条
    return comment.replyList.slice(0, 2);
};

// 是否显示"查看更多回复"按钮
const shouldShowLoadMore = (comment) => {
    if (!comment.replyList || comment.replyList.length === 0) {
        return false;
    }
    
    // 如果还有更多回复未加载，或者已加载的回复多于2条且未全部显示
    return comment.hasMoreReplies || (!comment.showAllReplies && comment.replyList.length > 2);
};

// 加载更多回复
const handleLoadMoreReplies = async (comment) => {
    // 如果还有更多回复未加载，则从服务器加载
    if (comment.hasMoreReplies) {
        comment.isLoadingReplies = true;
        try {
            const response = await commentApi.loadReply({
                id: comment.id,
                pageNum: comment.replyPage + 1,
                pageSize: 5
            });
            
            console.log('加载回复响应:', response);
            
            if (response.code === 200 && response.data) {
                const newReplies = Array.isArray(response.data) ? response.data : response.data.records || [];
                
                // 追加新的回复
                comment.replyList = [...comment.replyList, ...newReplies];
                comment.replyPage++;
                
                // 判断是否还有更多
                comment.hasMoreReplies = comment.replyList.length < comment.replyCount;
                
                // 显示所有已加载的回复
                comment.showAllReplies = true;
                
                console.log('更新后的回复列表:', comment.replyList);
                console.log('是否还有更多:', comment.hasMoreReplies);
            } else {
                message.error(response.msg || '加载回复失败');
            }
        } catch (error) {
            console.error('加载回复失败:', error);
            message.error('加载回复失败');
        } finally {
            comment.isLoadingReplies = false;
        }
    } else {
        // 否则只是展开显示已加载的回复
        comment.showAllReplies = true;
    }
};

// 评论分页变化
const handleCommentPageChange = (page) => {
    commentPage.value = page;
    fetchComments();
};

const handleCommentPageSizeChange = (pageSize) => {
    commentPageSize.value = pageSize;
    commentPage.value = 1;
    fetchComments();
};

// 格式化时间（相对时间）
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    }
    
    // 小于1天
    if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    }
    
    // 小于7天
    if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}天前`;
    }
    
    // 否则显示具体日期
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// 格式化日期（完整日期格式）
const formatDate = (dateStr) => {
    if (!dateStr) return '未知';
    
    const date = new Date(dateStr);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        return '未知';
    }
    
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// 马上租
const handleRent = () => {
    message.info('订单结算功能开发中...');
    // TODO: 跳转到订单结算页面
    // router.push(`/order/checkout?carId=${route.params.id}`);
};

// 组件挂载时获取数据
onMounted(async () => {
    await fetchCarDetail();
    await fetchComments();
});
</script>

<style scoped>
/* 样式已在独立的CSS文件中定义: src/assets/css/car-detail.css */
</style>


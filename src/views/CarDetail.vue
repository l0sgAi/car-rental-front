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
                                        <div class="price-value-d">
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
                        <n-card :bordered="false" class="comment-section" ref="commentSectionRef">
                            <div class="comment-header">
                                <div>
                                    <h2 class="section-title" style="margin: 0;">
                                        <n-icon :component="ChatbubblesOutline" size="28" color="#18a058" />
                                        用户评价
                                        <!-- <span class="comment-count">({{ totalComments }}条评论)</span> -->
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
                                                <button 
                                                    class="comment-action-btn"
                                                    :class="{ 'liked': comment.isLiked }"
                                                    @click="handleLike(comment)"
                                                >
                                                    <n-icon :component="comment.isLiked ? Heart : HeartOutline" size="16" />
                                                    <span v-if="comment.likeCount > 0">{{ comment.likeCount }}</span>
                                                    <span v-else>赞</span>
                                                </button>
                                            </div>

                                            <!-- 回复区域 -->
                                            <div class="reply-section" v-if="comment.replyList.length > 0 || comment.replyCount > 0">
                                                <div class="reply-list" v-if="comment.replyList.length > 0">
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
                                                                <template v-if="reply.followUsername">
                                                                    <span class="reply-arrow">回复</span>
                                                                    <span class="reply-target-username">@{{ reply.followUsername }}</span>
                                                                </template>
                                                                <span class="reply-time">{{ formatTime(reply.createTime) }}</span>
                                                            </div>
                                                            <div class="reply-text">{{ reply.content }}</div>
                                                            <div class="comment-actions">
                                                                <button 
                                                                    class="comment-action-btn"
                                                                    @click="handleReplyClick(reply)"
                                                                >
                                                                    <n-icon :component="ChatbubbleOutline" size="16" />
                                                                    回复
                                                                </button>
                                                                <button 
                                                                    class="comment-action-btn"
                                                                    :class="{ 'liked': reply.isLiked }"
                                                                    @click="handleLike(reply)"
                                                                >
                                                                    <n-icon :component="reply.isLiked ? Heart : HeartOutline" size="16" />
                                                                    <span v-if="reply.likeCount > 0">{{ reply.likeCount }}</span>
                                                                    <span v-else>赞</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- 查看更多回复按钮 -->
                                                <div class="load-more-replies" v-if="shouldShowLoadMore(comment)">
                                                    <!-- 如果还没加载完所有回复 -->
                                                    <n-button 
                                                        v-if="!comment.allRepliesLoaded"
                                                        text 
                                                        type="primary"
                                                        @click="handleLoadMoreReplies(comment)"
                                                        :loading="comment.isLoadingReplies"
                                                    >
                                                        <template #icon>
                                                            <n-icon :component="ChevronDownOutline" />
                                                        </template>
                                                        {{ comment.replyPage === 0 ? `查看${comment.replyCount}条回复` : '加载更多回复' }}
                                                    </n-button>
                                                    <!-- 如果已加载完成 -->
                                                    <div v-else class="all-replies-loaded">
                                                        <n-icon :component="CheckmarkCircleOutline" size="16" />
                                                        已显示全部回复
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- 回复输入框 -->
                                            <div class="reply-input-section" v-if="replyingCommentId === comment.id">
                                                <n-input
                                                    v-model:value="replyContent"
                                                    type="textarea"
                                                    :placeholder="`回复 ${replyTargetComment?.username || comment.username}...`"
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
                                                        @click="handlePostReply(replyTargetComment || comment)"
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

                            <!-- 自动加载提示 -->
                            <div class="load-more-comments" v-if="commentList.length > 0">
                                <!-- 正在加载更多 -->
                                <div v-if="isLoadingMoreComments" class="auto-loading">
                                    <n-spin size="small" />
                                    <span>正在加载更多评论...</span>
                                </div>
                                <!-- 已加载完成 -->
                                <div v-else-if="allCommentsLoaded && commentPage > 0" class="all-comments-loaded">
                                    <n-icon :component="CheckmarkCircleOutline" size="16" />
                                    已显示全部评论
                                </div>
                                <!-- 提示向下滚动加载 -->
                                <div v-else-if="!allCommentsLoaded && totalComments > commentList.length" class="scroll-tip">
                                    <n-icon :component="ChevronDownOutline" size="16" />
                                    <span>向下滚动加载更多 (还有 {{ totalComments - commentList.length }} 条)</span>
                                </div>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
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
    Heart,
    FlameOutline,
    CheckmarkCircleOutline
} from '@vicons/ionicons5';

// 引入样式
import '../assets/css/car-detail.css';

// 引入API
import { carApi, commentApi, userApi } from '../api';

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
const commentPage = ref(0); // 0 表示还未开始分页加载，1+ 表示已经开始分页
const isLoadingComments = ref(false);
const isLoadingMoreComments = ref(false);
const allCommentsLoaded = ref(false); // 是否已加载所有评论

// 发布评论
const newComment = ref({
    content: '',
    score: 5
});
const isPostingComment = ref(false);

// 滚动监听相关
const commentSectionRef = ref(null); // 评论区域的引用
const hasLoadedInitialComments = ref(false); // 是否已加载过初始评论

// 回复相关
const replyingCommentId = ref(null); // 顶级评论的ID（用于定位输入框位置）
const replyTargetComment = ref(null); // 回复目标的评论对象（可能是顶级评论或回复）
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
        // //'车辆详情响应:', response);
        
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
            
            // //'图片列表:', imageList.value);
        } else {
            message.error(response.msg || '获取车辆详情失败');
        }
    } catch (error) {
        // console.error('获取车辆详情失败:', error);
        message.error('获取车辆详情失败');
    } finally {
        isLoading.value = false;
    }
};

// 处理单个评论的回复列表
const processCommentReplies = (comment) => {
    // 后端返回的回复在 children 字段中
    const { children, followCount, ...commentWithoutChildren } = comment;
    const allReplies = children || [];
    // 优先使用 followCount，如果不存在则使用 children 长度
    const replyCount = followCount !== undefined ? followCount : allReplies.length;
    
    // 为每个回复添加被回复人的用户名和点赞状态
    const processedReplies = allReplies.map(reply => {
        let followUsername = null;
        
        // 只有当 parentCommentId 和 followCommentId 不同时才显示回复关系
        // 如果相同，说明是直接回复父评论，父子结构已经表明了回复关系
        if (reply.followCommentId && reply.followCommentId !== 0 && 
            reply.parentCommentId !== reply.followCommentId) {
            // 如果回复的是顶级评论
            if (reply.followCommentId === comment.id) {
                followUsername = comment.username;
            } else {
                // 如果回复的是其他回复，从 allReplies 中查找
                const targetReply = allReplies.find(r => r.id === reply.followCommentId);
                if (targetReply) {
                    followUsername = targetReply.username;
                }
            }
        }
        
        return {
            ...reply,
            followUsername: followUsername,
            isLiked: reply.liked === 1, // 根据后端返回的liked字段判断是否点赞过
            likeCount: reply.likeCount || 0  // 确保有点赞数
        };
    });
    
    // 规则：如果回复数>=3，初始显示前2条；否则显示全部
    const initialReplies = replyCount >= 3 ? processedReplies.slice(0, 2) : processedReplies;
    
    return {
        ...commentWithoutChildren,
        isLiked: commentWithoutChildren.liked === 1, // 根据后端返回的liked字段判断是否点赞过
        likeCount: commentWithoutChildren.likeCount || 0,  // 确保有点赞数
        replyList: initialReplies, // 初始显示的回复（2条或全部）
        allReplies: processedReplies, // 保存所有初始回复数据（用于查找followUsername）
        replyCount: replyCount, // 总回复数
        isLoadingReplies: false,
        replyPage: 0, // 0表示还未开始分页加载，1+表示已经开始分页
        // 如果回复数>0但列表为空，说明还未加载；或者列表长度小于回复总数，说明未加载完
        allRepliesLoaded: replyCount === 0 || (allReplies.length >= replyCount)
    };
};

// 获取初始评论列表（固定5条）
const fetchComments = async () => {
    const carId = route.params.id;
    if (!carId) return;

    // 如果已经加载过，不重复加载
    if (hasLoadedInitialComments.value) return;

    isLoadingComments.value = true;
    try {
        const response = await commentApi.getCarComments({
            carId: parseInt(carId)
        });
        
        // //'初始评论列表响应:', response);
        
        if (response.code === 200 && response.data) {
            const comments = Array.isArray(response.data) ? response.data : response.data.records || [];
            
            // 处理每个评论，初始化回复相关字段
            commentList.value = comments.map(comment => processCommentReplies(comment));
            
            // 从响应中获取总数，如果没有则使用评论数量
            totalComments.value = response.data.total || comments.length;
            
            // 重置页码和加载状态
            commentPage.value = 0;
            
            // 判断是否已全部加载：
            // 1. 如果返回 < 5条，说明总数就这么多，已全部加载
            // 2. 如果返回 = 5条，且有total字段且total === 5，说明已全部加载
            // 3. 其他情况，可能还有更多
            if (comments.length < 5) {
                allCommentsLoaded.value = true;
            } else if (comments.length === 5 && response.data.total === 5) {
                allCommentsLoaded.value = true;
            } else {
                allCommentsLoaded.value = false;
            }
            
            // 标记已加载过初始评论
            hasLoadedInitialComments.value = true;
            
            // //'处理后的评论列表:', commentList.value);
            // //'总评论数:', totalComments.value);
            // //'是否已全部加载:', allCommentsLoaded.value);
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

// 加载更多评论
const handleLoadMoreComments = async () => {
    const carId = route.params.id;
    if (!carId) return;

    isLoadingMoreComments.value = true;
    try {
        // 下一页页码
        const nextPage = commentPage.value + 1;
        
        // //`加载更多评论，请求第 ${nextPage} 页`);
        
        const response = await commentApi.loadMoreComments({
            carId: parseInt(carId),
            pageNum: nextPage,
            pageSize: 10
        });
        
        // //'加载更多评论响应:', response);
        
        if (response.code === 200 && response.data) {
            const newComments = Array.isArray(response.data) ? response.data : response.data.records || [];
            
            // //`本次加载评论数量: ${newComments.length}条`);
            
            // 处理新评论
            const processedComments = newComments.map(comment => processCommentReplies(comment));
            
            // 规则：如果是第一次点击加载更多（commentPage === 0），用10条替换原有的5条
            if (commentPage.value === 0) {
                commentList.value = processedComments;
                // //'第一次加载更多，替换原有的5条评论');
            } else {
                // 后续点击，追加到现有列表
                commentList.value = [...commentList.value, ...processedComments];
                // //'追加到现有评论列表');
            }
            
            // 更新页码
            commentPage.value = nextPage;
            
            // 判断是否已加载完成
            // 如果返回的数据 <= 9条，说明没有更多了
            if (newComments.length <= 9) {
                allCommentsLoaded.value = true;
                // //'所有评论已加载完成：返回数据 <= 9条');
            } else {
                allCommentsLoaded.value = false;
                // //'还有更多评论可加载');
            }
            
            // 更新总评论数
            if (response.data.total !== undefined) {
                totalComments.value = response.data.total;
            }
            
            // //'更新后的评论列表长度:', commentList.value.length);
            // //'当前页码:', commentPage.value);
            // //'总评论数:', totalComments.value);
            // //'是否已加载完成:', allCommentsLoaded.value);
        } else {
            message.error(response.msg || '加载更多评论失败');
        }
    } catch (error) {
        console.error('加载更多评论失败:', error);
        message.error('加载更多评论失败');
    } finally {
        isLoadingMoreComments.value = false;
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
        
        // //'发布评论响应:', response);
        
        if (response.code === 200) {
            message.success('评论发布成功，等待AI审核中...');
            
            // 清空输入框
            newComment.value = {
                content: '',
                score: 5
            };
            
            // 重新加载评论列表（重置标志位以便重新加载）
            hasLoadedInitialComments.value = false;
            await fetchComments();
        } else {
            message.error(response.msg || '发布评论失败');
        }
    } catch (error) {
        // console.error('发布评论失败:', error);
        message.error('发布评论失败');
    } finally {
        isPostingComment.value = false;
    }
};

// 点击回复按钮
const handleReplyClick = (comment) => {
    // 如果是顶级评论（parentCommentId === 0），则 replyingCommentId 就是它的 id
    // 如果是回复（parentCommentId !== 0），则 replyingCommentId 是它的 parentCommentId
    replyingCommentId.value = comment.parentCommentId === 0 ? comment.id : comment.parentCommentId;
    replyTargetComment.value = comment;
    replyContent.value = '';
};

// 取消回复
const cancelReply = () => {
    replyingCommentId.value = null;
    replyTargetComment.value = null;
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
        
        // //'发布回复响应:', response);
        
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
        // console.error('发布回复失败:', error);
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
    
    // 规则1：如果回复数<3，显示全部（初始就已经全部显示）
    // 修改：现在初始不显示，点击后加载。如果已加载，则按规则显示
    // if (comment.replyCount < 3) {
    //    return comment.replyList;
    // }
    
    // 规则2：如果还未开始分页加载（replyPage === 0），只显示初始的2条
    if (comment.replyPage === 0) {
        return comment.replyList; // 初始只有2条
    }
    
    // 规则3：已经开始分页加载
    // 如果已加载完成，显示所有
    if (comment.allRepliesLoaded) {
        return comment.replyList;
    }
    
    // 规则4：如果还未加载完成，折叠最后一条
    // 显示前 n-1 条，最后一条折叠
    return comment.replyList.slice(0, comment.replyList.length - 1);
};

// 是否显示"加载更多回复"区域（包括按钮或已加载完成提示）
const shouldShowLoadMore = (comment) => {
    // 只要有回复，就显示查看/加载更多区域
    return comment.replyCount > 0;
};

// 处理回复的 followUsername
const processReplyFollowUsername = (reply, comment) => {
    let followUsername = null;
    
    // 只有当 parentCommentId 和 followCommentId 不同时才显示回复关系
    // 如果相同，说明是直接回复父评论，父子结构已经表明了回复关系
    if (reply.followCommentId && reply.followCommentId !== 0 && 
        reply.parentCommentId !== reply.followCommentId) {
        // 如果回复的是顶级评论
        if (reply.followCommentId === comment.id) {
            followUsername = comment.username;
        } else {
            // 如果回复的是其他回复，从已加载的回复列表和所有回复中查找
            const allCurrentReplies = [...comment.replyList, ...comment.allReplies];
            const targetReply = allCurrentReplies.find(r => r.id === reply.followCommentId);
            if (targetReply) {
                followUsername = targetReply.username;
            }
        }
    }
    
    return {
        ...reply,
        followUsername: followUsername,
        isLiked: reply.liked === 1, // 根据后端返回的liked字段判断是否点赞过
        likeCount: reply.likeCount || 0  // 确保有点赞数
    };
};

// 加载更多回复
const handleLoadMoreReplies = async (comment) => {
    comment.isLoadingReplies = true;
    try {
        // 下一页页码
        const nextPage = comment.replyPage + 1;
        
        // //`加载评论 ${comment.id} 的回复，请求第 ${nextPage} 页`);
        
        const response = await commentApi.loadReply({
            id: comment.id,
            pageNum: nextPage,
            pageSize: 5
        });
        
        // //'加载回复响应:', response);
        
        if (response.code === 200 && response.data) {
            const newReplies = Array.isArray(response.data) ? response.data : response.data.records || [];
            
            // //`本次加载数量: ${newReplies.length}条`);
            
            // 处理新回复的 followUsername
            const processedNewReplies = newReplies.map(reply => processReplyFollowUsername(reply, comment));
            
            // 规则1：如果是第一次点击加载（replyPage === 0），替换现有的回复列表
            if (comment.replyPage === 0) {
                comment.replyList = processedNewReplies;
                // //'第一次分页加载，替换初始回复列表');
            } else {
                // 规则2：如果已经在分页中，追加到现有列表
                comment.replyList = [...comment.replyList, ...processedNewReplies];
                // //'追加到现有回复列表');
            }
            
            // 更新页码
            comment.replyPage = nextPage;
            
            // 规则3：判断是否已加载完成
            // 如果返回的数据 <= 4条，说明没有更多了
            if (newReplies.length <= 4) {
                comment.allRepliesLoaded = true;
                // //'已加载完成：本次返回 <=4 条');
            } else {
                comment.allRepliesLoaded = false;
                // //'还有更多回复可加载');
            }
            
            // //'更新后的回复列表长度:', comment.replyList.length);
            // //'当前页码:', comment.replyPage);
            // //'是否已加载完成:', comment.allRepliesLoaded);
        } else {
            message.error(response.msg || '加载回复失败');
        }
    } catch (error) {
        // console.error('加载回复失败:', error);
        message.error('加载回复失败');
    } finally {
        comment.isLoadingReplies = false;
    }
};

// 滚动监听处理函数
const handleScroll = () => {
    //'滚动事件触发');
    
    // 如果正在加载，不触发
    if (isLoadingMoreComments.value) {
        //'正在加载中，跳过');
        return;
    }
    
    // 如果已加载完成，不触发
    if (allCommentsLoaded.value) {
        //'已加载完成，跳过');
        return;
    }
    
    // 如果没有评论，不触发
    if (commentList.value.length === 0) {
        //'没有评论，跳过');
        return;
    }
    
    // 检测方式1：使用页面总高度和滚动位置
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const distanceToBottom = documentHeight - scrollTop - windowHeight;
    
    // 距离底部小于500px时触发
    if (distanceToBottom < 500) {
        //'触发加载更多评论');
        handleLoadMoreComments();
        return;
    }
    
    // 检测方式2：使用评论区域的位置（作为备选）
    if (commentSectionRef.value) {
        const element = commentSectionRef.value.$el || commentSectionRef.value;
        const rect = element.getBoundingClientRect();
        const elementBottom = rect.bottom;
        
        const distanceToViewportBottom = elementBottom - windowHeight;
        
        if (distanceToViewportBottom < 300) {
            //'触发加载更多评论(方式2)');
            handleLoadMoreComments();
        }
    }
};

// 使用节流优化滚动性能（改为节流，更适合无限滚动）
let scrollTimer = null;
let isScrolling = false;
const handleScrollDebounced = () => {
    if (isScrolling) return;
    
    isScrolling = true;
    handleScroll();
    
    setTimeout(() => {
        isScrolling = false;
    }, 300);
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

// 计算用户年龄
const calculateAge = (birthdate) => {
    if (!birthdate) {
        return null;
    }
    
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // 如果还没到生日，年龄减1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
};

// 验证用户信息
const validateUserInfo = async () => {
    try {
        const response = await userApi.getUserInfo();
        
        if (response.code !== 200 || !response.data) {
            message.error('获取用户信息失败，请重新登录');
            return false;
        }
        
        const userInfo = response.data;
        
        // 检查身份证号码
        if (!userInfo.idNumber || userInfo.idNumber.trim() === '') {
            message.error('您的详细身份信息为空，请先完善个人信息', {
                duration: 3000
            });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
            return false;
        }
        
        // 检查驾驶证号码
        if (!userInfo.licenseNumber || userInfo.licenseNumber.trim() === '') {
            message.error('您的详细身份信息为空，请先完善个人信息', {
                duration: 3000
            });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
            return false;
        }
        
        // 检查年龄
        if (!userInfo.birthdate) {
            message.error('您的详细身份信息为空，请先完善个人信息', {
                duration: 3000
            });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
            return false;
        }
        
        const age = calculateAge(userInfo.birthdate);
        if (age === null || age < 18) {
            message.error('您的详细身份信息为空，请先完善个人信息', {
                duration: 3000
            });
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败，请重试');
        return false;
    }
};

// 马上租
const handleRent = async () => {
    // 在跳转前，先验证用户信息
    const isUserInfoValid = await validateUserInfo();
    if (!isUserInfoValid) {
        return;
    }
    
    // 验证通过后，跳转到下单页面
    router.push({
        path: '/order/start',
        query: {
            carId: route.params.id
        }
    });
};

// 点赞处理
const handleLike = async (comment) => {
    // 检查是否登录
    const token = localStorage.getItem('tokenValue');
    if (!token) {
        message.warning('请先登录');
        return;
    }

    try {
        const response = await commentApi.likeComment(comment.id);
        
        if (response.code === 200) {
            // 切换点赞状态
            comment.isLiked = !comment.isLiked;
            
            // 更新点赞数量
            if (comment.isLiked) {
                comment.likeCount = (comment.likeCount || 0) + 1;
                // message.success('点赞成功');
            } else {
                comment.likeCount = Math.max((comment.likeCount || 0) - 1, 0);
                // message.success('取消点赞');
            }
        } else {
            message.error(response.msg || '操作失败');
        }
    } catch (error) {
        console.error('点赞失败:', error);
        message.error('操作失败，请重试');
    }
};

// Intersection Observer 实例
let commentSectionObserver = null;

// 组件挂载时获取数据
onMounted(async () => {
    await fetchCarDetail();
    
    // 等待 DOM 更新后设置 Intersection Observer
    await nextTick();
    
    // 添加滚动监听（监听整个页面滚动，用于加载更多评论）
    window.addEventListener('scroll', handleScrollDebounced);
    
    // 设置 Intersection Observer 监听评论区域
    if (commentSectionRef.value) {
        const element = commentSectionRef.value.$el || commentSectionRef.value;
        
        commentSectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // 当评论区进入视口时，加载评论
                    if (entry.isIntersecting && !hasLoadedInitialComments.value) {
                        //'评论区进入视口，开始加载评论');
                        fetchComments();
                    }
                });
            },
            {
                // 提前100px开始加载，提升用户体验
                rootMargin: '0px 0px 100px 0px',
                threshold: 0
            }
        );
        
        commentSectionObserver.observe(element);
        //'评论区 Intersection Observer 已设置');
    }
});

// 组件卸载时移除监听
onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollDebounced);
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    // 移除 Intersection Observer
    if (commentSectionObserver) {
        commentSectionObserver.disconnect();
        commentSectionObserver = null;
    }
});
</script>

<style scoped>
/* 样式已在独立的CSS文件中定义: src/assets/css/car-detail.css */
</style>


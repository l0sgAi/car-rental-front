<template>
    <n-config-provider :theme="darkTheme">
        <div class="index-container">
            <!-- 顶部导航栏 -->
            <n-layout-header class="header" bordered>
            <div class="header-content">
                <div class="logo-title">
                    <n-icon size="32" :component="CarSportOutline" color="#18a058" />
                    <span class="title">租车帝租赁平台</span>
                </div>
                <div class="user-info">
                    <n-avatar
                        size="medium"
                        :src="userAvatar || ''"
                        fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                        round/>
                    <span class="username">{{ username }}</span>
                    <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                        <n-button text>
                            <n-icon size="20" :component="ChevronDownOutline" />
                        </n-button>
                    </n-dropdown>
                </div>
            </div>
        </n-layout-header>

        <!-- 主要内容区域 -->
        <n-layout-content class="main-content">
            <!-- 全局搜索栏 -->
            <div class="search-section">
                <n-input-group>
                    <n-input
                        v-model:value="searchKeyword"
                        size="large"
                        placeholder="搜索车型、品牌..."
                        class="search-input"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <n-icon :component="SearchOutline" />
                        </template>
                    </n-input>
                    <n-button type="primary" size="large" @click="handleSearch">
                        <template #icon>
                            <n-icon :component="SearchOutline" />
                        </template>
                        搜索
                    </n-button>
                </n-input-group>
            </div>

            <!-- 筛选栏 -->
            <div class="filter-section">
                <n-card :bordered="false" class="filter-card">
                    <!-- 筛选条件 -->
                    <div class="filter-row">
                        <div class="filter-item">
                            <span class="filter-label">车型：</span>
                            <n-space>
                                <n-tag
                                    v-for="type in carTypes"
                                    :key="type.value"
                                    :type="selectedCarType === type.value ? 'success' : 'default'"
                                    :bordered="false"
                                    checkable
                                    :checked="selectedCarType === type.value"
                                    @click="selectedCarType = type.value"
                                    class="filter-tag"
                                >
                                    {{ type.label }}
                                </n-tag>
                            </n-space>
                        </div>
                    </div>

                    <n-divider style="margin: 12px 0" />

                    <div class="filter-row">
                        <div class="filter-item">
                            <span class="filter-label">品牌：</span>
                            <n-space>
                                <n-tag
                                    v-for="brand in brands"
                                    :key="brand.value"
                                    :type="selectedBrand === brand.value ? 'success' : 'default'"
                                    :bordered="false"
                                    checkable
                                    :checked="selectedBrand === brand.value"
                                    @click="selectedBrand = brand.value"
                                    class="filter-tag"
                                >
                                    {{ brand.label }}
                                </n-tag>
                            </n-space>
                        </div>
                    </div>

                    <n-divider style="margin: 12px 0" />

                    <div class="filter-row">
                        <div class="filter-item">
                            <span class="filter-label">动力类型：</span>
                            <n-space>
                                <n-tag
                                    v-for="power in powerTypes"
                                    :key="power.value"
                                    :type="selectedPowerType === power.value ? 'success' : 'default'"
                                    :bordered="false"
                                    checkable
                                    :checked="selectedPowerType === power.value"
                                    @click="selectedPowerType = power.value"
                                    class="filter-tag"
                                >
                                    {{ power.label }}
                                </n-tag>
                            </n-space>
                        </div>
                    </div>

                    <n-divider style="margin: 12px 0" />

                    <div class="filter-row">
                        <div class="filter-item full-width">
                            <span class="filter-label">价格区间：</span>
                            <div class="price-input-group">
                                <n-input-number
                                    v-model:value="tempPriceRange[0]"
                                    :min="0"
                                    :max="tempPriceRange[1]"
                                    :step="50"
                                    placeholder="最低价格"
                                    style="width: 150px"
                                >
                                    <template #prefix>¥</template>
                                </n-input-number>
                                <span class="price-separator">-</span>
                                <n-input-number
                                    v-model:value="tempPriceRange[1]"
                                    :min="tempPriceRange[0]"
                                    :max="5000"
                                    :step="50"
                                    placeholder="最高价格"
                                    style="width: 150px"
                                >
                                    <template #prefix>¥</template>
                                </n-input-number>
                                <n-button type="primary" @click="applyPriceFilter">
                                    确定
                                </n-button>
                                <div class="current-price-display" v-if="priceFilterApplied">
                                    <span>当前筛选：¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <n-divider style="margin: 12px 0" />

                    <!-- 排序选项 -->
                    <div class="filter-row">
                        <div class="filter-item">
                            <span class="filter-label">排序：</span>
                            <n-space>
                                <n-tag
                                    v-for="sort in sortOptions"
                                    :key="sort.value"
                                    :type="selectedSort === sort.value ? 'info' : 'default'"
                                    :bordered="false"
                                    checkable
                                    :checked="selectedSort === sort.value"
                                    @click="selectedSort = sort.value"
                                    class="filter-tag"
                                >
                                    <template #icon>
                                        <n-icon :component="selectedSort === sort.value ? ArrowUpOutline : ArrowDownOutline" />
                                    </template>
                                    {{ sort.label }}
                                </n-tag>
                            </n-space>
                        </div>
                    </div>
                </n-card>
            </div>

            <!-- 车辆列表 -->
            <div class="car-list-section">
                <n-grid :x-gap="20" :y-gap="20" :cols="4" responsive="screen">
                    <n-grid-item v-for="car in carList" :key="car.id">
                        <n-card
                            hoverable
                            class="car-card"
                            @click="handleCarClick(car)"
                        >
                            <div class="car-image">
                                <img :src="car.image" :alt="car.name" />
                                <div class="car-badge" v-if="car.isHot">
                                    <n-tag type="error" size="small" :bordered="false">热门</n-tag>
                                </div>
                            </div>
                            <div class="car-info">
                                <h3 class="car-name">{{ car.name }}</h3>
                                <div class="car-brand">{{ car.brand }}</div>
                                <div class="car-specs">
                                    <n-space :size="4">
                                        <n-tag size="small" :bordered="false">{{ car.type }}</n-tag>
                                        <n-tag size="small" :bordered="false">{{ car.powerType }}</n-tag>
                                    </n-space>
                                </div>
                                <div class="car-features">
                                    <div class="feature-item">
                                        <n-icon :component="SpeedometerOutline" size="14" />
                                        <span>{{ car.fuelConsumption }}L/100km</span>
                                    </div>
                                    <div class="feature-item">
                                        <n-icon :component="ResizeOutline" size="14" />
                                        <span>{{ car.space }}座</span>
                                    </div>
                                </div>
                                <div class="car-rating">
                                    <n-rate :value="car.rating" readonly size="small" />
                                    <span class="rating-score">{{ car.rating.toFixed(1) }}</span>
                                    <span class="rating-count">({{ car.ratingCount }})</span>
                                </div>
                                <div class="car-price">
                                    <span class="price-label">¥</span>
                                    <span class="price-value">{{ car.price }}</span>
                                    <span class="price-unit">/天</span>
                                </div>
                            </div>
                        </n-card>
                    </n-grid-item>
                </n-grid>

                <!-- 加载提示 -->
                <div class="loading-section" v-if="isLoading">
                    <n-spin size="large" />
                    <span>加载中...</span>
                </div>
                <div class="no-more-section" v-else-if="noMoreData">
                    <span>已加载全部车辆</span>
                </div>
            </div>
        </n-layout-content>
    </div>
    </n-config-provider>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage, darkTheme } from 'naive-ui';
import {
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NCard,
    NInput,
    NInputGroup,
    NButton,
    NSpace,
    NIcon,
    NAvatar,
    NDropdown,
    NTag,
    NDivider,
    NInputNumber,
    NGrid,
    NGridItem,
    NRate,
    NSpin,
    NConfigProvider
} from 'naive-ui';
import {
    CarSportOutline,
    SearchOutline,
    ChevronDownOutline,
    SpeedometerOutline,
    ResizeOutline,
    ArrowUpOutline,
    ArrowDownOutline,
    PersonOutline,
    LogOutOutline,
    SettingsOutline,
    PersonCircleOutline
} from '@vicons/ionicons5';

// 引入独立的CSS文件
import '../assets/css/index.css';

// 引入API模块
import { userApi } from '../api';

const router = useRouter();
const message = useMessage();

// 用户信息
const username = ref('租车用户');
const userAvatar = ref('');

// 用户菜单选项
const userMenuOptions = [
    {
        label: '个人中心',
        key: 'profile',
        icon: () => h(NIcon, { component: PersonOutline })
    },
    {
        label: '设置',
        key: 'settings',
        icon: () => h(NIcon, { component: SettingsOutline })
    },
    {
        type: 'divider'
    },
    {
        label: '退出登录',
        key: 'logout',
        icon: () => h(NIcon, { component: LogOutOutline })
    }
];

// 处理用户菜单选择
const handleUserMenuSelect = (key) => {
    if (key === 'logout') {
        localStorage.clear();
        message.success('已退出登录');
        router.push('/login');
    } else if (key === 'settings') {
        message.info('设置功能开发中');
    } else if (key === 'profile') {
        router.push('/profile');
    }
};

// 搜索关键词
const searchKeyword = ref('');

// 筛选条件
const carTypes = [
    { label: '全部', value: 'all' },
    { label: '轿车', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
    { label: 'MPV', value: 'mpv' },
    { label: '跑车', value: 'sports' },
    { label: '商务车', value: 'business' }
];

const brands = [
    { label: '全部', value: 'all' },
    { label: '奔驰', value: 'benz' },
    { label: '宝马', value: 'bmw' },
    { label: '奥迪', value: 'audi' },
    { label: '特斯拉', value: 'tesla' },
    { label: '比亚迪', value: 'byd' },
    { label: '蔚来', value: 'nio' },
    { label: '理想', value: 'li' },
    { label: '小鹏', value: 'xpeng' }
];

const powerTypes = [
    { label: '全部', value: 'all' },
    { label: '纯油', value: 'fuel' },
    { label: '混动', value: 'hybrid' },
    { label: '插混', value: 'phev' },
    { label: '纯电', value: 'ev' }
];

const sortOptions = [
    { label: '热度评分', value: 'hot' },
    { label: '用户评分', value: 'rating' },
    { label: '价格', value: 'price' },
    { label: '油耗', value: 'fuel' },
    { label: '空间', value: 'space' }
];

const selectedCarType = ref('all');
const selectedBrand = ref('all');
const selectedPowerType = ref('all');
const priceRange = ref([0, 2000]);
const tempPriceRange = ref([0, 2000]); // 临时价格区间，用于输入
const priceFilterApplied = ref(false); // 是否已应用价格筛选
const selectedSort = ref('hot');

// 搜索处理
const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value);
    message.info(`搜索: ${searchKeyword.value || '全部车辆'}`);
};

// 应用价格筛选
const applyPriceFilter = () => {
    // 验证输入
    if (tempPriceRange.value[0] > tempPriceRange.value[1]) {
        message.error('最低价格不能大于最高价格');
        return;
    }
    
    // 应用筛选
    priceRange.value = [...tempPriceRange.value];
    priceFilterApplied.value = true;
    
    message.success(`已应用价格筛选：¥${priceRange.value[0]} - ¥${priceRange.value[1]}`);
    
    // 这里可以添加实际的筛选逻辑
    console.log('价格筛选:', priceRange.value);
};

// 所有车辆数据
const allCarData = [
    {
        id: 1,
        name: '奔驰E300L',
        brand: '奔驰',
        type: '轿车',
        powerType: '纯油',
        price: 599,
        rating: 4.8,
        ratingCount: 1253,
        fuelConsumption: 7.2,
        space: 5,
        image: 'https://via.placeholder.com/300x200/2c3e50/ffffff?text=Mercedes+E300L',
        isHot: true
    },
    {
        id: 2,
        name: '宝马5系',
        brand: '宝马',
        type: '轿车',
        powerType: '混动',
        price: 699,
        rating: 4.7,
        ratingCount: 987,
        fuelConsumption: 6.8,
        space: 5,
        image: 'https://via.placeholder.com/300x200/34495e/ffffff?text=BMW+5+Series',
        isHot: true
    },
    {
        id: 3,
        name: '奥迪A6L',
        brand: '奥迪',
        type: '轿车',
        powerType: '纯油',
        price: 579,
        rating: 4.6,
        ratingCount: 876,
        fuelConsumption: 7.5,
        space: 5,
        image: 'https://via.placeholder.com/300x200/2980b9/ffffff?text=Audi+A6L',
        isHot: false
    },
    {
        id: 4,
        name: '特斯拉Model 3',
        brand: '特斯拉',
        type: '轿车',
        powerType: '纯电',
        price: 499,
        rating: 4.9,
        ratingCount: 2134,
        fuelConsumption: 0,
        space: 5,
        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Tesla+Model+3',
        isHot: true
    },
    {
        id: 5,
        name: '比亚迪汉EV',
        brand: '比亚迪',
        type: '轿车',
        powerType: '纯电',
        price: 399,
        rating: 4.5,
        ratingCount: 1567,
        fuelConsumption: 0,
        space: 5,
        image: 'https://via.placeholder.com/300x200/16a085/ffffff?text=BYD+Han+EV',
        isHot: false
    },
    {
        id: 6,
        name: '理想L9',
        brand: '理想',
        type: 'SUV',
        powerType: '插混',
        price: 799,
        rating: 4.8,
        ratingCount: 934,
        fuelConsumption: 1.8,
        space: 6,
        image: 'https://via.placeholder.com/300x200/8e44ad/ffffff?text=Li+L9',
        isHot: true
    },
    {
        id: 7,
        name: '蔚来ES6',
        brand: '蔚来',
        type: 'SUV',
        powerType: '纯电',
        price: 599,
        rating: 4.7,
        ratingCount: 1123,
        fuelConsumption: 0,
        space: 5,
        image: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=Nio+ES6',
        isHot: false
    },
    {
        id: 8,
        name: '小鹏P7',
        brand: '小鹏',
        type: '轿车',
        powerType: '纯电',
        price: 449,
        rating: 4.6,
        ratingCount: 892,
        fuelConsumption: 0,
        space: 5,
        image: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Xpeng+P7',
        isHot: false
    },
    {
        id: 9,
        name: '奔驰GLE',
        brand: '奔驰',
        type: 'SUV',
        powerType: '纯油',
        price: 899,
        rating: 4.9,
        ratingCount: 756,
        fuelConsumption: 9.5,
        space: 7,
        image: 'https://via.placeholder.com/300x200/2c3e50/ffffff?text=Mercedes+GLE',
        isHot: true
    },
    {
        id: 10,
        name: '宝马X5',
        brand: '宝马',
        type: 'SUV',
        powerType: '混动',
        price: 999,
        rating: 4.8,
        ratingCount: 643,
        fuelConsumption: 7.9,
        space: 7,
        image: 'https://via.placeholder.com/300x200/34495e/ffffff?text=BMW+X5',
        isHot: true
    },
    {
        id: 11,
        name: '奥迪Q7',
        brand: '奥迪',
        type: 'SUV',
        powerType: '纯油',
        price: 849,
        rating: 4.7,
        ratingCount: 532,
        fuelConsumption: 9.2,
        space: 7,
        image: 'https://via.placeholder.com/300x200/2980b9/ffffff?text=Audi+Q7',
        isHot: false
    },
    {
        id: 12,
        name: '特斯拉Model Y',
        brand: '特斯拉',
        type: 'SUV',
        powerType: '纯电',
        price: 599,
        rating: 4.8,
        ratingCount: 1834,
        fuelConsumption: 0,
        space: 5,
        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Tesla+Model+Y',
        isHot: true
    },
    // 添加更多模拟数据用于测试懒加载
    {
        id: 13,
        name: '保时捷Taycan',
        brand: '保时捷',
        type: '跑车',
        powerType: '纯电',
        price: 1299,
        rating: 4.9,
        ratingCount: 421,
        fuelConsumption: 0,
        space: 4,
        image: 'https://via.placeholder.com/300x200/c0392b/ffffff?text=Porsche+Taycan',
        isHot: true
    },
    {
        id: 14,
        name: '本田雅阁',
        brand: '本田',
        type: '轿车',
        powerType: '混动',
        price: 399,
        rating: 4.5,
        ratingCount: 1832,
        fuelConsumption: 4.2,
        space: 5,
        image: 'https://via.placeholder.com/300x200/2c3e50/ffffff?text=Honda+Accord',
        isHot: false
    },
    {
        id: 15,
        name: '丰田凯美瑞',
        brand: '丰田',
        type: '轿车',
        powerType: '混动',
        price: 429,
        rating: 4.6,
        ratingCount: 2156,
        fuelConsumption: 4.1,
        space: 5,
        image: 'https://via.placeholder.com/300x200/34495e/ffffff?text=Toyota+Camry',
        isHot: false
    },
    {
        id: 16,
        name: '大众途观L',
        brand: '大众',
        type: 'SUV',
        powerType: '纯油',
        price: 479,
        rating: 4.4,
        ratingCount: 1567,
        fuelConsumption: 7.8,
        space: 7,
        image: 'https://via.placeholder.com/300x200/16a085/ffffff?text=VW+Tiguan+L',
        isHot: false
    },
    {
        id: 17,
        name: '别克GL8',
        brand: '别克',
        type: 'MPV',
        powerType: '纯油',
        price: 599,
        rating: 4.5,
        ratingCount: 892,
        fuelConsumption: 8.5,
        space: 7,
        image: 'https://via.placeholder.com/300x200/8e44ad/ffffff?text=Buick+GL8',
        isHot: false
    },
    {
        id: 18,
        name: '沃尔沃XC90',
        brand: '沃尔沃',
        type: 'SUV',
        powerType: '插混',
        price: 799,
        rating: 4.7,
        ratingCount: 654,
        fuelConsumption: 2.1,
        space: 7,
        image: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=Volvo+XC90',
        isHot: false
    },
    {
        id: 19,
        name: '路虎揽胜',
        brand: '路虎',
        type: 'SUV',
        powerType: '纯油',
        price: 1499,
        rating: 4.8,
        ratingCount: 432,
        fuelConsumption: 11.2,
        space: 5,
        image: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Range+Rover',
        isHot: true
    },
    {
        id: 20,
        name: '凯迪拉克CT6',
        brand: '凯迪拉克',
        type: '轿车',
        powerType: '纯油',
        price: 699,
        rating: 4.5,
        ratingCount: 567,
        fuelConsumption: 8.1,
        space: 5,
        image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Cadillac+CT6',
        isHot: false
    },
    {
        id: 21,
        name: '雷克萨斯ES',
        brand: '雷克萨斯',
        type: '轿车',
        powerType: '混动',
        price: 579,
        rating: 4.7,
        ratingCount: 1234,
        fuelConsumption: 4.5,
        space: 5,
        image: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Lexus+ES',
        isHot: false
    },
    {
        id: 22,
        name: '日产天籁',
        brand: '日产',
        type: '轿车',
        powerType: '纯油',
        price: 349,
        rating: 4.3,
        ratingCount: 1789,
        fuelConsumption: 6.2,
        space: 5,
        image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Nissan+Altima',
        isHot: false
    },
    {
        id: 23,
        name: '马自达CX-5',
        brand: '马自达',
        type: 'SUV',
        powerType: '纯油',
        price: 399,
        rating: 4.5,
        ratingCount: 987,
        fuelConsumption: 7.1,
        space: 5,
        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Mazda+CX-5',
        isHot: false
    },
    {
        id: 24,
        name: '领克09',
        brand: '领克',
        type: 'SUV',
        powerType: '插混',
        price: 599,
        rating: 4.6,
        ratingCount: 543,
        fuelConsumption: 1.9,
        space: 6,
        image: 'https://via.placeholder.com/300x200/1abc9c/ffffff?text=Lynk+09',
        isHot: false
    }
];

// 显示的车辆列表
const carList = ref([]);
// 加载状态
const isLoading = ref(false);
// 是否还有更多数据
const noMoreData = ref(false);
// 当前加载的索引
const currentIndex = ref(0);
// 每次加载的数量（3行，每行4个）
const loadSize = 12;

// 初始化加载第一批数据
const loadInitialData = () => {
    carList.value = allCarData.slice(0, loadSize);
    currentIndex.value = loadSize;
};

// 加载更多数据
const loadMoreData = () => {
    if (isLoading.value || noMoreData.value) return;
    
    isLoading.value = true;
    
    // 模拟异步加载
    setTimeout(() => {
        const nextData = allCarData.slice(currentIndex.value, currentIndex.value + loadSize);
        
        if (nextData.length > 0) {
            carList.value.push(...nextData);
            currentIndex.value += nextData.length;
            
            if (currentIndex.value >= allCarData.length) {
                noMoreData.value = true;
            }
        } else {
            noMoreData.value = true;
        }
        
        isLoading.value = false;
    }, 500);
};

// 监听滚动事件
const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    // 当滚动到底部100px时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreData();
    }
};

// 车辆卡片点击
const handleCarClick = (car) => {
    message.info(`查看 ${car.name} 详情`);
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await userApi.getUserInfo();
        
        if (response.code === 200 && response.data) {
            const userData = response.data;
            username.value = userData.username || '租车用户';
            userAvatar.value = userData.avatarUrl || '';
            
            // 同步更新localStorage
            if (userData.username) {
                localStorage.setItem('username', userData.username);
            }
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        // 如果获取失败，从localStorage读取
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            username.value = storedUsername;
        }
    }
};

// 组件挂载时获取用户信息并初始化数据
onMounted(() => {
    // 获取用户信息（包括头像）
    fetchUserInfo();
    
    // 初始化加载数据
    loadInitialData();
    
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除监听
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 样式已移至独立的CSS文件: src/assets/css/index.css */
</style>

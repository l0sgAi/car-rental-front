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
                <!-- 管理后台按钮（仅管理员可见） -->
                <div class="admin-button" v-if="userRole === 1">
                    <n-button type="warning" @click="goToAdmin">
                        <template #icon>
                            <n-icon :component="SettingsOutline" />
                        </template>
                        管理后台
                    </n-button>
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
                                    class="filter-tag brand-tag"
                                >
                                    <template v-if="brand.logo">
                                        <img :src="brand.logo" :alt="brand.label" class="brand-logo" />
                                    </template>
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
                                <n-button v-if="priceFilterApplied" @click="clearPriceFilter" style="margin-left: 8px">
                                    清除
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
                                    <n-rate :value="car.rating" :allow-half="true" readonly size="small" />
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
            </div>
        </n-layout-content>
    </div>
    </n-config-provider>
</template>

<script setup>
import { ref, onMounted, h, watch } from 'vue';
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
import { userApi, carApi, brandApi } from '../api';

const router = useRouter();
const message = useMessage();

// 用户信息
const username = ref('租车用户');
const userAvatar = ref('');
const userRole = ref(0); // 用户角色：0=普通用户，1=管理员

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
    { label: '越野车', value: 'off-road' },
    { label: '特种车', value: 'business' }
];

// 品牌列表（从后端动态获取）
const brands = ref([
    { label: '全部', value: 'all', logo: null }
]);

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
    // console.log('搜索关键词:', searchKeyword.value);
    // message.info(`搜索: ${searchKeyword.value || '全部车辆'}`);
    // 重新加载
    fetchCarList();
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
    
    // 重新加载
    fetchCarList();
};

// 清除价格筛选
const clearPriceFilter = () => {
    priceRange.value = [0, 2000];
    tempPriceRange.value = [0, 2000];
    priceFilterApplied.value = false;
    
    message.info('已清除价格筛选');
    
    // 重新加载
    fetchCarList();
};

// 显示的车辆列表
const carList = ref([]);
// 加载状态
const isLoading = ref(false);
// 品牌ID映射
const brandIdMap = ref({});
// 品牌ID到名称的映射（用于显示）
const brandNameMap = ref({});

// 获取品牌列表并建立映射
const fetchBrandList = async () => {
    try {
        const response = await brandApi.getBrandList({ pageNum: 1, pageSize: 100 });
        console.log('品牌列表响应:', response);
        
        if (response.code === 200 && response.data) {
            // 注意：后端使用 Result.page() 返回的数据结构可能是 { records, total } 或直接是数组
            const brandList = response.data.records || response.data;
            
            if (Array.isArray(brandList) && brandList.length > 0) {
                // 重置品牌列表，保留"全部"选项
                brands.value = [
                    { label: '全部', value: 'all', logo: null }
                ];
                
                // 添加从后端获取的品牌
                brandList.forEach(brand => {
                    if (brand.id && brand.name) {
                        // 添加到品牌列表（用于UI显示）
                        brands.value.push({
                            label: brand.name,
                            value: brand.id, // 直接使用品牌ID作为value
                            logo: brand.logo || null
                        });
                        
                        // 建立ID映射（用于查询）- 支持数字和字符串类型的key
                        brandIdMap.value[brand.id] = brand.id;
                        brandIdMap.value[String(brand.id)] = brand.id; // 字符串形式的ID
                        brandIdMap.value[brand.name] = brand.id;
                        
                        // 建立ID到名称的反向映射（用于显示）- 支持数字和字符串类型的key
                        brandNameMap.value[brand.id] = brand.name;
                        brandNameMap.value[String(brand.id)] = brand.name; // 字符串形式的ID
                    }
                });
                
                console.log('品牌列表:', brands.value);
                console.log('品牌映射表:', brandIdMap.value);
                console.log('品牌名称映射表:', brandNameMap.value);
            } else {
                console.warn('品牌列表为空或格式不正确');
            }
        } else {
            console.error('获取品牌列表失败:', response.msg);
            message.warning('获取品牌列表失败，将使用默认筛选');
        }
    } catch (error) {
        console.error('获取品牌列表异常:', error);
        message.warning('获取品牌列表失败，将使用默认筛选');
    }
};

// 映射车型值到后端值
const mapCarType = (type) => {
    const typeMap = {
        'sedan': '轿车',
        'suv': 'SUV',
        'mpv': 'MPV',
        'sports': '跑车',
        'business': '特种车',
        'off-road': '越野车'
    };
    return type === 'all' ? null : typeMap[type] || null;
};

// 映射动力类型到后端值
const mapPowerType = (power) => {
    const powerMap = {
        'fuel': '纯油',
        'hybrid': '混动',
        'phev': '插混',
        'ev': '纯电'
    };
    return power === 'all' ? null : powerMap[power] || null;
};

// 映射品牌到brandId
const mapBrandId = (brandValue) => {
    if (brandValue === 'all' || !brandValue) return null;
    // 现在 brandValue 直接就是品牌ID（Long类型）
    return typeof brandValue === 'number' ? brandValue : null;
};

// 转换后端数据到前端显示格式
const transformCarData = (car) => {
    // 处理图片，取第一张
    const imageUrl = car.images ? car.images.split(',')[0] : 'https://via.placeholder.com/300x200/2c3e50/ffffff?text=Car';
    
    // 通过brandId获取品牌名称
    let brandName = '未知品牌';
    if (car.brand) {
        // 如果后端直接返回了brand字段（品牌名称）
        brandName = car.brand;
        console.log(`车辆 ${car.name} 使用后端返回的brand字段: ${brandName}`);
    } else if (car.brandName) {
        // 如果后端返回了brandName字段
        brandName = car.brandName;
        console.log(`车辆 ${car.name} 使用后端返回的brandName字段: ${brandName}`);
    } else if (car.brandId !== null && car.brandId !== undefined) {
        // 通过brandId从映射表获取品牌名称
        // 支持数字或字符串类型的brandId
        const brandId = car.brandId;
        if (brandNameMap.value[brandId]) {
            brandName = brandNameMap.value[brandId];
            console.log(`车辆 ${car.name} 通过brandId ${brandId} 映射到品牌: ${brandName}`);
        } else {
            console.warn(`车辆 ${car.name} 的brandId ${brandId} (类型: ${typeof brandId}) 在映射表中未找到`);
            console.warn('当前品牌名称映射表:', brandNameMap.value);
            console.warn('映射表的键类型:', Object.keys(brandNameMap.value).map(k => `${k}(${typeof k})`));
        }
    } else {
        console.warn(`车辆 ${car.name} 没有品牌相关字段 (brand/brandName/brandId):`, car);
    }
    
    return {
        id: car.id,
        name: car.name || '未知车辆',
        brand: brandName,
        type: car.carType || '轿车',
        powerType: car.powerType || '纯油',
        price: car.dailyRent ? parseFloat(car.dailyRent) : 0,
        rating: car.avgScore ? Math.min(car.avgScore / 2, 5) : 0, // 转换为0-5分制，最高5分
        ratingCount: 0, // 后端没有评分人数，设为0或使用默认值
        fuelConsumption: car.fuelConsumption || 0,
        space: car.seat || 5,
        image: imageUrl,
        isHot: car.hotScore && car.hotScore > 40 // 热度评分大于40视为热门
    };
};

// 获取车辆列表
const fetchCarList = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    
    try {
        // 构建查询参数（使用POST + RequestBody）
        const params = {};
        
        // 添加搜索关键字
        if (searchKeyword.value) {
            params.keyWord = searchKeyword.value;
        }
        
        // 添加筛选条件
        const carType = mapCarType(selectedCarType.value);
        const powerType = mapPowerType(selectedPowerType.value);
        const brandId = mapBrandId(selectedBrand.value);
        
        if (carType) {
            params.carType = carType;
        }
        if (powerType) {
            params.powerType = powerType;
        }
        if (brandId) {
            params.brandId = brandId;
        }
        
        // 添加价格筛选（如果已应用）
        if (priceFilterApplied.value) {
            if (priceRange.value[0] !== null && priceRange.value[0] !== undefined) {
                params.minimPrice = priceRange.value[0];
            }
            if (priceRange.value[1] !== null && priceRange.value[1] !== undefined) {
                params.maxPrice = priceRange.value[1];
            }
        }
        
        // 添加排序参数（0正序，1倒序）
        switch (selectedSort.value) {
            case 'rating':
                params.avgScore = 1; // 倒序，高分在前
                break;
            case 'hot':
                params.hotScore = 1; // 倒序，热度高在前
                break;
            case 'price':
                params.dailyRent = 0; // 正序，价格低在前
                break;
            case 'fuel':
                params.fuelConsumption = 0; // 正序，油耗低在前
                break;
            case 'space':
                params.seat = 1; // 倒序，座位多在前
                break;
        }
        
        console.log('查询参数:', params);
        
        const response = await carApi.globalQuery(params);
        
        console.log('车辆列表响应:', response);
        
        if (response.code === 200 && response.data) {
            console.log('开始转换车辆数据，数据量:', response.data.length);
            console.log('第一条车辆原始数据示例:', response.data[0]);
            console.log('当前品牌名称映射表:', brandNameMap.value);
            
            // 转换数据并直接替换列表
            carList.value = response.data.map(transformCarData);
            
            console.log('转换后的第一条车辆数据:', carList.value[0]);
        } else {
            message.error(response.msg || '获取车辆列表失败');
        }
    } catch (error) {
        console.error('获取车辆列表失败:', error);
        message.error('获取车辆列表失败，请稍后重试');
    } finally {
        isLoading.value = false;
    }
};


// 车辆卡片点击
const handleCarClick = (car) => {
    router.push(`/car/${car.id}`);
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await userApi.getUserInfo();
        
        if (response.code === 200 && response.data) {
            const userData = response.data;
            username.value = userData.username || '租车用户';
            userAvatar.value = userData.avatarUrl || '';
            userRole.value = userData.role || 0; // 获取用户角色
            
            // 同步更新localStorage
            if (userData.username) {
                localStorage.setItem('username', userData.username);
            }
            if (userData.role !== undefined) {
                localStorage.setItem('userRole', userData.role.toString());
            }
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        // 如果获取失败，从localStorage读取
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole');
        if (storedUsername) {
            username.value = storedUsername;
        }
        if (storedRole) {
            userRole.value = parseInt(storedRole);
        }
    }
};

// 跳转到管理后台
const goToAdmin = () => {
    router.push('/admin');
};

// 监听筛选条件和排序变化，自动重新加载
watch([selectedCarType, selectedBrand, selectedPowerType, selectedSort], () => {
    // 重新加载
    fetchCarList();
});

// 组件挂载时获取用户信息并初始化数据
onMounted(async () => {
    // 获取用户信息（包括头像）
    fetchUserInfo();
    
    // 先获取品牌列表（等待完成）
    await fetchBrandList();
    
    // 品牌列表加载完成后，再初始化加载车辆数据
    fetchCarList();
});
</script>

<style scoped>
/* 样式已移至独立的CSS文件: src/assets/css/index.css */

/* 品牌标签样式 */
.brand-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.brand-logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 2px;
}
</style>

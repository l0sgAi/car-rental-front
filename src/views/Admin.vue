<template>
    <n-config-provider :theme="darkTheme">
        <n-layout has-sider style="height: 100vh">
            <!-- 侧边栏 -->
            <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="64"
                :width="240"
                show-trigger
                @collapse="collapsed = true"
                @expand="collapsed = false"
                :collapsed="collapsed"
                style="background: #18181c"
            >
                <!-- Logo区域 -->
                <div class="admin-logo">
                    <n-icon size="32" :component="ShieldCheckmarkOutline" color="#18a058" />
                    <span v-show="!collapsed" class="logo-text">管理后台</span>
                </div>

                <!-- 导航菜单 -->
                <n-menu
                    v-model:value="activeKey"
                    :collapsed="collapsed"
                    :collapsed-width="64"
                    :collapsed-icon-size="22"
                    :options="menuOptions"
                    @update:value="handleMenuSelect"
                />
            </n-layout-sider>

            <!-- 主要内容区域 -->
            <n-layout>
                <!-- 顶部导航栏 -->
                <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
                    <div class="header-left">
                        <h2 style="margin: 0;">{{ currentPageTitle }}</h2>
                    </div>
                    <div class="header-right">
                        <n-space>
                            <n-button text @click="goBack">
                                <template #icon>
                                    <n-icon :component="ArrowBackOutline" size="20" />
                                </template>
                                返回首页
                            </n-button>
                            <n-divider vertical />
                            <!-- <n-avatar
                                size="small"
                                :src="userAvatar || ''"
                                fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                round
                            /> -->
                            <span>{{ username }}</span>
                        </n-space>
                    </div>
                </n-layout-header>

                <!-- 内容区域 -->
                <n-layout-content
                    content-style="padding: 24px;"
                    :native-scrollbar="false"
                    style="height: calc(100vh - 64px); overflow-y: auto;"
                >
                    <router-view />
                </n-layout-content>
            </n-layout>
        </n-layout>
    </n-config-provider>
</template>

<script setup>
import { ref, h, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';
import {
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NIcon,
    NButton,
    NAvatar,
    NSpace,
    NDivider,
    NConfigProvider
} from 'naive-ui';
import {
    ShieldCheckmarkOutline,
    PeopleOutline,
    CarSportOutline,
    ReceiptOutline,
    ChatbubbleEllipsesOutline,
    ArrowBackOutline
} from '@vicons/ionicons5';

const router = useRouter();
const route = useRoute();

// 侧边栏折叠状态
const collapsed = ref(false);

// 当前选中的菜单项
const activeKey = ref('users');

// 用户信息
const username = ref(localStorage.getItem('username') || '管理员');
const userAvatar = ref('');

// 菜单选项
const menuOptions = [
    {
        label: '用户管理',
        key: 'users',
        icon: () => h(NIcon, { component: PeopleOutline })
    },
    {
        label: '车辆管理',
        key: 'cars',
        icon: () => h(NIcon, { component: CarSportOutline })
    },
    {
        label: '订单管理',
        key: 'orders',
        icon: () => h(NIcon, { component: ReceiptOutline })
    },
    {
        label: '评论管理',
        key: 'comments',
        icon: () => h(NIcon, { component: ChatbubbleEllipsesOutline })
    }
];

// 页面标题映射
const pageTitleMap = {
    'users': '用户管理',
    'cars': '车辆管理',
    'orders': '订单管理',
    'comments': '评论管理'
};

// 当前页面标题
const currentPageTitle = computed(() => {
    return pageTitleMap[activeKey.value] || '管理后台';
});

// 处理菜单选择
const handleMenuSelect = (key) => {
    activeKey.value = key;
    router.push(`/admin/${key}`);
};

// 返回首页
const goBack = () => {
    router.push('/index');
};

// 根据当前路由设置活动菜单
onMounted(() => {
    const currentPath = route.path;
    if (currentPath.includes('/admin/users')) {
        activeKey.value = 'users';
    } else if (currentPath.includes('/admin/cars')) {
        activeKey.value = 'cars';
    } else if (currentPath.includes('/admin/orders')) {
        activeKey.value = 'orders';
    } else if (currentPath.includes('/admin/comments')) {
        activeKey.value = 'comments';
    }
});
</script>

<style scoped>
.admin-logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}

.header-left h2 {
    font-size: 20px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
}

.header-right {
    display: flex;
    align-items: center;
}
</style>


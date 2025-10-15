import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("../views/Index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 简单的路由守卫，检查是否已登录
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
    return;
  }

  // 检查管理员权限
  if (to.meta.requiresAdmin) {
    try {
      // 动态导入API
      const { userApi } = await import('../api');
      const response = await userApi.getUserInfo();
      
      if (response.code === 200 && response.data.role === 1) {
        next();
      } else {
        // 不是管理员，跳转回聊天页面
        next('/chat');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      next('/login');
    }
  } else {
    next();
  }
});

export default router;

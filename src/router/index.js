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
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    redirect: "/admin/users",
    children: [
      {
        path: "users",
        name: "UserManagement",
        component: () => import("../views/admin/UserManagement.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "cars",
        name: "CarManagement",
        component: () => import("../views/admin/CarManagement.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "orders",
        name: "OrderManagement",
        component: () => import("../views/admin/OrderManagement.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "comments",
        name: "CommentManagement",
        component: () => import("../views/admin/CommentManagement.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
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
      // 先检查localStorage中的角色信息
      const storedRole = localStorage.getItem('userRole');
      if (storedRole === '1') {
        next();
        return;
      }
      
      // 如果localStorage中没有，则从API获取
      const { userApi } = await import('../api');
      const response = await userApi.getUserInfo();
      
      if (response.code === 200 && response.data.role === 1) {
        // 保存到localStorage
        localStorage.setItem('userRole', '1');
        next();
      } else {
        // 不是管理员，跳转回首页
        alert('权限不足，仅管理员可访问');
        next('/index');
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

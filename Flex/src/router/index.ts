import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';

// Frappe API utilities
import { getFrappeAuth, checkPermissions } from '../utils/frappe';

const routes = [
  {
    path: '/app',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          doctype: null
        }
      },
      {
        path: 'members',
        name: 'members',
        component: () => import('../views/MemberManagement.vue'),
        meta: {
          title: 'Members',
          doctype: 'Gym Member',
          permissions: ['read']
        }
      },
      {
        path: 'classes',
        name: 'classes',
        component: () => import('../views/ClassScheduler.vue'),
        meta: {
          title: 'Classes',
          doctype: 'Gym Class',
          permissions: ['read']
        }
      },
      {
        path: 'trainers',
        name: 'trainers',
        component: () => import('../views/TrainerManagement.vue'),
        meta: {
          title: 'Trainers',
          doctype: 'Gym Trainer',
          permissions: ['read']
        }
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('../views/PaymentPortal.vue'),
        meta: {
          title: 'Payments',
          doctype: 'Gym Payment',
          permissions: ['read']
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Login',
      layout: 'blank'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  document.title = `${to.meta.title} | Flex Gym Management`;

  // Handle authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await getFrappeAuth();
    
    if (!isAuthenticated) {
      next({ 
        name: 'login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Check doctype permissions if specified
    if (to.meta.doctype && to.meta.permissions) {
      const hasPermission = await checkPermissions(to.meta.doctype, to.meta.permissions);
      if (!hasPermission) {
        next({ name: 'dashboard' });
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
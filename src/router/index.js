import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import Chat from '../views/Chat.vue';
import Invitations from '../views/Invitations.vue';
import AddnewCreateGroup from '../views/AddnewCreateGroup.vue';
import ResetPasswordPage from '../views/ResetPasswordPage.vue';
import Profile from '../views/Profile.vue';
import NotFoundPage from "../views/NotFoundPage.vue"
import { auth } from '../firebase/Config.js';



const routes = [
  { path: '/', component: Home ,meta: { requiresAuth: true }  },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: RegisterPage },
  { path: '/chat/:chatid', component: Chat, props: true ,meta: { requiresAuth: true }  }, // Pass props to Chat component
  { path: '/invitations', component: Invitations ,meta: { requiresAuth: true }  },
  { path: '/add-user-group', component: AddnewCreateGroup,meta: { requiresAuth: true }   },
  { path: '/reset-password', component: ResetPasswordPage ,},
  { path: '/profile', component: Profile,meta: { requiresAuth: true }   },
  { path: '/:catchAll(.*)', component: NotFoundPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;
  /*
  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }*/

  if (requiresAuth) {
    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, allow access to the route
        next();
      } else {
        // User is not logged in, redirect to the login page
        next('/login');
      }
    });
  } else {
    // Route does not require authentication, allow access
    next();
  }

});

export default router;

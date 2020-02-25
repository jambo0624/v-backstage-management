import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "index" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "index" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "index" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "user" */ '../components/user/Users.vue')

const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName: "goods" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')

const Report = () => import(/* webpackChunkName: "report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'Cate',
        component: Cate
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/goods',
        name: 'List',
        component: List
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: Add
      },
      {
        path: '/orders',
        name: 'Order',
        component: Order
      },
      {
        path: '/reports',
        name: 'Report',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径跳转而来
  // next是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

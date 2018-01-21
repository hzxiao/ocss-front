import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login.vue'
import Main from '../views/index.vue'
import Empty from '../components/layout/empty.vue'

Vue.use(Router)

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: Login
}

//管理员的功能路径
export const adminRouter = [{
    title: '数据统计',
    path: '/statistics',
    name: 'statistics',
    icon: 'stats-bars',
    component: Empty
}, {
    title: '个人设置',
    path: '/profile',
    name: 'profile',
    icon: 'android-settings',
    meta: {
        hidden: true, // set it invisible on sidebar
        auth: ['ROLE_USER']
    },
    component: Empty
}, {
    title: '学生管理',
    path: '/student',
    name: 'student',
    icon: 'person',
    component: Empty,
    children: [{
            title: '学生列表',
            name: 'stu_list',
            path: 'list',
            icon: 'ios-people',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        },
        {
            title: '新增学生',
            name: 'stu_new',
            path: 'add',
            icon: 'person-add',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        }
    ]
}, {
    title: '教师管理',
    path: '/teacher',
    name: 'teacher',
    icon: 'person',
    component: Empty,
    children: [{
            title: '教师列表',
            name: 'teacher_list',
            path: 'list',
            icon: 'ios-people',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        },
        {
            title: '新增教师',
            name: 'teacher_new',
            path: 'add',
            icon: 'person-add',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        }
    ]
}, {
    title: '课程管理',
    path: '/course',
    name: 'course',
    icon: 'person',
    component: Empty,
    children: [{
            title: '课堂列表',
            name: 'course_list',
            path: 'list',
            icon: 'ios-people',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        },
        {
            title: '新增课程',
            name: 'course_new',
            path: 'add',
            icon: 'person-add',
            component: Empty,
            meta: {
                auth: ['ROLE_USER']
            }
        }
    ]
}]

export default new Router({
    routes: [{
        path: '/',
        name: 'Home',
        component: Main,
        children: adminRouter
    }, loginRouter]
})
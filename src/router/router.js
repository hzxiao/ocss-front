import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () =>
        import ('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: { i18n: 'home' },
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
        {
            path: 'order/:order_id',
            title: '订单详情',
            name: 'order-info',
            component: () =>
                import ('@/views/advanced-router/component/order-info.vue')
        }, // 用于展示动态路由
        {
            path: 'shopping',
            title: '购物详情',
            name: 'shopping',
            component: () =>
                import ('@/views/advanced-router/component/shopping-info.vue')
        }, // 用于展示带参路由
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [{
            path: 'index',
            title: '权限管理',
            name: 'access_index',
            component: () =>
                import ('@/views/access/access.vue')
        }]
    },
    {
        path: '/course_management',
        icon: 'ios-book',
        name: 'course-management',
        title: '课程管理',
        component: Main,
        children: [{
            path: 'index',
            title: '课程管理',
            name: 'course-management_index',
            component: () =>
                import ('@/views/course-management/course-management.vue')
        }, ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 1,
        component: Main,
        children: [{
            path: 'index',
            title: '权限测试页',
            name: 'accesstest_index',
            access: 0,
            component: () =>
                import ('@/views/access/access-test.vue')
        }]
    },
    {
        path: '/international',
        icon: 'earth',
        title: { i18n: 'international' },
        name: 'international',
        component: Main,
        access: 3,
        children: [{
            path: 'index',
            title: { i18n: 'international' },
            name: 'international_index',
            component: () =>
                import ('@/views/international/international.vue')
        }]
    },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '组件',
        component: Main,
        children: [{
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '富文本编辑器',
                component: () =>
                    import ('@/views/my-components/text-editor/text-editor.vue')
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: () =>
                    import ('@/views/my-components/markdown-editor/markdown-editor.vue')
            },
            {
                path: 'image-editor',
                icon: 'crop',
                name: 'image-editor',
                title: '图片预览编辑',
                component: () =>
                    import ('@/views/my-components/image-editor/image-editor.vue')
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: () =>
                    import ('@/views/my-components/draggable-list/draggable-list.vue')
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '城市级联',
                component: () =>
                    import ('@/views/my-components/area-linkage/area-linkage.vue')
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: () =>
                    import ('@/views/my-components/file-upload/file-upload.vue')
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                // component: () => import('@/views/my-components/count-to/count-to.vue')
                component: () =>
                    import ('@/views/my-components/count-to/count-to.vue')
            },
            {
                path: 'split-pane-page',
                icon: 'ios-pause',
                name: 'split-pane-page',
                title: 'split-pane',
                component: () =>
                    import ('@/views/my-components/split-pane/split-pane-page.vue')
            }
        ]
    },
    {
        path: '/form',
        icon: 'android-checkbox',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [{
                path: 'artical-publish',
                title: '文章发布',
                name: 'artical-publish',
                icon: 'compose',
                component: () =>
                    import ('@/views/form/article-publish/article-publish.vue')
            },
            {
                path: 'workflow',
                title: '工作流',
                name: 'workflow',
                icon: 'arrow-swap',
                component: () =>
                    import ('@/views/form/work-flow/work-flow.vue')
            }

        ]
    },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

    //     ]
    // },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [{
                path: 'dragableTable',
                title: '可拖拽排序',
                name: 'dragable-table',
                icon: 'arrow-move',
                component: () =>
                    import ('@/views/tables/dragable-table.vue')
            },
            {
                path: 'editableTable',
                title: '可编辑表格',
                name: 'editable-table',
                icon: 'edit',
                component: () =>
                    import ('@/views/tables/editable-table.vue')
            },
            {
                path: 'searchableTable',
                title: '可搜索表格',
                name: 'searchable-table',
                icon: 'search',
                component: () =>
                    import ('@/views/tables/searchable-table.vue')
            },
            {
                path: 'exportableTable',
                title: '表格导出数据',
                name: 'exportable-table',
                icon: 'code-download',
                component: () =>
                    import ('@/views/tables/exportable-table.vue')
            },
            {
                path: 'table2image',
                title: '表格转图片',
                name: 'table-to-image',
                icon: 'images',
                component: () =>
                    import ('@/views/tables/table-to-image.vue')
            }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [{
                path: 'mutative-router',
                title: '动态路由',
                name: 'mutative-router',
                icon: 'link',
                component: () =>
                    import ('@/views/advanced-router/mutative-router.vue')
            },
            {
                path: 'argument-page',
                title: '带参页面',
                name: 'argument-page',
                icon: 'android-send',
                component: () =>
                    import ('@/views/advanced-router/argument-page.vue')
            }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [{
            path: 'index',
            title: '错误页面',
            name: 'errorpage_index',
            component: () =>
                import ('@/views/error-page/error-page.vue')
        }]
    },
    {
        path: '/students',
        icon: 'android-sad',
        title: '学生管理',
        name: 'manage-student',
        component: Main,
        meta: {
            roles: [1]
        },
        children: [{
                path: 'listStudent',
                title: '学生列表',
                name: 'list-student',
                component: () =>
                    import ('@/views/manage-student/list-student.vue')
            },
            {
                path: 'addStudent',
                title: '添加学生',
                name: 'add-student',
                component: () =>
                    import ('@/views/manage-student/add-student.vue')
            },
            {
                path: 'editStudent',
                title: '编辑学生',
                name: 'edit-student',
                component: () =>
                  import ('@/views/manage-student/edit-student.vue')
            }
        ]
    },
    {
        path: '/teachers',
        icon: 'android-sad',
        title: '教师管理',
        name: 'manage-teacher',
        component: Main,
        meta: {
            roles: [1]
        },
        children: [{
                path: 'listTeacher',
                title: '教师列表',
                name: 'list-teacher',
                component: () =>
                    import ('@/views/manage-teacher/list-teacher.vue')
            },
            {
                path: 'addTeacher',
                title: '添加教师',
                name: 'add-teacher',
                component: () =>
                    import ('@/views/manage-teacher/add-teacher.vue')
            },
            {
                path: 'editTeacher',
                title: '编辑教师',
                name: 'edit-teacher',
                component: () =>
                  import ('@/views/manage-teacher/edit-teacher.vue')
            }
        ]
    },
    {
        path: '/courses',
        icon: 'android-sad',
        title: '课程管理',
        name: 'manage-course',
        component: Main,
        meta: {
            roles: [1]
        },
        children: [{
                path: 'listCourse',
                title: '课程列表',
                name: 'list-course',
                component: () => import ('@/views/manage-course/list-course.vue')
            },
            {
                path: 'addCourse',
                title: '添加课程',
                name: 'add-course',
                component: () => import ('@/views/manage-course/add-course.vue')
            },
            {
                path: 'editCourse',
                title: '编辑课程',
                name: 'edit-course',
                component: () => import ('@/views/manage-course/edit-course.vue')
            }
        ]
    },
    {
        path: '/teach-courses',
        icon: 'android-sad',
        title: '选课管理',
        name: 'manage-teach-course',
        component: Main,
        meta: {
            roles: [1]
        },
        children: [{
                path: 'listTeachCourse',
                title: '选课列表',
                name: 'list-teach-course',
                component: () =>
                    import ('@/views/manage-teach-course/list-tc.vue')
            },
            {
                path: 'addTeachCourse',
                title: '添加选课',
                name: 'add-teach-course',
                component: () =>
                    import ('@/views/manage-teach-course/add-tc.vue')
            }
        ]
    },
    {
        path: '/teacher-courses',
        icon: 'android-sad',
        title: '我的课程',
        name: 'teacher-course',
        component: Main,
        meta: {
            roles: [2]
        },
        children: [{
            path: 'listTeacherCourse',
            title: '我的课程',
            name: 'list-teacher-course',
            component: () =>
                import ('@/views/abstract.vue')
        }]
    },
    {
        path: '/grades',
        icon: 'android-sad',
        title: '成绩管理',
        name: 'manage-grade',
        component: Main,
        meta: {
            roles: [2]
        },
        children: [{
            path: 'setGrade',
            title: '成绩管理',
            name: 'setting-grade',
            component: () =>
                import ('@/views/abstract.vue')
        }]
    },
    {
        path: '/student-courses',
        icon: 'android-sad',
        title: '我的课程',
        name: 'student-course',
        component: Main,
        meta: {
            roles: [3]
        },
        children: [{
            path: 'listStudentCourse',
            title: '我的课程',
            name: 'list-student-course',
            component: () =>
                import ('@/views/student-page/student-course.vue')
        }]
    },
    {
        path: '/select-courses',
        icon: 'android-sad',
        title: '选课中心',
        name: 'select-course-center',
        component: Main,
        meta: {
            roles: [3]
        },
        children: [{
            path: 'selectCourse',
            title: '选课中心',
            name: 'select-course',
            component: () =>
                import ('@/views/student-page/select-course-center.vue')
        }]
    },
    {
        path: '/teach-course-detail',
        icon: 'android-sad',
        title: '课程详情',
        name: 'teach-course-detail',
        component: Main,
        meta: {
            roles: [5]
        },
        children: [{
            path: 'index',
            title: '课程详情',
            name: 'teach-course-detail-adm',
            component: () =>
              import ('@/views/manage-teach-course/teach-course-detail.vue')
        }]
    },
    {
        path: '/playground',
        title: 'Playground',
        name: 'playground',
        component: Main,
        meta: {
            roles: [1]
        },
        children: [{
            path: 'index',
            title: 'playground',
            name: '0',
            component: () =>
                import('@/views/playground/index.vue')
        }]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
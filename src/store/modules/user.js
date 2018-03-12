import Cookies from 'js-cookie';
import * as types from '../mutation-types'

const user = {
    state: {
        userDetail: {},
        token: null,
        userId: null
    },
    mutations: {
        [types.SET_USER](state, user) {
            if (user) {
                state.userDetail = user
                state.userId = user.id
                sessionStorage.setItem('userId', user.userId)
                state.token = user.token
                state.role = user.role
            }
        },

        [types.SET_USER_TOKEN](state, token) {
            if (token) {
                state.token = token
            }
        },

        logout (state) {
            state.userDetail = {}
            state.userId = null
            state.token = null
            localStorage.clear()
            sessionStorage.clear()

            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    },
    getters: {
        token ({ token }) {
            return JSON.parse(sessionStorage.getItem('token')) || token
        }
    },
    actions: {
        login ({ _, commit }, data) {
            console.log(data)
            commit(types.SET_USER, data.user)
        },
        logout ({ _, commit }) {
            commit(types.CLEAR_USER)
        }
    }
};

export default user;

import * as types from '../mutation-types'
import { adminRouter } from '../../router'

const state = {
    adminMenuList: [],
    currentPath: [], // 面包屑数组
    menuTheme: null, // 主题
    theme: null
}

const getters = {
    sidebarMenuList: (state, getters) => {
        return adminRouter.slice()
    },
    a: (state, getters) => {
        return 'a'
    }
}

export default {
    state,
    getters,
    // actions,
    // mutations
}
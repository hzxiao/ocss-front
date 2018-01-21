import * as types from '../mutation-types'
import storage from './storage'

const state = {
    userDetail: {},
    token: null,
    userId: null
}

// getters
const getters = {
    token: state => {
        // check whether the token still valid
        let strToken = storage.state.storage.getItem('userToken')
        let localToken = null
        if (strToken) {
            localToken = JSON.parse(strToken)
        }
        let token = localToken || state.token
        return token
    },
    userDetail: state => {
        return state.userDetail
    },
    roles: state => {
        return state.userDetail.role
    }
}

const mutations = {

    [types.SET_USER]: (state, user) => {
        if (user) {
            state.userDetail = user;
            state.userId = user.userId;
            storage.state.storage.setItem('userId', user.userId);
            state.token = user.token;
        }
    },
    [types.SET_USER_TOKEN]: (state, token) => {
        if (token) {
            state.token = token
        }
    },
    [types.CLEAR_USER]: (state) => {
        state.userDetail = {}
        state.userId = null
        localStorage.clear()
        sessionStorage.clear()
    }
}

const actions = {
    initUser({ dispatch, commit }, user) {
        commit(types.SET_USER, user);
    },
    logout({ dispatch, commit }) {
        commit(types.CLEAR_USER);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
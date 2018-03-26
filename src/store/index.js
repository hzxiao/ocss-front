import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import tc from './modules/teach-course'
import courses from './modules/course'
import teachers from './modules/teacher'


Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {
        batchRequest({ dispatch }, batches) {
            batches && batches.forEach(name => {
                dispatch(`${name}/request`)
            })
        }
    },
    modules: {
        app,
        user,
        tc,
        courses,
        teachers
    }
})

export default store

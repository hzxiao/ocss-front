import * as types from './teach-course-types'
import { createRequestAction } from '../../createRequestAction'

const namespace = 'tc'

export default {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    ...createRequestAction(namespace, types)
}
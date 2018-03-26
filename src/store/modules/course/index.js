import * as types from './course-types'
import { createRequestAction } from '../../createRequestAction'

const namespace = 'courses'

const requestAction = createRequestAction(namespace, types, {
    requestPath: 'courseList'
})

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
    ...requestAction
}

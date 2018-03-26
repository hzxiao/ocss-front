import * as types from './teacher-types'
import {createRequestAction} from '../../createRequestAction'

const namespace = 'teachers'

const requestAction = createRequestAction(namespace, types, {
    requestPath: 'teacherList'
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

// export default requestAction
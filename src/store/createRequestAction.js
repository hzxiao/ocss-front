import { toData } from './utils'
import { axios } from '@/libs/httpUtil'

export function createRequestAction (
    namespace,
    types,
    {
        requestPath,
        updatePath,
        createPath
    } = {
        requestPath: namespace + 'List',
        updatePath: namespace + '',
        createPath: namespace
    }) {
    const api = createAPIPath(namespace)

    return {
        namespaced: true,
        state: {
            data: []
        },
        mutations: {
            [types.LOAD_DATA](state, payload) {
                state.data = payload
            }
        },
        getters: {
            data ({ data }) {
                return data
            },
            mapProp ({ data }) {
                return prop => data.map(data => data[prop])
            }
        },
        actions: {
            request ({ commit }) {
                axios.get(api.list)
                    .then(toData)
                    .then(commitToData(commit, requestPath, types.LOAD_DATA))
            },
            update ({ commit }) {
                // axios.put()
            },
            create ({ commit }, data) {
                console.log(namespace + '/create')
                axios.post(api.add, data)
                    .then(toData)
                    .then(commitToData(commit, requestPath, types))
            }
        }
    }
}

function createAPIPath(id) {
    return {
        list: `/${id}/list`,
        delete: `/${id}/delete`,
        add: `${id}/add`
    }
}

function commitToData (commit, resPath, commitPath) {
    return ({ [resPath]: payload }) => {
        console.log(`${commitPath}/${resPath}`, payload)
        commit(commitPath, payload)
    }
}

export function completeAssign (target, ...sources) {
    sources.forEach(source => {
        let descriptors = Object.keys(source).reduce((descriptor, key) => {
            descriptor[key] = Object.getOwnPropertyDescriptor(source, key)
            return descriptor
        }, {})

        Object.getOwnPropertySymbols(source).forEach(sym => {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym)
            if (descriptor.enumerable) {
                descriptors[sym] = descriptor
            }
        })
        Object.defineProperties(target, descriptors)
    })
    return target
}

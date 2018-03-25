import axios from 'axios'
import Notice from 'iview/src/components/notice'
import store from '../store'
import Cookies from 'js-cookie';


axios.defaults.baseURL = `http://111.230.242.177:8999`
    // axios.defaults.baseURL = `http://localhost:8999`
    // http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json'
            // if (store.getters.token) {
        console.log(store.getters.token)
        config.headers['Authorization'] = `Bearer ${Cookies.get('token')}`
            // }
        console.log(config.headers)
        return config
    },
    err => {
        return Promise.reject(err)
    })

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    if (error.response && error.response.data && error.response.data.message) {
                        Notice.error({
                            title: error.response.data.message,
                            duration: 5,
                            closable: true
                        })
                    }
                    break
                case 401:
                    // 401 清除token信息
                    store.dispatch('logout')
                    break
                case 403:
                    Notice.error({
                        title: '没有操作权限',
                        duration: 5,
                        closable: true
                    })
                    break
                case 404:
                    Notice.error({
                        title: '找不到',
                        duration: 5,
                        closable: true
                    })
                    break
                case 500:
                    Notice.error({
                        title: '服务器出了小问题',
                        duration: 5,
                        closable: true
                    })
                    break
            }
        }
        return Promise.reject(error)
    })

const httpUtil = {
    fetch: axios,
    cleanArray: function(actual) {
        const newArray = []
        for (let i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i])
            }
        }
        return newArray
    },
    createRequestOption: function(params) {
        if (!params || params === 'undefined' || params === undefined) return ''
        return this.cleanArray(Object.keys(params).map(key => {
            if (!params[key] || params[key] === undefined || params[key] === 'undefined') return ''
            if (key === 'page') {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key] - 1)
            }
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(params[key])
        })).join('&')
    },
    createQueryOption: function(params) {
        if (!params) {
            return ''
        }
        let options = '?'

        let { page, pageSize, sortWay, } = params

        if (page && pageSize) {
            page--
            options = options + 'page=' + parseInt(page, 10) + '&pageSize=' + parseInt(size, 10)
        }

        let sort = null
        if (sortWay) {
            let { prop, order } = sortWay

            if (prop) {
                if (order === 'desc') {
                    order = 'desc'
                    sort = prop + ',' + order
                } else if (order === 'asc') {
                    order = 'asc'
                    sort = prop + ',' + order
                }
            }
        }
        if (sort) {
            options = options + '&sort=' + sort
        }
        return options
    },
    createSearchOption: function(params) {
        let options = '?'

        let { page, size, sortWay } = params

        if (page && size) {
            page--
            options = options + 'page=' + parseInt(page, 10) + '&size=' + parseInt(size, 10)
        }

        let sort = null
        if (sortWay) {
            let { prop, order } = sortWay

            if (prop) {
                if (order === 'descending') {
                    order = 'desc'
                } else {
                    order = 'asc'
                }
                sort = prop + ',' + order
            }
        }
        if (sort) {
            options = options + '&sort=' + sort
        }
        return options
    },
    createOption: function (o) {
        let obj = JSON.parse(JSON.stringify(o))
        let options = '?';
        for (let k in obj) {
            if (k === 'page' && obj[k] > 0) {
                obj[k] = obj[k] - 1;
            }
            options = options + k +'=' + obj[k]+'&';
        }
        return options.substring(0, options.length-1);
        //
        // if (!obj) return;
        // const params = Object.keys(obj)
        //     .map(key => obj[key]
        //         ? key === 'page'
        //             ? `${key}=${obj[key] - 1}`
        //             : `${key}=${obj[key] - 1}`
        //         : '')  // {key: val, someKey: ''} -> ["key=val", ""] produce string of "key=val" or empty "" if non val is provided
        //     .filter(s => s)  // clean empty string
        //     .join('&')
        // return '?' + params
    }
}

export default httpUtil

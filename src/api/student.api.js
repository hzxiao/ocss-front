import httpUtil from '../libs/httpUtil'

export default {
    url: '/students/',
    list(params) {
        let options = httpUtil.createQueryOption(params)
        return httpUtil.fetch({
            url: this.url + options,
            method: 'get'
        })
    },
    fetchData(params) {
        let options = httpUtil.createQueryOption(params)
        return httpUtil.fetch({
            url: this.url + 'all' + options,
            method: 'get'
        })
    },
    create(data) {
        return httpUtil.fetch({
            url: this.url + 'add',
            method: 'post',
            data
        })
    },
    update(data) {
        return httpUtil.fetch({
            url: this.url,
            method: 'put',
            data
        })
    },
    find(id) {
        return httpUtil.fetch({
            url: this.url + encodeURIComponent(id),
            method: 'get'
        })
    },
    delete(id) {
        return httpUtil.fetch({
            url: `${this.url}/${id}`,
            method: 'delete'
        })
    },
    advancedSearch(searchStr, params) {
        let options = httpUtil.createQueryOption(params)
        return httpUtil.fetch({
            url: this.url + 'adv/' + encodeURIComponent(searchStr) + options,
            method: 'get'
        })
    },
    login(data) {
        return httpUtil.fetch({
            url: '/login',
            method: 'post',
            data
        })
    },
    getUserInfo() {
        return httpUtil.fetch({
            url: '/account',
            method: 'get'
        })
    },
    count(data) {
        return httpUtil.fetch({
            url: '/count',
            method: 'post',
            data
        })
    }
}
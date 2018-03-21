import httpUtil from '../libs/httpUtil'

export default {
    url: '/teachers/',
    list(params) {
        let options = httpUtil.createOption(params);
        return httpUtil.fetch({
            url: this.url +'list' + options,
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
            url: this.url+data.id,
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
    delete(ids) {
        let data = {ids: ids};
        return httpUtil.fetch({
            url: `${this.url}delete/`,
            method: 'delete',
            data
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
    },
    getById(id) {
        return httpUtil.fetch({
            url: this.url + id,
            method: 'get'
        })
    }
}
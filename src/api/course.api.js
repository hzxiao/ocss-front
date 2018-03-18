import httpUtil from '../libs/httpUtil'

export default {
    url: '/courses/',
    list(params) {
        const options = httpUtil.createOption(params);
        if (options) {
            return httpUtil.fetch({
                url: this.url + 'list' + options,
                method: 'get'
            })
        }
        return httpUtil.fetch({
            url: this.url + 'list',
            method: 'get'
        })
    },

    create (data) {
        return httpUtil.fetch({
            url: this.url + 'add',
            method: 'post',
            data
        })
    },

    delete(ids) {
        const data = { ids }
        return httpUtil.fetch({
            url: this.url + 'delete/',
            method: 'delete',
            data
        })
    },

    find (id) {
        return httpUtil.fetch({
            url: this.url + id,
            method: 'get'
        })
    },

    update (data) {
        return httpUtil.fetch({
            url: this.url + data.id,
            method: 'put',
            data
        })
    },

    count (data) {
        return httpUtil.fetch({
            url: '/count',
            method: 'post',
            data
        })
    }
}
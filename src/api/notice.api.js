import httpUtil from '../libs/httpUtil'

export default {
    url: '/notices/',
    list(params) {
        let options = httpUtil.createOption(params);
        return httpUtil.fetch({
            url: this.url +'list' + options,
            method: 'get'
        })
    },

    update(data) {
        return httpUtil.fetch({
            url: this.url+data.id,
            method: 'put',
            data
        })
    },
    count() {
        return httpUtil.fetch({
            url: this.url+'count',
            method: 'get'
        })
    },
    getById(id) {
        return httpUtil.fetch({
            url: this.url + id,
            method: 'get'
        })
    }
}
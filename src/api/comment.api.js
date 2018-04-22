import httpUtil from '../libs/httpUtil'

export default {
    url: '/comments',
    list (params) {
        let options = httpUtil.createOption(params)
        return httpUtil.fetch({
            url: this.url + '/list' + options,
            method: 'get'
        })
    },
    addComment (data) {
        return httpUtil.fetch({
            url: `${this.url}/add`,
            method: 'post',
            data
        })
    },
    addChildComment (id,data) {
        return httpUtil.fetch({
            url: `${this.url}/${id}/children`,
            method: 'post',
            data
        })
    },


    delete (id) {
        return httpUtil.fetch({
            url: `${this.url}/delete/${id}`,
            method: 'delete'
        })
    },

    deleteChildComment (id,childId) {
        return httpUtil.fetch({
            url: `${this.url}/delete/${id}/children/${childId}`,
            method: 'delete'
        })
    },
}

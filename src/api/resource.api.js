import httpUtil from '../libs/httpUtil'

export default {
    url: '/resources',
    urlFile: 'files',
    list (params) {
        let options = httpUtil.createOption(params)
        return httpUtil.fetch({
            url: this.url + '/list' + options,
            method: 'get'
        })
    },
    add (data) {
        return httpUtil.fetch({
            url: `${this.url}/add`,
            method: 'post',
            data
        })
    },

    delete(data) {
        return httpUtil.fetch({
            url: this.url + '/delete/',
            method: 'delete',
            data
        })
    },


    upload (data) {
        return httpUtil.fetch({
            url: this.urlFile ,
            method: 'post',
            data
        })
    },

    getFile (id,params){
        let options = httpUtil.createOption(params);
        return httpUtil.fetch({
            url: `${this.urlFile}/${id}` + options,
            method: 'get'
        })
    }

}

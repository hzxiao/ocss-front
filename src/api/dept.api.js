import httpUtil from '../libs/httpUtil'

export default {
    url: '/depts',
    listAll() {
        return httpUtil.fetch({
            url: this.url,
            method: 'get'
        })
    }
}
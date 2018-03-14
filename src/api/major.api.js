import httpUtil from '../libs/httpUtil'

export default {
    url: '/majors',
    list(deptId) {
        return httpUtil.fetch({
            url: this.url + '?deptId=' + deptId,
            method: 'get'
        })
    }
}
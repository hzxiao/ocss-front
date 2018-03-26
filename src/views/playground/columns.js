export default [{
    type: 'selection',
    width: 60,
    align: 'center'
}, {
    title: '课程',
    key: 'courseName'
}, {
    title: '任课老师',
    key: 'name'
}, {
    title: '开课学院',
    key: 'deptName'
}, {
    title: '余量/总量',
    key: 'marginAndCap'
}, {
    title: '开始选课时间',
    key: 'schoolYear'
}, {
    title: '结束选课时间',
    key: 'end'
}, {
    title: '性质',
    key: 'nature'
}, {
    title: '归属',
    key: 'attr'
}, {
    title: 'Action',
    key: 'action',
    width: 150,
    align: 'center',
    render: (h, params) => {
        return h('div', [
            h(
                'Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '5px'},
                    on: {
                        click: () => {
                            this.$router.push({
                                name: 'edit-teacher',
                                params: {id: this.tcList[params.index].id}
                            })
                        }
                    }
                },
                '进入编辑'
            )
        ])
    }
}]

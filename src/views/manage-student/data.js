export const stuList = [
    {
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park'
    },
    {
        name: 'Jim Green',
        age: 24,
        address: 'London No. 1 Lake Park'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park'
    }
]

export const tableColumns = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '学号',
        key: 'student_id'
    },
    {
        title: '姓名',
        key: 'name'
    },
    {
        title: '学院',
        key: 'department'
    },
    {
        title: '专业',
        key: 'major'
    },
    {
        title: '年级',
        key: 'school_year'
    },
    {
        title: '班级',
        key: 'classes'
    },
    {
        title: 'Action',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
            return h('div', [
                h(
					'Button',
                    {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.editStuInfo(params.index)
                            }
                        }
                    },
					'编辑'
				),
                h(
					'Button',
                    {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.deleteStu(params.index)
                            }
                        }
                    },
					'删除'
				)
            ])
        }
    }
]

<style lang="less">
    @import './teacher-course.less';
</style>

<template>
    <div class="st">
        <div class="search">
            <Input v-model="searchText" icon="search" placeholder="输入课程名称或号码" style="width: 200px"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
        </div>

        <Table ref="table" :loading="tableLoading" :data="courses" :columns="tableColumns" stripe>
            <div slot="footer" style="padding-left:5px">
                <Page :total="total" :current="selectCond.page"
                      size="small"
                      :page-size="selectCond.pageSize"
                      placement="top"
                      @on-change="changePage"
                      @on-page-size-change="changePageSize"
                      show-elevator show-total show-sizer></Page>
            </div>
        </Table>
    </div>

</template>

<script>
    import {TcApi} from '../../api'
    import util from '../../libs/util';
    import Cookies from 'js-cookie';
    export default {
        data() {
            return {
                total: 0,
                tableLoading: false,
                searchText: '',
                selectCond: {
                    name: '',
                    selectState: 0,
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                tableColumns: [{
                    title: '课程',
                    key: 'courseName'
                }, {
                    title: '任课老师',
                    key: 'teacherName'
                }, {
                    title: '开课学院',
                    key: 'deptName'
                }, {
                    title: '上课时间',
                    key: 'startEndTime'
                }, {
                    title: '起始结束周',
                    key: 'startEndWeek'
                }, {
                    title: '上课地点',
                    key: 'addr'
                },  {
                    title: '性质',
                    key: 'nature'
                }, {
                    title: '归属',
                    key: 'attr'
                }, {
                    title: '状态',
                    key: 'tcStatus'
                },{
                    title: '操作',
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
                                            this.$router.push({name: 'teacher-course-detail-tea', params: {id: this.courses[params.index].id}});
                                        }
                                    }},
                                '查看'
                            )
                        ])
                    }
                }],
                courses: []
            }
        },
        methods: {
            doSearch() {
                this.tableLoading = true;
                this.selectCond.name = this.searchText;
                this.selectCond.tid = Cookies.get('user');

                TcApi.list(this.selectCond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.courses = util.safe(data, 'data.tcList', []);
                    let tcsids = [];
                    for (let i = 0; i < this.courses.length; i++) {
                        this.courses[i].startEndWeek = this.courses[i].takeWeek.startWeek+'-'+this.courses[i].takeWeek.endWeek;
                        let learnTime = '';
                        if (this.courses[i].takeTime != null && this.courses[i].takeTime.dayOfWeek!=null&&this.courses[i].takeTime.sections!=null){
                            for (let j = 0; j < this.courses[i].takeTime.dayOfWeek.length && j < this.courses[i].takeTime.sections.length ; j++){
                                learnTime = learnTime + this.courses[i].takeTime.dayOfWeek[j] + ':'
                                    + this.courses[i].takeTime.sections[j] + '、';
                            }
                        }
                        this.courses[i].startEndTime = learnTime;

                    }


                        this.tableLoading = false;
                        this.total = util.safe(data, 'data.total', 0);
                    } else {
                        this.tableLoading = false;
                        return this.$Message.error(data.msg)
                    }
                })
            },
            updateBatch(upData) {
                TcApi.updateBatch(upData).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('修改成功');
                        this.capModel = false;
                        this.selectTimeModel = false;
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            changePage(page) {
                this.selectCond.page = page;
                this.doSearch();
            },
            changePageSize(size) {
                this.selectCond.pageSize = size;
                this.doSearch();
            },
        },
        mounted() {
            this.doSearch()
        }
    }
</script>

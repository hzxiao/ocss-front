<style lang="less">
    @import './list-course.less';
</style>

<template>
    <div class="st">
        <div class="search">
            <Input v-model="searchText" icon="search" placeholder="输入课程名称或号码" style="width: 200px"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
        </div>

        <div class="condition">
            <div class="cond-item">
                <p>学院：</p>
                <Select v-model="selectCond.deptId" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </div>
        </div>
        <div class="op-menu">
            <Button type="default" @click="doExport('课程列表')" :disabled="!selection.length">批量导出</Button>
            <Button type="default" @click="deleteBatch()" :disabled="!selection.length">批量删除</Button>
        </div>
        <Table ref="table" :loading="tableLoading" :data="courses" :columns="tableColumns"
               @on-selection-change="selectionChange" stripe>
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
    import {CourseApi, DeptApi} from '../../api'
    import util from '../../libs/util';

    export default {
        data() {
            return {
                total: 0,
                tableLoading: false,
                selection: [],
                searchText: '',
                selectCond: {
                    id: '',
                    name: '',
                    dept: '',
                    title: '',
                    schoolYear: '',
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                tableColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '课程号码',
                    key: 'id'
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '学院',
                    key: 'deptName'
                }, {
                    title: '归属',
                    key: 'attr'
                }, {
                    title: '学分',
                    key: 'credit'
                }, {
                    title: '描述',
                    key: 'desc'
                }, {
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
                                            this.$router.push({name: 'edit-course', params: {id: this.courses[params.index].id}});
                                        }
                                    }},
                                '编辑'
                            ), h(
                                'Button', {
                                    props: {type: 'error', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.deleteCourse(params.index)
                                        }
                                    }},
                                '删除'
                            )
                        ])
                    }
                }],
                deptList: [],
                courses: []
            }
        },
        methods: {
            initCondition() {
                DeptApi.listAll().then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.deptList = util.safe(data, 'data.deptList', [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },

            doSearch() {
                this.tableLoading = true;
                this.selectCond.id = this.searchText;
                this.selectCond.name = this.searchText;

                CourseApi.list(this.selectCond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.courses = util.safe(data, 'data.courseList', []);
                        this.tableLoading = false;
                        for (let i = 0; i < this.courses.length; i++) {
                            this.courses[i].deptName = this.courses[i].dept.name;
                        }
                        this.total = util.safe(data, 'data.total', 0);
                    } else {
                        this.tableLoading = false;
                        return this.$Message.error(data.msg)
                    }
                })
            },
            doExport(filename) {
                this.$refs.table.exportCsv({ filename })
            },
            deleteBatch() {
                this.$Modal.confirm({
                    title: '删除选中的课程',
                    content: '确定删除选中的课程，删除后不可恢复',
                    onOk: () => {
                        this.delete(this.selection.map(selection => selection.id))
                    }
                })
            },
            selectionChange(selection) {
                this.selection = selection
            },
            deleteCourse(index) {
                this.$Modal.confirm({
                    title: '删除选中的课程',
                    content: '确定删除选中的课程，删除后不可恢复',
                    onOk: () => this.delete([this.courses[index].id])
                })
            },
            delete(ids) {
                CourseApi.delete(ids).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功')
                        this.doSearch()
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
            condSelectChange() {
                this.doSearch()
            }
        },
        mounted() {
            this.initCondition();
            this.doSearch()
        }
    }
</script>

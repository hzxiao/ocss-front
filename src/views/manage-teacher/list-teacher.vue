<style lang="less">
    @import './list-teacher.less';
</style>

<template>
    <div class="st">
        <div class="search">
            <Input v-model="searchText" icon="search" placeholder="输入教师姓名或工号" style="width: 200px"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
        </div>

        <div class="condition">
            <div class="cond-item">
                <p>学院：</p>
                <Select v-model="selectCond.deptId" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">
                        {{ item.name}}
                    </Option>
                </Select>
            </div>

            <div class="cond-item">
                <p>职称：</p>
                <Select v-model="selectCond.title" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in titleList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>
        </div>
        <div class="op-menu">
            <Button type="default" @click="doExport()" :disabled="selection.length == 0">批量导出</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">批量删除</Button>
        </div>
        <Table ref="table" :loading="tableLoading" :data="teacherList" :columns="tableColumns"
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
    import {DeptApi, TeacherApi} from '../../api'
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
                    deptId: '',
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
                    title: '工号',
                    key: 'id'
                }, {
                    title: '姓名',
                    key: 'name'
                }, {
                    title: '学院',
                    key: 'deptName'
                }, {
                    title: '职称',
                    key: 'title'
                }, {
                    title: '入职日期',
                    key: 'schoolYear'
                }, {
                    title: '性别',
                    key: 'sex'
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
                                            this.$router.push({name: 'edit-teacher', params: {id: this.teacherList[params.index].id}});
                                        }
                                    }}, 
                                '编辑'
                            ), h(
                                'Button', {
                                    props: {type: 'error', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.deleteTea(params.index)
                                        }
                                    }},
                                '删除'
                            )
                        ])
                    }
                }],
                teacherList: [],
                deptList: [],
                titleList: ['助教', '讲师', '副教授', '教授'],
            }
        },
        methods: {
            initCondition() {
                DeptApi.listAll().then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.deptList = util.safe(data, 'data.deptList', [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
            },

            doSearch() {
                this.tableLoading = true;
                this.selectCond.id = this.searchText;
                this.selectCond.name = this.searchText;
                TeacherApi.list(this.selectCond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.teacherList = util.safe(data, 'data.teacherList', []);

                        for (let i = 0; i < this.teacherList.length; i++) {
                            this.teacherList[i].deptName = this.teacherList[i].dept.name;
                            if (this.teacherList[i].schoolYear) {
                                this.teacherList[i].schoolYear = this.teacherList[i].schoolYear.substring(0, 10);
                            }
                            if (this.teacherList[i].sex === 'female') {
                                this.teacherList[i].sex = '女';
                            } else {
                                this.teacherList[i].sex = '男';
                            }
                        }

                        this.total = util.safe(data, 'data.total', 0);
                        this.tableLoading = false;
                    } else {
                        this.tableLoading = false;
                        return this.$Message.error(data.msg)
                    }
                })
            },
            doExport() {
                this.$refs.table.exportCsv({
                    filename: '教师信息'
                })
            },
            doDeleteBatch() {
                this.$Modal.confirm({
                    title: '删除选中的教师',
                    content: '确定删除选中的教师，删除后不可恢复',
                    onOk: () => {
                        let ids = [];
                        for (let i = 0; i < this.selection.length; i++) {
                            ids.push(this.selection[i].id);
                        }
                        this.delete(ids);
                    }
                })
            },
            selectionChange(selection) {
                this.selection = selection
            },
            deleteTea(index) {
                this.$Modal.confirm({
                    title: '删除选中的教师',
                    content: '确定删除选中的教师，删除后不可恢复',
                    onOk: () => {
                        let ids = [];
                        ids.push(this.teacherList[index].id);
                        this.delete(ids);
                    }
                })
            },
            delete(ids) {
                TeacherApi.delete(ids).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功')
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            changePage() {
                this.doSearch();
            },
            changePageSize() {
                this.doSearch();
            },
            condSelectChange() {
                this.doSearch();
            }
        },
        mounted() {
            this.initCondition();
            this.doSearch();
        }
    }
</script>

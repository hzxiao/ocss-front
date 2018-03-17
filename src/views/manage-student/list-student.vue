<style lang="less">
    @import './list-student.less';
</style>

<template>
    <div class="sl">
        <div class="search">
            <Input v-model="searchText" icon="search" placeholder="输入学生姓名或学号" style="width: 200px"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
        </div>

        <div class="condition">
            <div class="cond-item">
                <p>学院：</p>
                <Select v-model="selectCond.deptId" filterable clearable>
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">
                        {{ item.name}}
                    </Option>
                </Select>
            </div>

            <div class="cond-item">
                <p>专业：</p>
                <Select v-model="selectCond.majorId" filterable clearable>
                    <Option v-for="item in majorList" :value="item.id" :key="item.id">
                        {{ item.name}}
                    </Option>
                </Select>
            </div>

            <div class="cond-item">
                <p>年级：</p>
                <Select v-model="selectCond.schoolYear" filterable clearable>
                    <Option v-for="item in gradeList" :value="item.id" :key="item.id">
                        {{item.name}}
                    </Option>
                </Select>
            </div>

            <div class="cond-item">
                <p>班级：</p>
                <Select v-model="selectCond.class" filterable clearable>
                    <Option v-for="item in classList" :value="item.id" :key="item.id">
                        {{ item.name}}
                    </Option>
                </Select>
            </div>
        </div>
        <div class="op-menu">
            <Button type="default" @click="doExport()" :disabled="selection.length == 0">批量导出</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">批量删除</Button>
        </div>
        <Table ref="table" :loading="tableLoading" :data="stuList" :columns="tableColumns"
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
    import {DeptApi, MajorApi, StudentApi} from '../../api'
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
                    majorId: '',
                    schoolYear: '',
                    class: '',
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                tableColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '学号',
                    key: 'id'
                }, {
                    title: '姓名',
                    key: 'name'
                }, {
                    title: '学院',
                    key: 'deptName'
                }, {
                    title: '专业',
                    key: 'majorName'
                }, {
                    title: '年级',
                    key: 'schoolYear'
                }, {
                    title: '班级',
                    key: 'class'
                }, {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                }, style: {
                                    marginRight: '5px'
                                  }, on: {
                                      click: () => {
                                          this.$router.push({name: 'edit-student', params: {id: this.stuList[params.index].id}});
                                      }
                                  }
                              },
                              '编辑'
                            ),
                            h(
                              'Button', {
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
                }],
                stuList: [],
                deptList: [],
                majorList: [],
                gradeList: [
                    {id: "14", name: '2014级'},
                    {id: "15", name: '2015级'},
                    {id: "16", name: '2016级'},
                    {id: "17", name: '2017级'}
                ],
                classList: [
                    {id: "1", name: '1班'},
                    {id: "2", name: '2班'},
                    {id: "3", name: '3班'},
                    {id: "4", name: '4班'}
                ]
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
                })
            },
            doSearch() {
                this.selectCond.id = this.searchText;
                this.selectCond.name = this.searchText;
                StudentApi.list(this.selectCond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.stuList = util.safe(data, 'data.studentList', []);

                        for (let i = 0; i < this.stuList.length; i++) {
                            this.stuList[i].deptName = this.stuList[i].dept.name;
                            this.stuList[i].majorName = this.stuList[i].major.name;
                            this.stuList[i].schoolYear = '20'+this.stuList[i].schoolYear+'级';
                            this.stuList[i].class = this.stuList[i].class + '班';
                        }

                        this.total = util.safe(data, 'data.total', 0);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            doExport() {
                this.$refs.table.exportCsv({
                    filename: '学生信息'
                })
            },
            doDeleteBatch() {
                this.$Modal.confirm({
                    title: '删除选中的学生',
                    content: '确定删除选中的学生，删除后不可恢复',
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
            deleteStu(index) {
                this.$Modal.confirm({
                    title: '删除选中的学生',
                    content: '确定删除选中的学生，删除后不可恢复',
                    onOk: () => {
                        let ids = [];
                        ids.push(this.stuList[index].id);
                        this.delete(ids);
                    }
                })
            },
            delete(ids) {
                StudentApi.delete(ids).then(({data}) => {
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
            }
        },
        mounted() {
            this.initCondition();
            this.doSearch();
        }
    }
</script>

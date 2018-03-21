<style lang="less">
    @import './list-tc.less';
</style>

<template>
    <div class="st">
        <div class="search">
            <Input v-model="searchText" icon="search" placeholder="输入教师姓名或课程名称" style="width: 200px"/>
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
                <p>可选状态：</p>
                <Select v-model="selectCond.selectState" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in stateList" :value="item.id" :key="item">
                        {{ item.name }}
                    </Option>
                </Select>
            </div>
            <div class="cond-item">
                <p>性质：</p>
                <Select v-model="selectCond.nature" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in natureList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>
            <div class="cond-item">
                <p>归属：</p>
                <Select v-model="selectCond.nature" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in natureList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>


        </div>
        <Tabs :value="selectCond.selectState" type="card" @on-click="condSelectChange()" :animated="false">
            <TabPane label="全部" name="0">

            </TabPane>
            <TabPane label="选课中" name="1">

            </TabPane>
            <TabPane label="未开始" name="2">

            </TabPane>
            <TabPane label="已结束" name="3">

            </TabPane>
        </Tabs>
        <div class="op-menu">
            <Button type="default" @click="doExport()" :disabled="selection.length == 0">批量导出</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">批量删除</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">设置容量</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">设置选课时间</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">设置可选</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">设置不可选</Button>
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
                    nature: '',
                    selectState: '0',
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                tableColumns: [{
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
                    key: 'sex'
                },  {
                    title: '性质',
                    key: 'sex'
                }, {
                    title: '归属',
                    key: 'sex'
                },{
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
                              '进入编辑'
                            )
                        ])
                    }
                }],
                teacherList: [],
                deptList: [],
                natureList: ['社会科学类'],
                stateList: [{
                    id: 1,
                    name: '可选'
                }, {
                    id: 2,
                    name: '不可选'
                }]
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
                    nature: '删除选中的教师',
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
                    nature: '删除选中的教师',
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

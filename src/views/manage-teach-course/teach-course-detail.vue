<style lang="less">
    @import './teach-course-detail.less';
</style>

<template>
    <div class="st">

        <Tabs value="0" type="card" @on-click="tabsChange" :animated="false">
            <TabPane label="基本信息" name="0">

            </TabPane>
            <TabPane label="选课学生" name="2">
                <div class="op-menu">
                    <Button type="default" @click="doExport()" >增加学生</Button>
                    <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">剔除学生</Button>
                </div>

                <Table ref="table" :loading="tableLoading" :data="tcList" :columns="tableColumns"
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

            </TabPane>
            <TabPane label="课程留言" name="3">

            </TabPane>
            <TabPane label="课件" name="1">

            </TabPane>
        </Tabs>

    </div>

</template>

<script>
    import {DeptApi, TcApi} from '../../api'
    import util from '../../libs/util';
    import {attrList, natureList} from '../../libs/data';

    export default {
        data() {
            return {
                total: 0,
                tableLoading: false,
                selection: [],
                searchText: '',
                selectCond: {
                    name: '',
                    deptId: '',
                    nature: '',
                    attr: '',
                    selectState: '0',
                    status: 0,
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
                    title: '选课时间',
                    key: 'selectTime'
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
                                            this.$router.push({name: 'edit-student', params: {id: this.stuList[params.index].id}});
                                        }
                                    }
                                },
                                '编辑'
                            ),
                            h(
                                'Button', {props: {type: 'error', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.deleteStu(params.index)
                                        }
                                    }
                                },
                                '剔除'
                            )
                        ])
                    }
                }],
                tcList: [],
                deptList: [],
                natureList,
                attrList,
                stateList: [{
                    id: 1,
                    name: '可选'
                }, {
                    id: 2,
                    name: '不可选'
                }],
                selectTimeModel: false,
                selectTimeStr: '',
                capModel: false,
                capacity: 0,
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
                TcApi.list(this.selectCond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.tcList = util.safe(data, 'data.tcList', []);

                        for (let i = 0; i < this.tcList.length; i++) {
                            this.tcList[i].marginAndCap = this.tcList[i].margin + '/'+this.tcList[i].capacity
                            this.tcList[i].start = util.formatDateTime(this.tcList[i].startSelectTime)
                            this.tcList[i].end = util.formatDateTime(this.tcList[i].endSelectTime)
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
                    filename: '选课信息'
                })
            },
            doDeleteBatch() {
                this.$Modal.confirm({
                    nature: '删除选中的选课',
                    content: '确定删除选中的选课，删除后不可恢复',
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
            getSelectIds() {
                let ids = [];
                for (let i = 0; i < this.selection.length; i++) {
                    ids.push(this.selection[i].id);
                }
                return ids;
            },
            delete(ids) {
                TcApi.delete(ids).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功')
                        this.doSearch();
                    } else {
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
            condSelectChange() {
                this.doSearch();
            },
            tabsChange(name) {
                this.selectCond.selectState = name;
                this.doSearch();
            },
            setSelectTime() {
                this.selectTimeModel = true;
            },
            setCap() {
                this.capModel = true;
            },
            modelOk(which) {
                if (which === 'cap') {
                    this.updateBatch({ids: this.getSelectIds(), tc: {capacity: this.capacity}});
                } else {
                    this.updateBatch({ids: this.getSelectIds(), tc: {
                        startSelectTime: this.selectTimeStr[0].getTime(),
                        endSelectTime: this.selectTimeStr[1].getTime(),
                    }});
                }
            },
            setSelectState(state) {
                this.updateBatch({ids: this.getSelectIds(), tc: {status: state}});
            }
        },
        mounted() {
            this.initCondition();
            this.doSearch();
        }
    }
</script>


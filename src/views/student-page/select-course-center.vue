<style lang="less">
    @import './select-course-center.less';
</style>

<template>
    <div class="st">
        <div class="search">
            <Input v-model="selectCond.name" icon="search" placeholder="输入课程名称" style="width: 200px"/>
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
                <p>性质：</p>
                <Select v-model="selectCond.nature" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in natureList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>
            <div class="cond-item">
                <p>归属：</p>
                <Select v-model="selectCond.attr" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in attrList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>


        </div>
        <Tabs value="0" type="card" @on-click="tabsChange" :animated="false">
            <TabPane label="选课列表" name="0">
                <div class="op-menu">
                    <Button type="default" @click="selectBatch()" :disabled="selection.length == 0">提交选课</Button>

                </div>
            </TabPane>
            <TabPane label="我的选课" name="1">
                <div class="op-menu">
                    <Button type="default" @click="cancelBatch()" :disabled="selection.length == 0">撤销选课</Button>

                </div>
            </TabPane>
        </Tabs>

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
                    selectState: '2',
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
                    title: '课程',
                    key: 'courseName'
                }, {
                    title: '任课老师',
                    key: 'teacherName'
                }, {
                    title: '开课学院',
                    key: 'deptName'
                }, {
                    title: '余量/总量',
                    key: 'marginAndCap'
                }, {
                    title: '开始选课时间',
                    key: 'start'
                }, {
                    title: '结束选课时间',
                    key: 'end'
                },  {
                    title: '性质',
                    key: 'nature'
                }, {
                    title: '归属',
                    key: 'attr'
                },{
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button', {
                                    props: {type: 'primary', size: 'small', disabled: this.tab === '1'},
                                    style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.selectCourse([this.tcList[params.index].id])
                                        }
                                    }},
                                '选课'
                            ),
                            h(
                                'Button', {
                                    props: {type: 'error', size: 'small', disabled: this.tab === '0'},
                                    style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.cancelCourse([this.tcList[params.index].id])
                                        }
                                    }},
                                '撤销'
                            )
                        ])
                    }
                }],
                tcList: [],
                deptList: [],
                natureList,
                attrList,
                tab: '0'
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
                if (this.tab === '0') {
                    this.selectCond.selectState = 2;
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
                } else {
                    let o = {
                        name: this.searchText,
                        page: this.selectCond.page,
                        pageSize: this.selectCond.pageSize,
                        selectState: 2,
                    };
                    TcApi.listStuCourse(o).then(({data}) => {
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
                }

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
                this.tab = name;
                this.doSearch();
            },
            selectCourse(ids) {
                TcApi.stuSelectCourse({method:'select', ids: ids}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('提交成功');
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            cancelCourse(ids) {
                TcApi.stuSelectCourse({method:'cancel', ids: ids}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('撤销成功');
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            selectBatch() {
                this.selectCourse(this.getSelectIds())
            },
            cancelBatch() {
                this.cancelCourse(this.getSelectIds())
            }
        },
        mounted() {
            this.initCondition();
            this.doSearch();
        }
    }
</script>


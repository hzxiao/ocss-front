<style lang="less">
    @import './list-tc.less';
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
                <p>可选状态：</p>
                <Select v-model="selectCond.status" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in stateList" :value="item.id" :key="item.id">
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
                <Select v-model="selectCond.attr" filterable clearable @on-change="condSelectChange()">
                    <Option v-for="item in attrList" :value="item" :key="item">
                        {{ item }}
                    </Option>
                </Select>
            </div>


        </div>
        <Tabs value="0" type="card" @on-click="tabsChange" :animated="false">
            <TabPane label="全部" name="0">

            </TabPane>
            <TabPane label="选课中" name="2">

            </TabPane>
            <TabPane label="未开始" name="3">

            </TabPane>
            <TabPane label="已结束" name="1">

            </TabPane>
        </Tabs>
        <div class="op-menu">
            <Button type="default" @click="doExport()" :disabled="selection.length == 0">批量导出</Button>
            <Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">批量删除</Button>
            <Button type="default" @click="setCap()" :disabled="selection.length == 0">设置容量</Button>
            <Button type="default" @click="setSelectTime()" :disabled="selection.length == 0">设置选课时间</Button>
            <Button type="default" @click="setSelectState(1)" :disabled="selection.length == 0">设置可选</Button>
            <Button type="default" @click="setSelectState(2)" :disabled="selection.length == 0">设置不可选</Button>
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

        <Modal
                v-model="selectTimeModel"
                title="设置选课时间"
                loading
                @on-ok="modelOk('')">
            <DatePicker type="datetimerange" v-model="selectTimeStr" format="yyyy-MM-dd HH:mm" placeholder="选择选课起始结束时间" style="width: 300px"></DatePicker>

        </Modal>

        <Modal
                v-model="capModel"
                title="设置容量"
                loading
                @on-ok="modelOk('cap')">
            <InputNumber v-model="capacity" :min="1" :max="150" placeholder="输入容量"></InputNumber>
        </Modal>
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
                    title: '课程名称',
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
                                    props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.$router.push({name: 'edit-teacher', params: {id: this.tcList[params.index].id}});
                                        }
                                    }},
                                '进入编辑'
                            ),
                            h(
                                'Button', {
                                    props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.$router.push({name: 'teach-course-detail-adm', params: {id: this.tcList[params.index].id, tid: this.tcList[params.index].cid, cid: this.tcList[params.index].cid}});
                                        }
                                    }},
                                '查看'
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


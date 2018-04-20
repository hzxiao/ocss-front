<style lang="less">
    @import './teacher-course-detail.less';
</style>

<template>
    <div class="st">

        <Tabs :value="tabValue" type="card" @on-click="tabsChange" :animated="false">
            <TabPane label="基本信息" name="0">
                <Card class="crs-info-card">
                    <p slot="title">
                        <Icon type="person"></Icon>
                        课程信息
                    </p>
                    <div class="info" v-for="item in courseInfo">
                        <span>{{ item.label }}</span>
                        <span>{{ item.value }}</span>
                    </div>
                </Card>
                <Card class="teacher-info-card">
                    <p slot="title">
                        <Icon type="person"></Icon>
                        教师信息
                    </p>
                    <div class="info" v-for="item in teacherInfo">
                        <span>{{ item.label }}</span>
                        <span>{{ item.value }}</span>
                    </div>
                </Card>
            </TabPane>
            <TabPane label="选课学生" name="1">


                <Table ref="table" :loading="tableLoading" :data="studentList" :columns="tableColumns"
                       @on-selection-change="selectionChange" stripe>
                </Table>

            </TabPane>
            <TabPane label="课程留言" name="2">

            </TabPane>
            <TabPane label="课件" name="3">

            </TabPane>
        </Tabs>

        <Modal
                v-model="selectModel"
                title="添加学生"
                @on-cancel="modelCancel"
                @on-ok="modelOk()">
            <div class="search" style="margin-bottom:20px">
                <Input v-model="searchText" icon="search" placeholder="输入学生学号或姓名" style="width: 200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
            </div>

            <Table highlight-row ref="currentRowTable" height="400" width="500" :columns="modelTableCol"
                   :data="tableData"
                   @on-current-change="handleCurrentRowChange">
                <div slot="footer" style="padding-left:5px">
                    <Page :total="total" :current="page"
                          size="small"
                          :page-size="pageSize"
                          placement="top"
                          @on-change="changePage"
                          @on-page-size-change="changePageSize"
                          show-elevator show-total show-sizer></Page>
                </div>
            </Table>

        </Modal>

    </div>

</template>

<script>
    import {StudentApi, TcApi} from '../../api'
    import util from '../../libs/util';
    import {attrList, natureList} from '../../libs/data';
    import Cookies from 'js-cookie';
    export default {
        data() {
            return {
                currentId: '',
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
                }],
                studentList: [],
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
                courseInfo: [],
                teacherInfo: [],
                tabValue: '0',

                selectModel: false,
                page: 1,
                pageSize: 20,
                tableData: [],
                currentSelectId: '',
                modelTableCol: [
                    {
                        title: '学号',
                        key: 'id'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '学院',
                        key: 'deptName'
                    }
                ],
            }
        },
        methods: {
            doSearch() {
                switch (this.tabValue) {
                    case '0':
                        this.getBasicInfo();
                        break;
                    case '1':
                        this.getStuOfTc();
                        break;
                    case '2':
                        break;
                    case '3':
                        break;
                }
            },
            doExport() {
                this.$refs.table.exportCsv({
                    filename: '选课信息'
                })
            },

            changePage(page) {
                this.page = page;
                this.listAllStu();
            },
            changePageSize(size) {
                this.pageSize = size;
                this.listAllStu();
            },
            tabsChange(name) {
                this.tabValue = name;
                this.doSearch();
            },

            getBasicInfo() {
                TcApi.getById(this.currentId).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        var tc = util.safe(data, 'data.tc', {});
                        var course = util.safe(data, 'data.course', {});
                        var teacher = util.safe(data, 'data.teacher', {});
                        this.courseInfo = [];
                        this.courseInfo.push({label: '课程代码: ', value: course.id});
                        this.courseInfo.push({label: '课程名称: ', value: course.name});
                        this.courseInfo.push({label: '开课学院: ', value: course.dept.name});
                        this.courseInfo.push({label: '课程性质: ', value: course.nature});
                        this.courseInfo.push({label: '课程归属: ', value: course.attr});
                        this.courseInfo.push({label: '课程学分: ', value: course.credit});
                        this.courseInfo.push({label: '课程容量: ', value: tc.capacity});
                        this.courseInfo.push({label: '选课余量: ', value: tc.margin});
                        this.courseInfo.push({
                            label: '选课时间: ',
                            value: util.formatDateTime(tc.startSelectTime) + ' - ' + util.formatDateTime(tc.endSelectTime)
                        });

                        this.teacherInfo = [];
                        this.teacherInfo.push({label: '教师工号: ', value: teacher.id});
                        this.teacherInfo.push({label: '教师姓名: ', value: teacher.name});
                        this.teacherInfo.push({label: '所在学院: ', value: teacher.dept.name});
                        this.teacherInfo.push({label: '联系手机: ', value: teacher.phone});
                        this.teacherInfo.push({label: '邮箱地址: ', value: teacher.email});

                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            getStuOfTc() {
                this.tableLoading = true;
                TcApi.listTcStu(this.currentId).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.studentList = util.safe(data, 'data.studentList', []);

                        for (let i = 0; i < this.studentList.length; i++) {
                            this.studentList[i].selectTime = util.formatDateTime(this.studentList[i].selectTime);

                            this.studentList[i].deptName = this.studentList[i].dept.name;
                            this.studentList[i].majorName = this.studentList[i].major.name;
                            this.studentList[i].schoolYear = '20' + this.studentList[i].schoolYear + '级';
                            this.studentList[i].class = this.studentList[i].class + '班';
                        }

                        this.total = util.safe(data, 'data.total', 0);
                        this.tableLoading = false;
                    } else {
                        this.tableLoading = false;
                        return this.$Message.error(data.msg)
                    }
                })
            },
            getResourse() {

            },
            getAllComment() {

            },
            handleAddStuForTc() {
                this.selectModel = true;
                this.listAllStu();
            },
            modelOk() {
                this.addStuOfTc(this.currentSelectId)
            },
            modelCancel() {
                this.pageSize = 20;
                this.page = 1;
                this.searchText = '';
                this.tableData = [];
            },
            listAllStu() {
                let cond = {
                    id: this.searchText,
                    name: this.searchText,
                    page: this.page,
                    pageSize: this.pageSize,
                };

                StudentApi.list(cond).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.tableData = util.safe(data, 'data.studentList', []);
                        for (let i = 0; i < this.tableData.length; i++) {
                            this.tableData[i].deptName = this.tableData[i].dept.name;
                        }
                        this.total = util.safe(data, 'data.total', 0);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })

            },
            handleCurrentRowChange(currentRow, oldCurrentRow) {
                this.currentSelectId = currentRow.id;
            }
        },
        mounted() {
            this.currentId = this.$route.params.id;
            this.getBasicInfo();
        }
    }
</script>


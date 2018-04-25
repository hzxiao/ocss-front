<style lang="less">
    @import './teach-course-detail.less';
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
                <div class="op-menu">
                    <Button type="default" @click="handleAddStuForTc()">增加学生</Button>
                </div>

                <Table ref="table" :loading="tableLoading" :data="studentList" :columns="tableColumns"
                       @on-selection-change="selectionChange" stripe>
                </Table>

            </TabPane>
            <TabPane label="课程留言" name="2">
                <div id="comment">
                    <div class="comment-content-con">
                        <transition name="view-comment">
                            <div v-if="!showChildCommentList" class="comment-list-con">
                                <div class="search">
                                    <!--<Input v-model="searchText" icon="search" placeholder="输入课程名称或号码" style="width: 200px"/>-->
                                    <Button type="primary" shape="circle"  @click="addComment()">发表评论</Button>
                                </div>
                                <Table ref="commentList" :columns="commentColumns" :data="commentList"
                                       :no-data-text="noDataText">
                                    <div slot="footer" style="padding-left:5px">
                                        <Page :total="total" :current="selectCondComment.page"
                                              size="small"
                                              :page-size="selectCondComment.pageSize"
                                              placement="top"
                                              @on-change="changeCommentPage"
                                              @on-page-size-change="changeCommentPageSize"
                                              show-elevator show-total show-sizer></Page>
                                    </div>
                                </Table>
                            </div>

                        </transition>
                        <transition name="back-comment-list">
                            <div v-if="showChildCommentList" class="comment-view-content-con">
                                <!--<div class="comment-top">-->
                                <!---->
                                <!--</div>-->

                                <div class="search">
                                    <!--<Input v-model="searchText" icon="search" placeholder="输入课程名称或号码" style="width: 200px"/>-->
                                    <Button type="primary" shape="circle"  @click="addChildComment()">回复评论</Button>
                                </div>
                                <div class="comment-content-top-bar">
                                    <span class="cmt-back-btn-con"><Button type="text" @click="backCommentList"><Icon
                                            type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                                </div>
                                <div class="post-hover">
                                    <p class="auther">
                                        <a target="_blank" class="blue b">{{ currentComment.name}}</a>
                                    </p>
                                    <div class="post-info dib-wrap cf"  data-t="topic">
                                        <span class="mr20">{{ currentComment.create}}</span>

                                        <a href="javascript:;" class="reply-btn info-tab mr20">
                                            <span>{{currentComment.childTotal}}条回复</span>
                                        </a>
                                    </div>
                                    <p class="post-body">{{ currentComment.content}}</p>
                                </div>
                                <div  class="comment-list-con">
                                    <Table ref="commentChildrenList" :columns="commentChildrenColumns" :data="commentChildrenList"
                                           :no-data-text="noDataText"></Table>
                                </div>
                            </div>
                        </transition>
                    </div>

                </div>
            </TabPane>

            </TabPane>
            <TabPane label="课件" name="3">
                <div id="resource">
                    <Table ref="resourceList" :columns="resourceColumns" :data="resourceList"
                           :no-data-text="noDataText">
                        <div slot="footer" style="padding-left:5px">
                            <Page :total="total" :current="selectCondResource.page"
                                  size="small"
                                  :page-size="selectCondResource.pageSize"
                                  placement="top"
                                  @on-change="changeResourcePage"
                                  @on-page-size-change="changeResourcePageSize"
                                  show-elevator show-total show-sizer></Page>
                        </div>
                    </Table>
                </div>
            </TabPane>

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

        <!--评论-->
        <Modal
                v-model="addCommentModal"
                title="发表评论"
                loading
                @on-ok="addCommentModalOk()">
            <div class="es">
                <Form ref="newComment" :model="newComment"  :label-width="80">
                    <div class="lrbox">
                        <div class="left-side">
                            <FormItem label="评论内容" prop="content">
                                <Input type="textarea" v-model="newComment.content" :autosize="{minRows: 3,maxRows: 6}"  placeholder="谈谈你对本课程的看看" />
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        <Modal
                v-model="addChildCommentModal"
                title="回复评论"
                loading
                @on-ok="addChildCommentModalOk()">
            <div class="es">
                <Form ref="newChildComment" :model="newChildComment"  :label-width="80">
                    <div class="lrbox">
                        <div class="left-side">
                            <FormItem label="评论内容" prop="content">
                                <Input type="textarea" v-model="newChildComment.content" :autosize="{minRows: 3,maxRows: 6}"  placeholder="谈谈你对本课程的看看" />
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>

    </div>

</template>

<script>
    import {CommentApi, StudentApi, TcApi, ResourceApi} from '../../api'
    import util from '../../libs/util';
    import {attrList, natureList} from '../../libs/data';

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
                                          this.$router.push({
                                              name: 'edit-student',
                                              params: {id: this.studentList[params.index].id}
                                          });
                                      }
                                  }
                              },
                              '编辑'
                            ),
                            h(
                              'Button', {
                                  props: {type: 'error', size: 'small'},
                                  on: {
                                      click: () => {
                                          this.deleteStuOfTc(this.studentList[params.index].id)
                                      }
                                  }
                              },
                              '剔除'
                            )
                        ])
                    }
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

                //评论
                commentList: [],
                newComment:{},
                newChildComment:{},
                selectCondComment: {
                    tcid: '',
                    status: 1,
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                addCommentModal: false,
                addChildCommentModal: false,
                showChildCommentList: false,
                currentComment: {},
                commentChildrenList: [],
                commentColumns:[
                    {
                        title: '评论者',
                        key: 'name'
                    },
                    {
                        title: '评论角色',
                        key: 'role'
                    },
                    {
                        title: '评论内容',
                        key: 'content'
                    },
                    {
                        title: '回复数目',
                        key: 'childTotal'
                    },
                    {
                        title: '评论时间',
                        key: 'create'
                    },{
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button', {
                                        props: {type: 'error', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.deleteComment([this.commentList[params.index].id]);
                                            }
                                        }},
                                    '删除评论'
                                ),
                                h(
                                    'Button', {
                                        props: {type: 'primary', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.currentComment = this.commentList[params.index];
                                                this.showCommentDetail();
                                            }
                                        }},
                                    '评论详情'
                                )
                            ])
                        }
                    }
                ],
                commentChildrenColumns:[
                    {
                        title: '回复者',
                        key: 'name'
                    },
                    {
                        title: '回复角色',
                        key: 'role'
                    },
                    {
                        title: '回复内容',
                        key: 'content'
                    },
                    {
                        title: '回复时间',
                        key: 'create'
                    },{
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button', {
                                        props: {type: 'error', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.deleteChildCommentren([this.currentComment.id],[this.currentComment.children[params.index].id]);
                                            }
                                        }},
                                    '删除回复'
                                )
                            ])
                        }
                    }],

                // 课件
                selectCondResource: {
                    tcid: '',
                    tid: '',
                    status: 1,
                    page: 1,
                    pageSize: 20,
                    sort: '-create'
                },
                resourceList: [],
                resourceColumns: [
                    {
                        title: '上传老师',
                        key: 'teacherName'
                    },
                    {
                        title: '课程名称',
                        key: 'courseName'
                    },
                    {
                        title: '课件描述',
                        key: 'desc'
                    },
                    {
                        title: '课件名称',
                        key: 'fileName'
                    },
                    {
                        title: '上传时间',
                        key: 'create'
                    },{
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button', {
                                        props: {type: 'primary', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.downloadResource(this.resourceList[params.index].file.id);
                                            }
                                        }},
                                    '下载课件'
                                )

                            ])
                        }
                    }],

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
                        this.getAllComment();
                        break;
                    case '3':
                        this.getAllResources();
                        break;
                }
            },
            doExport() {
                this.$refs.table.exportCsv({
                    filename: '选课信息'
                })
            },

            deleteStuOfTc(id) {
                TcApi.updateStuForTc({method: 'cancel', id: this.currentId, sid: id}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功')
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            addStuOfTc(id) {
                TcApi.updateStuForTc({method: 'select', id: this.currentId, sid: id}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('添加成功');
                        this.doSearch();
                    } else {
                        return this.$Message.error(data.err)
                    }
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
            },

            //评论
            getAllComment() {
                this.selectCondComment.tcid = this.currentId;
                CommentApi.list(this.selectCondComment).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.commentList = util.safe(data, 'data.commentList', []);
                        for (let i = 0; i < this.commentList.length; i++){
                            this.commentList[i].create = util.formatDateTime(this.commentList[i].create);
                            if(this.commentList[i].children != null){
                                for(let j = 0; j < this.commentList[i].children.length; j++){
                                    this.commentList[i].children[j].create = util.formatDateTime(this.commentList[i].children[j].create);
                                }
                            }
                        }
                        this.total = util.safe(data, 'data.total', 0);
                        if (this.showChildCommentList){
                            console.log(this.showChildCommentList);
                            for (let i = 0; i < this.commentList.length; i++){
                                if (this.commentList[i].id === this.currentComment.id){
                                    this.currentComment = this.commentList[i];
                                    break;
                                }
                            }
                            this.commentChildrenList = this.currentComment.children;
                            this.total = this.commentChildrenList.childTotal;
                        }

                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },

            addComment(){
                this.newComment.tcid = this.currentId;
                this.addCommentModal = true;
            },
            addCommentModalOk(){
                if (this.newComment.content === null || this.newComment.content.length === 0){
                    this.$Message.error("评论内容不能为空");
                    this.addCommentModal = false;
                    return;
                }
                CommentApi.addComment(this.newComment).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('发表成功');
                        this.addCommentModal = false;
                        this.newComment.content = '';
                        this.getAllComment();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },

            deleteComment(ids) {
                CommentApi.delete(ids).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功');
                        this.getAllComment();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },

            changeCommentPage(page){
                this.selectCondComment.page = page;
                this.getAllComment();
            },
            changeCommentPageSize(size){
                this.selectCondComment.pageSize = size;
                this.getAllComment();
            },
            showCommentDetail(){
                this.showChildCommentList = true;
                this.commentChildrenList = this.currentComment.children;
            },
            backCommentList() {
                this.showChildCommentList = false;
                getAllComment();
            },
            deleteChildCommentren(ids,childId){
                CommentApi.deleteChildComment(ids,childId).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('删除成功');
                        this.getAllComment();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            addChildComment(){
                this.addChildCommentModal = true;
            },
            addChildCommentModalOk(){
                if (this.newChildComment.content === null || this.newChildComment.content.length === 0){
                    this.$Message.error("回复评论内容不能为空");
                    this.addChildCommentModal = false;
                    return;
                }
                CommentApi.addChildComment(this.currentComment.id,this.newChildComment).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.$Message.success('发表成功');
                        this.addChildCommentModal = false;
                        this.newChildComment.content = '';
                        this.getNewChildComment();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            getNewChildComment(){
                this.getAllComment();
            },

            //课件
            downloadResource(id){
                window.open('http://111.230.242.177:8999/files/' + id + '?dl=1');
            },
            changeResourcePage(page){
                this.selectCondResource.page = page;
                this.getAllResources();
            },
            changeResourcePageSize(size){
                this.selectCondResource.pageSize = size;
                this.getAllResources();
            },
            getAllResources(){
                this.selectCondResource.tcid = this.currentId;
                ResourceApi.list(this.selectCondResource).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.resourceList = util.safe(data, 'data.resourceList', []);
                        for (let i = 0; i < this.resourceList.length; i++){
                            this.resourceList[i].create = util.formatDateTime(this.resourceList[i].create);
                            this.resourceList[i].fileName = this.resourceList[i].file.name;
                        }
                        this.total = util.safe(data, 'data.total', 0);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },


        },
        mounted() {
            this.currentId = this.$route.params.id;
            this.getBasicInfo();
        }
    }
</script>


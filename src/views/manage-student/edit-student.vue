<style lang="less">
    @import './edit-student.less';
</style>

<template>
    <Tabs value="stu-info">
        <TabPane label="学生信息" name="stu-info">
            <div class="es">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <div class="lrbox">
                        <div class="left-side">
                            <FormItem label="学号" prop="id">
                                <Input v-model="formValidate.id" readonly placeholder="学号"></Input>
                            </FormItem>
                            <FormItem label="姓名" prop="name">
                                <Input v-model="formValidate.name" placeholder="输入学生姓名"></Input>
                            </FormItem>
                            <FormItem label="年龄" prop="age">
                                <InputNumber v-model="formValidate.age" :min="1" :max="100"
                                             placeholder="输入学生年龄"></InputNumber>
                            </FormItem>

                            <FormItem label="性别" prop="sex">
                                <RadioGroup v-model="formValidate.sex">
                                    <Radio label="male">男</Radio>
                                    <Radio label="female">女</Radio>
                                </RadioGroup>
                            </FormItem>

                            <FormItem label="身份证" prop="credit">
                                <Input v-model="formValidate.credit" placeholder="输入学生身份证号码"></Input>
                            </FormItem>


                            <FormItem label="手机" prop="phone">
                                <Input v-model="formValidate.phone" placeholder="输入手机号码"></Input>
                            </FormItem>
                        </div>
                        <div class="right-side">
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="formValidate.email" placeholder="输入邮箱"></Input>
                            </FormItem>
                            <FormItem label="学院" prop="deptId">
                                <Select v-model="formValidate.deptId" placeholder="选择所在学院"
                                        @on-change="selectChange('dept')">
                                    <Option v-for="item in deptList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="专业" prop="majorId" @on-change="selectChange('major')">
                                <Select v-model="formValidate.majorId" placeholder="选择专业">
                                    <Option v-for="item in majorList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="年级" prop="schoolYear" @on-change="selectChange('grade')">
                                <Select v-model="formValidate.schoolYear" placeholder="选择年级">
                                    <Option v-for="item in gradeList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="班级" prop="class">
                                <Select v-model="formValidate.class" placeholder="选择班级"
                                        @on-change="selectChange('class')">
                                    <Option v-for="item in classList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </div>
                    </div>

                    <FormItem class="btn">
                        <Button type="primary" @click="handleSubmit('formValidate', 1)">Submit</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </TabPane>
        <TabPane label="账户信息" name="account-info">

            <Form :label-width="80" ref="accountInfo" :model="accountInfo" :rules="ruleAccount">
                <FormItem label="允许登录" width="200px">
                    <i-switch v-model="accountInfo.status == 1" @on-change="change" size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="密码" width="200px" prop="password">
                    <Input type="password" v-model="accountInfo.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="确认密码" width="200px" prop="password2">
                    <Input type="password" v-model="accountInfo.password2" placeholder="请再次输入密码"></Input>
                </FormItem>
                <FormItem class="btn">
                    <Button type="primary" @click="handleSubmit('accountInfo', 2)">Submit</Button>
                    <Button type="ghost" @click="handleReset('accountInfo')" style="margin-left: 8px">Reset</Button>
                </FormItem>

            </Form>
        </TabPane>
    </Tabs>
</template>
<script>
    import {DeptApi, MajorApi, StudentApi, UserApi } from '../../api'
    import util from '../../libs/util';

    export default {
        data() {
            return {
                formValidate: {
                    id: '',
                    name: '',
                    email: '',
                    credit: '',
                    sex: '',
                    age: 18,
                    phone: '',
                    deptId: '',
                    majorId: '',
                    dept: {},
                    major: {},
                    schoolYear: '',
                    class: ''
                },
                ruleValidate: {
                    id: [
                        {required: true, message: '学号不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    email: [
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    credit: [
                        {required: true, message: '身份证不能为空', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    deptId: [
                        {required: true, message: '请选择所在学院', trigger: 'change'}
                    ],
                    majorId: [
                        {required: true, message: '请选择专业', trigger: 'change'}
                    ],
                    schoolYear: [
                        {required: true, message: '请选择所在年级', trigger: 'change'}
                    ],
                    class: [
                        {required: true, message: '请选择所在班级', trigger: 'change'}
                    ]
                },
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
                ],
                accountInfo: {
                    username: '',
                    password: '',
                    status: 1,
                    password2: '',
                },
                switchStatus: true,
                ruleAccount: {
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            initCondition() {
                DeptApi.listAll().then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data)
                        this.deptList = util.safe(data, "data.deptList", [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            getCurrentInfo() {
                console.log(this.$route.params.id);
                let id = this.$route.params.id;
                StudentApi.getById(id).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data);
                        this.formValidate = util.safe(data, 'data.student', {});
                        this.formValidate.deptId = this.formValidate.dept.id;
                        this.updateMajors();
                        this.formValidate.majorId = this.formValidate.major.id;
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
                UserApi.getUserInfo(id).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data);
                        this.accountInfo = util.safe(data, 'data.user', {});
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            selectChange(which) {
                switch (which) {
                    case "dept":
                        if (!this.formValidate.deptId) {
                            return
                        }
                        this.formValidate.dept.id = this.formValidate.deptId;
                        for (var i = 0; i < this.deptList.length; i++) {
                            if (this.formValidate.deptId === this.deptList[i].id) {
                                this.formValidate.dept.name = this.deptList[i].name;
                                break;
                            }
                        }
                        break;
                    case 'major':
                        this.formValidate.major.id = this.formValidate.majorId;
                        for (var i = 0; i < this.majorList.length; i++) {
                            if (this.formValidate.majorId === this.majorList[i].id) {
                                this.formValidate.major.name = this.majorList[i].name;
                                break;
                            }
                        }
                        break;
                    case "grade":
                    case "class":
                }
            },
            updateMajors() {
                MajorApi.list(this.formValidate.deptId).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data);
                        this.majorList = util.safe(data, 'data.majorList', [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },

            handleSubmit(name, which) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    delete this.formValidate.deptId;
                    delete this.formValidate.majorId;
                    if (which == 1) {
                        StudentApi.update(this.formValidate).then(({data}) => {
                            if (data.code === this.$code.SUCCESS) {
                                this.$Message.success('修改成功')
                            } else {
                                return this.$Message.error(data.msg)
                            }
                        })
                    } else {
                        if (this.accountInfo.password !== this.accountInfo.password2) {
                            return this.$Message.info('两次输入的密码不一致');
                        }
                        UserApi.update({username: this.accountInfo.username, password: this.accountInfo.password}).then(({data}) => {
                            if (data.code === this.$code.SUCCESS) {
                                this.$Message.success('修改成功');
                            } else {
                                return this.$Message.error(data.msg)
                            }
                        });
                    }
                    this.getCurrentInfo();
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            change(status) {
                let value = 0;
                if (status) {
                    value = 1;
                } else {
                    value = 2;
                }
                
                UserApi.update({username: this.accountInfo.username, status: value}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data);
                        this.$Message.success('修改成功');
                        this.getCurrentInfo();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
            }
        },
        mounted() {
            this.initCondition();
            this.getCurrentInfo();
        }
    }
</script>


<style lang="less">
    @import './edit-teacher.less';
</style>

<template>
    <Tabs value="te-info">
        <TabPane label="教师信息" name="te-info">
            <div class="at">
                <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
                    <div class="lrbox">
                        <div class="left-side">
                            <FormItem label="工号" readonly prop="id">
                                <Input v-model="form.id" readonly="true" placeholder="选择学院后自动生成"></Input>
                            </FormItem>
                            <FormItem label="姓名" prop="name">
                                <Input v-model="form.name" placeholder="输入教师姓名"></Input>
                            </FormItem>
                            <FormItem label="年龄" prop="age">
                                <InputNumber v-model="form.credit" :min="1" :max="100" placeholder="输入教师年龄"></InputNumber>
                            </FormItem>

                            <FormItem label="性别" prop="sex">
                                <RadioGroup v-model="form.sex">
                                    <Radio label="male">男</Radio>
                                    <Radio label="female">女</Radio>
                                </RadioGroup>
                            </FormItem>

                            <FormItem label="身份证" prop="credit">
                                <Input v-model="form.credit" placeholder="输入教师身份证号码"></Input>
                            </FormItem>


                            <FormItem label="手机" prop="phone">
                                <Input v-model="form.period" placeholder="输入手机号码"></Input>
                            </FormItem>
                        </div>
                        <div class="right-side">
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="form.email" placeholder="输入邮箱"></Input>
                            </FormItem>
                            <FormItem label="学院" prop="deptId">
                                <Select v-model="form.dept" placeholder="选择所在学院" @on-change="selectChange()">
                                    <Option v-for="item in deptList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="职称" prop="title">
                                <Select v-model="form.title" placeholder="选择职称">
                                    <Option v-for="item in titleList" :value="item" :key="">
                                        {{ item }}
                                    </Option>
                                </Select>
                            </FormItem>

                            <FormItem label="入职日期" prop="schoolYear">
                                <DatePicker type="date" v-model="form.schoolYear" placeholder="选择日期" style="width: 200px"></DatePicker>
                            </FormItem>
                        </div>
                    </div>

                    <FormItem class="btn">
                        <Button type="primary" @click="handleSubmit('form', 1)">Submit</Button>
                        <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">Reset</Button>
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
    import {DeptApi, UserApi, TeacherApi} from '../../api'
    import util from '../../libs/util';

    export default {
        data () {
            return {
                form: {
                    id: '',
                    name: '',
                    email: '',
                    credit: '',
                    sex: '',
                    credit: 40,
                    period: '',
                    dept: '',
                    title: '',
                    dept: {},
                    schoolYear: '',
                },
                ruleValidate: {
                    id: [
                        { required: true, message: '工号不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    email: [
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    credit: [
                        { required: true, message: '身份证不能为空', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    dept: [
                        { required: true, message: '请选择所在学院', trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '请选择职称', trigger: 'change' }
                    ],
                    schoolYear2: [
                        { required: true, message: '请选择入职日期', trigger: 'change' }
                    ],
                },
                deptList: [],
                titleList: ['助教', '讲师', '副教授', '教授'],
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
                        this.deptList = util.safe(data, 'data.deptList', [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            getCurrentInfo() {
                let id = this.$route.params.id;
                TeacherApi.getById(id).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.form = util.safe(data, 'data.teacher', {});
                        this.form.dept = this.form.dept.id;
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
                UserApi.getUserInfo(id).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.accountInfo = util.safe(data, 'data.user', {});
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            selectChange() {
                if (!this.form.dept) {
                    return
                }
                this.form.dept.id = this.form.dept;
                for (let i = 0; i < this.deptList.length; i++) {
                    if (this.form.dept === this.deptList[i].id) {
                        this.form.dept.name = this.deptList[i].name;
                        break;
                    }
                }
            },
            handleSubmit(name, which) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    delete this.form.dept;
                    delete this.form.majorId;
                    if (which == 1) {
                        TeacherApi.update(this.form).then(({data}) => {
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

<style lang="less">
    @import './add-teacher.less';
</style>

<template>
  <div class="at">
      <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
        <div class="lrbox">
            <div class="left-side">
                <FormItem label="工号" prop="id">
                    <Input v-model="form.id" readonly placeholder="选择学院后自动生成"></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name" placeholder="输入教师姓名"></Input>
                </FormItem>
                <FormItem label="年龄" prop="age">
                    <InputNumber v-model="form.age" :min="1" :max="100" placeholder="输入教师年龄"></InputNumber>
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
                    <Input v-model="form.phone" placeholder="输入手机号码"></Input>
                </FormItem>
            </div>
            <div class="right-side">
                <FormItem label="邮箱" prop="email">
                    <Input v-model="form.email" placeholder="输入邮箱"></Input>
                </FormItem>
                <FormItem label="学院" prop="deptId">
                    <Select v-model="form.deptId" placeholder="选择所在学院" @on-change="selectChange()">
                        <Option v-for="item in deptList" :value="item.id" :key="item.id">
                            {{ item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="职称" prop="title" @on-change="selectChange('major')">
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
            <Button type="primary" @click="handleSubmit('form')">Submit</Button>
            <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
    import {DeptApi, TeacherApi} from '../../api'
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
                    age: 40,
                    phone: '',
                    deptId: '',
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
                    deptId: [
                        { required: true, message: '请选择所在学院', trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '请选择职称', trigger: 'change' }
                    ],
                    schoolYear1: [
                        { required: false, message: '请选择入职日期', trigger: 'change' }
                    ],
                },
                deptList: [],
                titleList: ['助教', '讲师', '副教授', '教授'],
                teacherList: [],

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
            selectChange() {
                if (!this.form.deptId) {
                    return
                }
                this.form.dept.id = this.form.deptId;
                for (let i = 0; i < this.deptList.length; i++) {
                    if (this.form.deptId === this.deptList[i].id) {
                        this.form.dept.name = this.deptList[i].name;
                        break;
                    }
                }
                this.autoSetTeacherId();
            },
            autoSetTeacherId() {
                TeacherApi.count({teacher: {deptId: this.form.deptId}}).then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        let count = util.safe(data, 'data.teacher', 0);
                        this.form.id = this.form.deptId + util.prefixInt(count+1, 3);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    
                    this.autoSetTeacherId();
                    TeacherApi.create(this.form).then(({ data }) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.$Message.success('添加成功');
                            this.handleReset('form')
                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        mounted() {
            this.initCondition();
        }
    }
</script>

<style lang="less">
    @import './add-student.less';
</style>

<template>
<div class="as">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <div class="lrbox">
            <div class="left-side">
                <FormItem label="学号" prop="id">
                    <Input v-model="formValidate.id" readonly placeholder="选择学院、年级、班级之后自动生成"></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="输入学生姓名"></Input>
                </FormItem>
                <FormItem label="年龄" prop="age">
                    <InputNumber v-model="formValidate.age" :min="1" :max="100" placeholder="输入学生年龄"></InputNumber>
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
                    <Select v-model="formValidate.deptId" placeholder="选择所在学院" @on-change="selectChange('dept')">
                        <Option v-for="item in deptList" :value="item.id" :key="item.id">
                            {{ item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="专业" prop="majorId">
                    <Select v-model="formValidate.majorId" placeholder="选择专业" @on-change="selectChange('major')">
                        <Option v-for="item in majorList" :value="item.id" :key="item.id">
                            {{ item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="年级" prop="schoolYear">
                    <Select v-model="formValidate.schoolYear" placeholder="选择年级" @on-change="selectChange('grade')">
                        <Option v-for="item in gradeList" :value="item.id" :key="item.id">
                            {{ item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="班级" prop="class">
                    <Select v-model="formValidate.class" placeholder="选择班级" @on-change="selectChange('class')">
                        <Option v-for="item in classList" :value="item.id" :key="item.id">
                            {{ item.name}}
                        </Option>
                    </Select>
                </FormItem>
            </div>
        </div>

        <FormItem class="btn">
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</div>
</template>

<script>
    import { DeptApi, MajorApi, StudentApi } from '../../api' 
    import util from '../../libs/util';

    export default {
        data () {
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
                        { required: true, message: '学号不能为空', trigger: 'blur' }
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
                    majorId: [
                        { required: true, message: '请选择专业', trigger: 'change' }
                    ],
                    schoolYear: [
                        { required: true, message: '请选择所在年级', trigger: 'change' }
                    ],
                    class: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ]
                },
                deptList: [],
                majorList: [],
                gradeList: [
                    {id: '14', name: '2014级'},
                    {id: '15', name: '2015级'},
                    {id: '16', name: '2016级'},
                    {id: '17', name: '2017级'}
                ],
                classList: [
                    {id: '1', name: '1班'},
                    {id: '2', name: '2班'},
                    {id: '3', name: '3班'},
                    {id: '4', name: '4班'}
                ]
            }
        },
        methods: {
            initCondition() {
                DeptApi.listAll().then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.deptList = util.safe(data, 'data.deptList', [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
            handleSelectChange(which) {
                switch (which) {
                    case "dept":
                        if (!this.formValidate.deptId) {
                            return
                        }
                        this.updateMajors();
                        this.formValidate.dept.id = this.formValidate.deptId;
                        for (var i = 0; i < this.deptList.length; i++) {
                            if (this.formValidate.deptId === this.deptList[i].id) {
                                this.formValidate.dept.name = this.deptList[i].name;
                                break;
                            }
                        }
                        break;
                    case "major":
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
                if (this.formValidate.deptId && this.formValidate.schoolYear) {
                    this.autoSetStudentId();
                }
            },

            updateMajors() {
                MajorApi.list(this.formValidate.deptId).then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        this.majorList = util.safe(data, "data.majorList", [])
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

                    this.autoSetStudentId();
                    delete this.formValidate.deptId;
                    delete this.formValidate.majorId;
                    StudentApi.create(this.formValidate).then(({ data }) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.$Message.success('添加成功');
                            this.handleReset('formValidate')
                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            autoSetStudentId() {
                StudentApi.count({student: {deptId: this.formValidate.deptId, schoolYear: this.formValidate.schoolYear}}).then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        var count = util.safe(data, 'data.student', 0);
                        this.formValidate.id = this.formValidate.schoolYear+this.formValidate.deptId
                        + util.prefixInt(count+1, 3);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            }
        },
        mounted() {
            this.initCondition();
        }
    }
</script>
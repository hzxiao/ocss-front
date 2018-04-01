<style lang="less">
    @import './add-student.less';
</style>

<template>
    <div class="as">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <div class="lrbox">
                <div class="left-side">
                    <FormItem label="课程代码" prop="id">
                        <Input v-model="formValidate.id" readonly placeholder="选择学院之后自动生成"></Input>
                    </FormItem>
                    <FormItem label="名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="输入课程名称"></Input>
                    </FormItem>
                    <FormItem label="学分" prop="credit">
                        <InputNumber v-model="formValidate.credit" :min="1" :max="20" :step="0.5" placeholder="输入学分"></InputNumber>
                    </FormItem>
                    <FormItem label="学时" prop="period">
                        <Input v-model="formValidate.period" placeholder="输入学时"></Input>
                    </FormItem>
                    <FormItem label="描述" prop="desc">
                        <Input type="textarea" v-model="formValidate.desc" placeholder="输入描述"></Input>
                    </FormItem>
                </div>
                <div class="right-side">
                    <FormItem label="学院" prop="deptId">
                        <Select v-model="formValidate.deptId" placeholder="选择学院" @on-change="handleSelectChange('dept')">
                            <Option v-for="item in deptList" :value="item.id" :key="item.id">
                                {{ item.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="归属" prop="attr">
                        <Select v-model="formValidate.attr" placeholder="选择归属" @on-change="handleSelectChange('attr')">
                            <Option v-for="item in attrList" :value="item" :key="item">
                                {{ item }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="性质" prop="nature">
                        <Select v-model="formValidate.nature" placeholder="选择性质" @on-change="handleSelectChange('nature')">
                            <Option v-for="item in natureList" :value="item" :key="item">
                                {{ item }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="校区" prop="campus">
                        <Select v-model="formValidate.campus" placeholder="选择校区" @on-change="handleSelectChange('campus')">
                            <Option v-for="item in campusList" :value="item" :key="item">
                                {{ item }}
                            </Option>
                        </Select>
                    </FormItem>
                </div>
            </div>

            <FormItem class="btn">
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import { CourseApi, DeptApi } from '../../api'
    import {attrList, natureList, campusList} from '../../libs/data';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                formValidate: {
                    id: '',
                    name: '',
                    credit: 0,
                    deptId: '',
                    period: '',
                    attr: '',
                    nature: '',
                    campus: '',
                    desc: '',
                    dept: {},
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    deptId: [
                        { required: true, message: '请选择学院', trigger: 'change' }
                    ],
                    credit1: [
                        { required: false, message: '请输入学分', trigger: 'change' }
                    ],
                    period: [
                        { required: true, message: '请输入学时', trigger: 'change' }
                    ],
                    attr: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ],
                    nature: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ],
                    campus: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ]
                },
                attrList,
                natureList,
                campusList,
                deptList: [],
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
                    case 'dept':
                        if (!this.formValidate.deptId) {
                            return
                        }
                        this.autoSetCourseId();
                        this.formValidate.dept.id = this.formValidate.deptId;
                        for (var i = 0; i < this.deptList.length; i++) {
                            if (this.formValidate.deptId === this.deptList[i].id) {
                                this.formValidate.dept.name = this.deptList[i].name;
                                break;
                            }
                        }
                        break;
                    case 'attr':
                        break;
                    case 'nature':
                        break;
                    case 'campus':
                        break
                }
                if (this.formValidate.nature && this.formValidate.campus) {
                    return /* noop */
                }
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    this.autoSetCourseId();
                    this.formValidate.credit = ''+this.formValidate.credit;
                    delete this.formValidate.deptId;
                    CourseApi.create(this.formValidate).then(({ data }) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.$Message.success('添加成功');
                            this.handleReset()
                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            },
            autoSetCourseId() {
                CourseApi.count({course: {deptId: this.formValidate.deptId}}).then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        var count = util.safe(data, 'data.course', 0);
                        this.formValidate.id = '18'+this.formValidate.deptId
                          + util.prefixInt(count+1, 3);
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            }
        },
        mounted() {
            this.initCondition()
        }
    }
</script>
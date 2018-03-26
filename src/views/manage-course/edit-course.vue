<style lang="less">
    @import './edit-course.less';
</style>

<template>
    <Tabs value="course-info">
        <TabPane label="课程信息" name="course-info">
            <div class="es">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <div class="lrbox">
                        <div class="left-side">
                            <FormItem label="名称" prop="name">
                                <Input v-model="formValidate.name" placeholder="输入课程名称"></Input>
                            </FormItem>
                            <FormItem label="学分" prop="credit">
                                <InputNumber v-model="formValidate.credit" :min="1" :max="20" placeholder="输入学分"></InputNumber>
                            </FormItem>
                            <FormItem label="学时" prop="period">
                                <Input v-model="formValidate.period" placeholder="输入学时"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="desc">
                                <Input type="area" v-model="formValidate.desc" placeholder="输入描述"></Input>
                            </FormItem>
                        </div>
                        <div class="right-side">
                            <FormItem label="归属" prop="attr">
                                <Select v-model="formValidate.attr" placeholder="选择归属" @on-change="handleSelectChange('dept')">
                                    <Option v-for="item in attrList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="性质" prop="nature">
                                <Select v-model="formValidate.nature" placeholder="选择性质" @on-change="handleSelectChange('dept')">
                                    <Option v-for="item in natureList" :value="item.id" :key="item.id">
                                        {{ item.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="校区" prop="campus">
                                <Select v-model="formValidate.campus" placeholder="选择校区" @on-change="handleSelectChange('major')">
                                    <Option v-for="item in campusList" :value="item.id" :key="item.id">
                                        {{ item.name }}
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
    </Tabs>
</template>
<script>
    import { CourseApi } from '../../api'

    export default {
        data() {
            return {
                formValidate: {
                    name: '',
                    dept: '',
                    credit: '',
                    period: '',
                    attr: '',
                    nature: '',
                    campus: '',
                    desc: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    dept: [
                        { required: true, message: '请选择所在学院', trigger: 'change' }
                    ],
                    credit: [
                        { required: true, message: '请输入学分', trigger: 'change' }
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
                attrList: [],
                natureList: [],
                campusList: []
            }
        },
        methods: {
            initCondition () {
                CourseApi.find()
            },
            handleSubmit(name, which) {
                window.console.log(name)
                window.console.log(which)
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

                /*CourseApi.update({username: this.accountInfo.username, status: value}).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {

                        this.$Message.success('修改成功');
                        this.getCurrentInfo();
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });*/
            }
        },
        mounted() {
            this.initCondition();
            this.getCurrentInfo();
        }
    }
</script>


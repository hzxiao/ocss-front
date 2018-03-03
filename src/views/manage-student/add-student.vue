<template>
  <div class="as">
      <div class="path">
      <Breadcrumb>
        <BreadcrumbItem to="/components/breadcrumb">管理学生</BreadcrumbItem>
        <BreadcrumbItem>新增学生</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <div class="lrbox">
            <div class="left-side">
                <FormItem label="学号" prop="student_id">
                    <Input v-model="formValidate.student_id" placeholder="输入学号"></Input>
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
            <FormItem label="学院" prop="department">
                <Select v-model="formValidate.department" placeholder="选择所在学院">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="专业" prop="major">
                <Select v-model="formValidate.major" placeholder="选择专业">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="年级" prop="school_year">
                <Select v-model="formValidate.school_year" placeholder="选择年级">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="班级" prop="classes">
                <Select v-model="formValidate.classes" placeholder="选择班级">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
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

<style lang="scss" scoped>
.as {
    width: 100%;
    height: 100%;
}
.path {
  width: 200px;
  left: 20px;
  margin-bottom: 30px;
  margin-top: 20px;
}

Form {
    display: flex;
    flex-direction: column;
    height: auto;
    align-items: center;
    padding: 0;
    margin: 0;
    .lrbox {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
    .left-side,.right-side{
        width: 400px;
    }
    .btn {
        // position: absolute;
        // top:600px;
        // left: 300px;
    }
}
</style>

<script>

    export default {
        data () {
            return {
                formValidate: {
                    student_id: '',
                    name: '',
                    email: '',
                    credit: '',
                    sex: '',
                    age: 18,
                    phone: '',
                    department: '',
                    major: '',
                    school_year: '',
                    classes: ''
                },
                ruleValidate: {
                    student_id: [
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
                    department: [
                        { required: true, message: '请选择所在学院', trigger: 'change' }
                    ],
                    major: [
                        { required: true, message: '请选择专业', trigger: 'change' }
                    ],
                    school_year: [
                        { required: true, message: '请选择所在年级', trigger: 'change' }
                    ],
                    classes: [
                        { required: true, message: '请选择所在班级', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

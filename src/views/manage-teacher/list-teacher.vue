<style lang="less">
    @import './add-teacher.less';
</style>

<template>
  	<div class="st">
		<div class="search">
			<Input v-model="searchText" icon="search" placeholder="输入学生姓名或学号" style="width: 200px"/>
			<Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
		</div>

		<div class="condition">
			<div class="cond-item">
				<p>学院：</p>
				<Select v-model="selectCondtion.deptId" filterable clearable>
					<Option v-for="item in deptList" :value="item.id" :key="item.id">
                        {{ item.name}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>专业：</p>
				<Select v-model="selectCondtion.majorId" filterable clearable>
					<Option v-for="item in majorList" :value="item.id" :key="item.id">
                        {{ item.name}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>年级：</p>
				<Select v-model="selectCondtion.schoolYear" filterable clearable>
					<Option v-for="item in gradeList" :value="item.id" :key="item.id">
                        {{ item.name}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>班级：</p>
				<Select v-model="selectCondtion.class" filterable clearable>
					<Option v-for="item in classList" :value="item.id" :key="item.id">
                        {{ item.name}}
					</Option>
				</Select>
			</div>
		</div>
		<div class="op-menu">
			<Button type="default" @click="doExport()" :disabled="selection.length == 0">批量导出</Button>
			<Button type="default" @click="doDeleteBatch()" :disabled="selection.length == 0">批量删除</Button>
		</div>
		<Table ref="table" :loading="tableLoading" :data="stuList" :columns="tableColumns"
			   @on-selection-change="selectionChange" stripe>
			<div slot="footer" style="padding-left:5px">
				<Page :total="100" :current="1"
					  size="small"
					  placement="top"
					  show-elevator show-total show-sizer></Page>
			</div>
		</Table>

		<Modal
			title="编辑学生信息"
			okText="提交"
			:okOn="commitEditInfo"
			v-model="showEditStuDialog"
			:styles="{top: '70px'}">

			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
				<div class="lrbox">
					<div class="left-side">
						<FormItem label="学号" prop="student_id">
							<Input v-model="formValidate.id" placeholder="输入学号"></Input>
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
                            <Select v-model="formValidate.deptId" placeholder="选择所在学院" @on-change="selectChange('dept')">
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
                            <Select v-model="formValidate.class" placeholder="选择班级" @on-change="selectChange('class')">
                                <Option v-for="item in classList" :value="item.id" :key="item.id">
                                    {{ item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </div>
				</div>
			</Form>
		</Modal>
	</div>

</template>

<script>
    import { DeptApi, MajorApi, StudentApi } from '../../api' 
    import util from '../../libs/util';

export default {

		data() {
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
					degree: '',
					classes: ''
				},
				ruleValidate: {
					student_id: [
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
					department: [
						{required: true, message: '请选择所在学院', trigger: 'change'}
					],
					major: [
						{required: true, message: '请选择专业', trigger: 'change'}
					],
					degree: [
						{required: true, message: '请选择所在年级', trigger: 'change'}
					],
					classes: [
						{required: true, message: '请选择所在班级', trigger: 'change'}
					]
				},
				showEditStuDialog: false,
				tableLoading: false,
				selection: [],
				searchText: '',
				selectCondtion: {
                    id: '',
                    name: '',
					deptId: '',
					majorId: '',
					schoolYear: '',
                    class: '',
                    page: 1,
                    pageSize: 20,
                    sortWay: '-create'
				},
				tableColumns: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                        key: 'dept.name'
                    },
                    {
                        title: '专业',
                        key: 'major.name'
                    },
                    {
                        title: '年级',
                        key: 'schoolYear'
                    },
                    {
                        title: '班级',
                        key: 'class'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editStuInfo(params.index)
                                            }
                                        }
                                    },
                                    '编辑'
                                ),
                                h(
                                    'Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteStu(params.index)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
				stuList,
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
                ]
			}
		},
		methods: {
            initCondition() {
                DeptApi.listAll().then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data)
                        this.deptList = util.safe(data, "data.deptList", [])
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
            },
            updateMajors() {
                MajorApi.list(this.selectCondtion.deptId).then(({ data }) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data)
                        this.majorList = util.safe(data, "data.majorList", [])
                    } else {
                        return this.$Message.error(data.msg)
                    }
                })
            },
			doSearch() {
				console.log(this.searchText)
			},
			doExport() {
				this.$refs.table.exportCsv({
					filename: '学生信息'
				})
			},
			doDeleteBatch() {
				this.$Modal.confirm({
					title: '删除选中的学生',
					content: '确定删除选中的学生，删除后不可恢复',
					onOk: () => {
						this.$Message.success('删除成功')
					}
				})
			},
			selectionChange(selection) {
				this.selection = selection
			},
			editStuInfo(index) {
				this.showEditStuDialog = true
			},
			commitEditInfo() {
			},
			deleteStu(index) {
				this.$Modal.confirm({
					title: '删除选中的学生',
					content: '确定删除选中的学生，删除后不可恢复',
					onOk: () => {
						this.$Message.success('删除成功')
					}
				})
			}
		},
		mounted () {
			this.initCondition();
		}
	}
</script>

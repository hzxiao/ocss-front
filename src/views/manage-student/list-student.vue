<style lang="less">
    @import './list-student.less';
</style>

<template>
	<div class="sl">
		<div class="search">
			<Input v-model="searchText" icon="search" placeholder="输入学生姓名或学号" style="width: 200px"/>
			<Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
		</div>

		<div class="condition">
			<div class="cond-item">
				<p>学院：</p>
				<Select v-model="selectCondtion.academy" filterable clearable>
					<Option v-for="item in showCondtion.academyList" :value="item.value" :key="item.value">{{ item.label
						}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>专业：</p>
				<Select v-model="selectCondtion.major" filterable clearable>
					<Option v-for="item in showCondtion.majorList" :value="item.value" :key="item.value">{{ item.label
						}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>年级：</p>
				<Select v-model="selectCondtion.grade" filterable clearable>
					<Option v-for="item in showCondtion.gradeList" :value="item.value" :key="item.value">{{ item.label
						}}
					</Option>
				</Select>
			</div>

			<div class="cond-item">
				<p>班级：</p>
				<Select v-model="selectCondtion.clazz" filterable clearable>
					<Option v-for="item in showCondtion.clazzList" :value="item.value" :key="item.value">{{ item.label
						}}
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
					  @on-change="changePage"
					  @on-page-size-change="changePageSize"
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
							<Input v-model="formValidate.student_id" placeholder="输入学号"></Input>
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
							<Select v-model="formValidate.degree" placeholder="选择年级">
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
			</Form>
		</Modal>
	</div>

</template>

<script>
	import { stuList, tableColumns } from './data'
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
				showCondtion: {
					academyList: [],
					majorList: [],
					gradeList: [
						{value: 2014, label: '2014级'},
						{value: 2015, label: '2015级'},
						{value: 2016, label: '2016级'},
						{value: 2017, label: '2017级'}
					],
					clazzList: []
				},
				selectCondtion: {
					academy: '',
					major: '',
					grade: '',
					clazz: ''
				},
				tableColumns,
				stuList
			}
		},
		methods: {
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
			console.log(this.$store)
		}
	}
</script>
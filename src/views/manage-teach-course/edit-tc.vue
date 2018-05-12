<template>
    <div>
        <o-form :form-data="formData"
                :searchData="searchData"
                @on-focus="handleFocus"
                @submit="handleSubmit"
                @on-date-change="handleDateChange">
            <div slot="left-end">
                <FormItem label="起始结束周" required style="margin-top: 4rem;" :label-width="90" :rules="{
                  required: true,
                  type: 'array'
                }">
                    <Slider v-model="takeWeek" show-tip="always" :min="1" :max="20" range></Slider>
                </FormItem>
            </div>

            <div slot="right-end">
                <FormItem label="上课时间" required :label-width="70" :rules="{
                  required: true,
                  type: 'array'
                }">
                    <span v-for="(title, key) of takeTime.dayOfWeek.titles"
                          :style="{ 'margin-right': key !== 4 && '1.8rem' }">星期{{ title }}</span>
                    <CheckboxGroup v-for="sections of takeTime.sectionGroup" v-model="sections.model"
                                   @on-change="handleCheckboxGroupClick(takeTime.sectionGroup)">
                        <Checkbox v-for="(section, index) of sections.list" :label="index"
                                  @on-change="handleCheckboxClick(section)">
                            <span v-if="section.toString().length > 1" style="padding: 11px;">{{ section }}</span>
                            <span v-else style="padding: 14px;">{{ section }}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </div>

        </o-form>

        <Modal
                v-model="selectModel"
                :title="modelTitle"
                @on-cancel="modelCancel"
                @on-ok="modelOk()">
            <div class="search" style="margin-bottom:20px">
                <Input v-model="searchText" icon="search" :placeholder="placeholder" style="width: 200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="doSearch()">搜索</Button>
            </div>

            <Table highlight-row ref="currentRowTable" height="400" width="500" :columns="tableColumns" :data="tableData"
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

    </div>

</template>

<script>
    import oForm from '../../components/o-form'
    import {TcApi, CourseApi, TeacherApi} from '../../api'
    import util from '../../libs/util';
    import {schoolYearList, termList} from '../../libs/data';
    import {merge, prop, sort, pipe, pluck, flatten, uniq, map, range, filter, compose, not, inc} from 'ramda'

    export default {
        components: {
            oForm
        },
        data() {
            return {
                selectModel: false,
                modelType:'',
                modelTitle: '',
                page: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
                idLabel: '代码',
                placeholder: '',
                currentSelectId: '',
                searchText: '',

                formData: {
                    left: {
                        cid: {
                            label: '课程代码',
                            value: '',
                            type: 'search',
                            placeholder: '输入课程号码',
                            required: true,
                        },
                        tid: {
                            label: '教师工号',
                            value: '',
                            type: 'search',
                            placeholder: '输入老师学号',
                            required: true,
                        },
                        schoolYear: {
                            label: '学年',
                            type: 'select',
                            list: schoolYearList,
                            value: '',
                            required: true
                        },
                        term: {
                            label: '学期',
                            type: 'select',
                            list: termList,
                            value: ''
                        },
                        capacity: {
                            label: '容量',
                            type: 'number',
                            value: 0,
                            required: true
                        },
                        addr: {
                            label: '地点',
                            value: ''
                        }
                    },
                    right: {
                        startSelectTime: {
                            label: '开始选课时间',
                            model: '',
                            value: '',
                            type: 'date',
                            required: true
                        },
                        endSelectTime: {
                            label: '结束选课时间',
                            model: '',
                            value: '',
                            type: 'date',
                            required: true
                        },
                    },
                },
                takeTime: {
                    dayOfWeek: {
                        value: [''],
                        titles: ['一', '二', '三', '四', '五']
                    },
                    sectionGroup: [
                        {'model': [], 'list': [1, 1, 1, 1, 1]},
                        {'model': [], 'list': [2, 2, 2, 2, 2]},
                        {'model': [], 'list': [3, 3, 3, 3, 3]},
                        {'model': [], 'list': [4, 4, 4, 4, 4]},
                        {'model': [], 'list': [5, 5, 5, 5, 5]},
                        {'model': [], 'list': [6, 6, 6, 6, 6]},
                        {'model': [], 'list': [7, 7, 7, 7, 7]},
                        {'model': [], 'list': [8, 8, 8, 8, 8]},
                        {'model': [], 'list': [9, 9, 9, 9, 9]},
                        {'model': [], 'list': [10, 10, 10, 10, 10]},
                        {'model': [], 'list': [11, 11, 11, 11, 11]}
                    ],
                    value: {}
                },
                takeWeek: [1, 20],
                tableColumns: [
                    {
                        title: this.idLabel,
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
            }
        },
        computed: {
            tcData() {
                return this.$store.getters['tc/data']
            },
            searchData() {
                return {
                    tid: this.$store.getters['teachers/mapProp']('id'),
                    cid: this.$store.getters['courses/mapProp']('id')
                }
            },
            formValues() {
                return Object.values(this.formData).reduce((acc, cur) => Object.assign({}, acc, cur), {}) || {}
            }
        },
        methods: {
            handleSubmit(form, data) {
                const takeTime = prop('value', this.takeTime)
                const takeWeek = {
                    startWeek: this.takeWeek[0],
                    endWeek: this.takeWeek[1]
                };

                const formData = merge(data, {takeTime, takeWeek})

                form.validate((valid) => {
                    if (!valid) {
                        return
                    }
                    formData.term = parseInt(formData.term);
                    formData.id = this.$route.params.id;
                    TcApi.update(formData).then(({data}) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.$Message.success('修改成功');
                            this.getCurrentInfo()

                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                })
            },
            handleDateChange(fields) {
                console.log('add-tc/handleDateChange')
                console.log(fields)
                console.log('model', fields.model)
                if (fields.type === 'daterange') {
                    fields.value = {
                        startWeek: fields.model[0].getTime(),
                        endWeek: fields.model[1].getTime()
                    }
                }
                fields.value = fields.model.getTime()
            },
            handleCheckboxGroupClick(sectionGroup) {
                const dayOfWeek = pipe(
                    pluck('model'),
                    flatten,
                    uniq,
                    sort((a, b) => a > b),
                    map(i => this.takeTime.dayOfWeek.titles[i])
                )(sectionGroup)
                const models = pluck('model', sectionGroup)
                const sections = map(index => filter(compose(not, not), map(arr => arr.includes(index) && inc(models.indexOf(arr)), models)), range(0, 5))
                this.takeTime.value = {
                    dayOfWeek,
                    sections
                }
            },
            handleCheckboxClick(section) {
                console.log(section)
            },
            handleFocus(fields) {
                if (!fields) {
                    return
                }
                this.selectModel = true;
                if (fields.label === '课程代码') {
                    this.modelType = 'course';
                    this.modelTitle = '选择课程';
                    this.placeholder = '请输入课程代码或课程名称';
                    this.idLabel = '课程代码';
                } else {
                    this.modelType = 'teacher';
                    this.modelTitle = '选择教师';
                    this.placeholder = '请输入教师工号或教师姓名';
                    this.idLabel = '教师工号'
                }
                this.doSearch();
            },
            changePage(page) {
                this.page = page;
                this.doSearch();
            },
            changePageSize(size) {
                this.pageSize = size;
                this.doSearch();
            },
            modelOk() {
                if (this.modelType === 'course') {
                    this.formData.left.cid.value = this.currentSelectId;
                } else if (this.modelType === 'teacher') {
                    this.formData.left.tid.value = this.currentSelectId;
                }
            },
            modelCancel() {
                this.pageSize = 20;
                this.page = 1;
                this.searchText = '';
                this.tableData = [];
            },
            doSearch() {
                let cond = {
                    id: this.searchText,
                    name: this.searchText,
                    page: this.page,
                    pageSize: this.pageSize,
                };

                if (this.modelType === 'course') {
                    CourseApi.list(cond).then(({data}) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.tableData = util.safe(data, 'data.courseList', []);
                            for (let i = 0; i < this.tableData.length; i++) {
                                this.tableData[i].deptName = this.tableData[i].dept.name;
                            }
                            this.total = util.safe(data, 'data.total', 0);
                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                } else if (this.modelType === 'teacher') {
                    TeacherApi.list(cond).then(({data}) => {
                        if (data.code === this.$code.SUCCESS) {
                            this.tableData = util.safe(data, 'data.teacherList', []);
                            for (let i = 0; i < this.tableData.length; i++) {
                                this.tableData[i].deptName = this.tableData[i].dept.name;
                            }
                            this.total = util.safe(data, 'data.total', 0);
                        } else {
                            return this.$Message.error(data.msg)
                        }
                    })
                }
            },
            handleCurrentRowChange(currentRow, oldCurrentRow) {
                console.log(currentRow);
                this.currentSelectId = currentRow.id;
            },
            getCurrentInfo() {
                console.log(this.$route.params.id);
                let id = this.$route.params.id;
                TcApi.getById(id).then(({data}) => {
                    if (data.code === this.$code.SUCCESS) {
                        console.log(data);
                        let tc = util.safe(data, 'data.tc', {});
                        this.formData.left.cid.value = tc.cid;
                        this.formData.left.tid.value = tc.tid;
                        this.formData.left.term.value = ''+tc.term;
                        this.formData.left.schoolYear.value = tc.schoolYear;
                        this.formData.left.capacity.value = tc.capacity;
                        this.formData.left.addr.value = tc.addr;
                        if (tc.takeWeek) {
                            this.takeWeek = [parseInt(tc.takeWeek.startWeek), parseInt(tc.takeWeek.endWeek)]
                        }
                        this.formData.right.startSelectTime.value = tc.startSelectTime;
                        this.formData.right.startSelectTime.model = util.formatDateTime(tc.startSelectTime);

                        this.formData.right.endSelectTime.value = tc.endSelectTime;
                        this.formData.right.endSelectTime.model = util.formatDateTime(tc.endSelectTime);

                        if (tc.takeTime) {
                            this.takeTime.dayOfWeek.value = tc.takeTime.dayOfWeek;
                            for (var i = 0; i < tc.takeTime.sections.length; i++) {
                                var secs = tc.takeTime.sections[i];
                                for (var j = 0; j < secs.length; j++) {
                                    var s = secs[j]-1;
                                    this.takeTime.sectionGroup[s].model.push(i);
                                }
                            }
                        }
                        // this.takeTime.sectionGroup[0].model = [2,2]
                    } else {
                        return this.$Message.error(data.msg)
                    }
                });
            }
        },
        mounted() {
            this.getCurrentInfo()
        }
    }
</script>

<style>

</style>
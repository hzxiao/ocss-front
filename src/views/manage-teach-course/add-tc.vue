<template>
    <div>
        <o-form :form-data="formData"
             :searchData="searchData"
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
                    <span v-for="(title, key) of takeTime.dayOfWeek.titles" :style="{ 'margin-right': key !== 4 && '1.8rem' }">星期{{ title }}</span>
                    <CheckboxGroup v-for="sections of takeTime.sectionGroup" v-model="sections.model" @on-change="handleCheckboxGroupClick(takeTime.sectionGroup)">
                        <Checkbox v-for="(section, index) of sections.list" :label="index" @on-change="handleCheckboxClick(section)">
                            <span v-if="section.toString().length > 1" style="padding: 11px;">{{ section }}</span>
                            <span v-else style="padding: 14px;">{{ section }}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </div>

        </o-form>
    </div>

</template>

<script>
    import oForm from '../../components/o-form'
    import { TcApi } from '../../api'
    import { merge, prop, sort, pipe, pluck, flatten, uniq, map, range, filter, compose, not, inc } from 'ramda'

    export default {
        components: {
            oForm
        },
        data: () => ({
            formData: {
                left: {
                    cid: {
                        label: '课程号码',
                        value: '',
                        type: 'search',
                        placeholder: '输入课程号码',
                        required: true
                    },
                    tid: {
                        label: '老师学号',
                        value: '',
                        type: 'search',
                        placeholder: '输入老师学号',
                        required: true
                    },
                    credit: {
                        label: '学分',
                        type: 'number',
                        value: 0,
                        required: true
                    },
                    capacity: {
                        label: '容量',
                        type: 'number',
                        value: 0,
                        required: true
                    },
                    margin: {
                        label: '余量',
                        type: 'number',
                        value: 0,
                        required: false
                    },
                    addr: {
                        label: '地点',
                        value: ''
                    }
                },
                right: {
                    nature: {
                        label: '课程性质',
                        type: 'select',
                        value: '',
                        required: true,
                        list: [
                            {id: '14', name: '2014级'},
                            {id: '15', name: '2015级'},
                            {id: '16', name: '2016级'},
                            {id: '17', name: '2017级'}
                        ]
                    },

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
                    {'model': [], 'list':[ 1, 1, 1, 1, 1]},
                    {'model': [], 'list':[ 2, 2, 2, 2, 2]},
                    {'model': [], 'list':[ 3, 3, 3, 3, 3]},
                    {'model': [], 'list':[ 4, 4, 4, 4, 4]},
                    {'model': [], 'list':[ 5, 5, 5, 5, 5]},
                    {'model': [], 'list':[ 6, 6, 6, 6, 6]},
                    {'model': [], 'list':[ 7, 7, 7, 7, 7]},
                    {'model': [], 'list':[ 8, 8, 8, 8, 8]},
                    {'model': [], 'list':[ 9, 9, 9, 9, 9]},
                    {'model': [], 'list':[10,10,10,10,10]},
                    {'model': [], 'list':[11,11,11,11,11]}
                ],
                value: {}
            },
            takeWeek: [1, 20]
        }),
        computed: {
            tcData () {
                return this.$store.getters['tc/data']
            },
            searchData () {
                return {
                    tid: this.$store.getters['teachers/mapProp']('id'),
                    cid: this.$store.getters['courses/mapProp']('id')
                }
            },
            formValues () {
                return Object.values(this.formData).reduce((acc, cur) => Object.assign({}, acc, cur), {}) || {}
            }
        },
        methods: {
            handleSubmit (form, data) {
                const takeTime = prop('value', this.takeTime)
                const takeWeek = {
                    startWeek: this.takeWeek[0],
                    endWeek: this.takeWeek[1]
                }

                const formData = merge(data, { takeTime, takeWeek })

                form.validate((valid) => {
                    valid && this.$store.dispatch('tc/create', formData)
                })
            },
            handleDateChange (fields) {
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
            handleCheckboxGroupClick (sectionGroup) {
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
            handleCheckboxClick (section) {
                console.log(section)
            }
        },
        mounted () {

        }
    }
</script>

<style>

</style>
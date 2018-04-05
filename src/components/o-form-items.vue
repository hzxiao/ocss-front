<template>
    <div>
        <FormItem v-for="(fields, key) of items" :label="fields.label || key" :prop="key"
                  :rules="getDefaultRules(fields)">

            <Select v-if="fields.type === 'select'"
                    v-model="fields.value"
                    :placeholder="'选择' + fields.label"
                    @on-change="handleSelectChange">
                <Option v-for="item in fields.list"
                        :value="item.id" :key="item.id">
                    {{ item.name }}</Option>
            </Select>

            <Input v-else-if="fields.type === 'search'"
                          v-model="fields.value"
                          :placeholder="fields.placeholder"
                            @on-focus="handleFocus(fields)"/>

            <DatePicker v-else-if="fields.type === 'date'"
                        v-model="fields.model"
                        @on-change="handleDateChange(fields)"
                        placeholder="选择日期"
                        style="width: 200px"></DatePicker>

            <DatePicker v-else-if="fields.type === 'daterange'"
                        v-model="fields.model"
                        @on-change="handleDateChange(fields)"
                        type="daterange"
                        placeholder="选择日期"
                        style="width: 200px"></DatePicker>

            <Transfer
                    v-else-if="fields.type === 'array'"
                    :date="fields.value"
                    @on-change="handleArrayChange(fields)"></Transfer>

            <InputNumber v-else-if="fields.type === 'number'"
                         v-model="fields.value"
                         :min="fields.min"
                         :max="fields.max"
                         :placeholder="'输入' + fields.label"></InputNumber>

            <Input v-else v-model="fields.value" :placeholder="fields.placeholder"></Input>
        </FormItem>
    </div>
</template>

<script>
    import { path, split } from 'ramda'

    export default {
        name: 'o-form-items',
        props: {
            items: Object,
            filteredSearchData: Object
        },
        methods: {
            getDefaultRules(fields) {
                const required = typeof fields.required === 'undefined' ? true : fields.required
                const type =
                    fields.type && fields.type.includes('date')
                        ? 'number'
                        : fields.type === 'select' || fields.type === 'search'
                            ? 'string'
                            : fields.type

                return fields.rules || {
                    type: path(split('.', 'rules.type'), fields) || type,
                    required,
                    message: fields.label + '不能为空',
                    trigger: 'blur'
                }
            },
            handleSelectChange(v) {
                this.$emit('on-select-change', v)
            },
            handleSearch(key, query) {
                this.$emit('on-search', key, query)
            },
            handleDateChange (fields) {
                this.$emit('on-date-change', fields)
            },

            handleArrayChange (fields) {
                console.log(fields)
            },
            handleFocus(fields) {
                this.$emit('on-focus', fields)
            }
        }
    }
</script>

<style scoped>

</style>
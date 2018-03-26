<template>
    <div class="as">
        <Form ref="form" :model="formValues" :label-width="80">
            <div class="lrbox">
                <div class="left-side">
                    <slot name="left-start"></slot>
                    <oFormItems
                            :items="formData.left"
                            :filtered-search-data="filteredSearchData"
                            @on-search="handleSearch"
                            @on-select-change="handleSelectChange"
                            @on-date-change="handleDateChange"></oFormItems>
                    <slot name="left-end"></slot>
                </div>

                <div class="right-side">
                    <slot name="right-start"></slot>
                    <oFormItems
                            :items="formData.right"
                            :filtered-search-data="filteredSearchData"
                            @on-search="handleSearch"
                            @on-select-change="handleSelectChange"
                            @on-date-change="handleDateChange"></oFormItems>
                    <slot name="right-end"></slot>
                </div>
            </div>

            <FormItem class="btn">
                <Button type="primary" @click="handleSubmit()">提交</Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import oFormItems from './o-form-items'
    import { map, zipObj, values, prop, keys, mergeAll } from 'ramda'

    export default {
        name: 'oForm',
        components: {
            oFormItems
        },
        props: {
            formData: {
                type: Object,
                default: () => ({})
            },
            searchData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                filteredSearchData: this.getSearchData()
            }
        },
        computed: {
            formValues () {
                // {left: { addr: { value: 'a' }}, right: { id: { value: 'b' }}}
                //   -> { addr: { value: 'a' }, id: { value: 'b' } }
                console.log(this.formData)
                const DATA = mergeAll(values(this.formData))
                // DATA -> ['addr', 'id']
                const KEYS = keys(DATA)
                // DATA -> ['a', 'b']
                const VALUES = map(prop('value'), values(DATA))
                // { addr: 'a', id: 'b' }
                const final = zipObj(KEYS, VALUES)
                return final
            }
        },
        methods: {
            handleSubmit () {
                this.$emit('submit', this.$refs.form, this.formValues)
            },

            handleReset () {
                this.$refs.form.resetFields()
            },

            handleSelectChange (v) {
                console.log(v)
            },

            handleDateChange (fields) {
                console.log(fields)
                // There have a bug with stack call, that event on-date-change was call before the model is changed
                setTimeout(() => this.$emit('on-date-change', fields), 0)
            },

            handleSearch (key, query) {
                const data = this.searchData[key].slice()
                this.filteredSearchData[key] = data.filter(item => item.includes(query)).slice(0, 50)
            },

            getSearchData () {
                return JSON.parse(JSON.stringify(this.searchData))
            }
        }
    }
</script>

<style lang="less">
    .as {
        margin-top: 50px;
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
<template>
    <os-table
            :total="total"
            :loading="loading"
            :table-columns="tableColumns"
            :table-data="tableData"
            :selectCond="selectCond"
            @selection-change="selectionChange"
            @page-change="pageChange"
            @page-size-change="pageSizeChange">

    </os-table>
</template>

<script>
    import osTable from '../../components/o-table'
    import tableColumns from './columns'

    export default {
        components: { osTable },
        data: () => ({
            total: 0,
            loading: false,
            selectCond: {
                name: '',
                deptId: '',
                nature: '',
                attr: '',
                selectState: '0',
                page: 1,
                pageSize: 20,
                sort: '-create'
            },
            tableColumns,
            tableData: []
        }),
        methods: {
            selectionChange (s) {
                window.console.log(s)
            },
            pageChange (s) {
                window.console.log(s)
            },
            pageSizeChange (s) {
                window.console.log(s)
            }
        },

        mounted () {
            DeptApi.listAll().then(({data}) => {
                if (data.code === this.$code.SUCCESS) {
                    this.deptList = util.safe(data, 'data.deptList', [])
                } else {
                    return this.$Message.error(data.msg)
                }
            });
        }
    }
</script>

<style lang="css">


</style>

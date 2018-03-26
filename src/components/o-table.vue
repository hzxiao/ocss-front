<template>
    <Table ref="table"
           :loading="loading"
           :data="tableData"
           :columns="tableColumns"
           @on-selection-change="handleSelectionChange" stripe>
        <div slot="footer" style="padding-left:5px">
            <Page show-elevator show-total show-sizer
                  size="small"
                  placement="top"
                  :total="total"
                  :current="selectCond.page"
                  :page-size="selectCond.pageSize"
                  @on-change="handlePageChange"
                  @on-page-size-change="handlePageSizeChange"></Page>
        </div>
    </Table>
</template>

<script>
    export default {
        name: 'oTable',
        props: {
            total: Number,
            loading: Boolean,
            selectCond: Object,
            tableData: Array,
            tableColumns: Array
        },
        methods: {
            handleSelectionChange (s) {
                this.$emit('selection-change', s)
            },
            handlePageChange (s) {
                this.$emit('page-change', s)
            },
            handlePageSizeChange (s) {
                this.$emit('page-size-change', s)
            }
        }
    }
</script>

<style scoped>

</style>
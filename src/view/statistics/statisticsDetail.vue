<style lang="less">
  @import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <span @click="exportData" style="margin: 0 10px;"><Button type="primary" icon="ios-download-outline">导出</Button></span>
      </Row>
      <Row class="margin-top-10">
        <Table :data="tableData" ref="table" :loading="loading" :columns="tableColumns" @on-row-dblclick="rowDblclick" stripe></Table>
        <!--<div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="page.total" :current="page.pageNum" :page-size="page.pageSize"
            show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>-->
      </Row>
    </Card>
  </Row>
</template>

<script>
import {selectScoreByname} from '@/api/score'
import table2excel from '@/libs/table2excel2.js'

export default {
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      query: {
        searchConName: ''
      },
      loading: false,
      department: this.$store.state.app.departmentDic,
      position: {
        '1': '领导',
        '2': '普通员工'
      },
      tableColumns: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '部门',
          key: 'department',
          render: (h, params) => {
            const row = params.row
            return h('div', this.department[row.department] || row.department)
          }
        },
        {
          title: '职位',
          key: 'position',
          render: (h, params) => {
            const row = params.row
            return h('div', this.position[row.position] || row.position)
          }
        },
        {
          title: '指标名称',
          key: 'zbmc'
        },
        {
          title: '分数',
          key: 'fs'
        },
        {
          title: '评分人',
          key: 'pfr'
        }
      ]
    }
  },
  methods: {
    handleSearch () {
      let that_ = this
      let params = {
        pageNum: that_.page.pageNum,
        pageSize: that_.page.pageSize,
        versionid: that_.$route.query.versionid,
        username: that_.$route.query.username
      }
      that_.loading = true
      selectScoreByname(params).then(res => {
        if (res.code === 200) {
          that_.tableData = res.data
        }
        that_.loading = false
      })
    },
    changePage (num) {
      this.pageNum = num
    },
    changePageSize (size) {
      this.pageSize = size
    },
    exportData () {
      let tabledic = {
        department: this.department,
        position: this.position,
        status: this.status
      }
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.total,
        versionid: this.$route.query.versionid,
        username: this.$route.query.username
      }
      selectScoreByname(params).then(res => {
        if (res.code === 200) {
          table2excel(this.tableColumns, res.data, '评分明细', tabledic)
        }
      })
    }
  },
  mounted () {
    this.handleSearch()
  }
}
</script>

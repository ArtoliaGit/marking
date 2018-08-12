<style lang="less">
  @import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <Select v-model="query.versionid" clearable style="width:200px;" placeholder="请选择评分周期">
          <Option v-for="(value, key) in versionDic" :key="'version' + key" :value="value.versionid">{{ value.versionid }}</Option>
        </Select>
        <Select v-model="query.department" clearable style="width:200px;margin-left:10px;" placeholder="请选择部门">
          <Option v-for="(value, key) in department" :key="'position' + key" :value="key">{{ value }}</Option>
        </Select>
        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="ios-download-outline">查询</Button></span>
        <span @click="exportData"><Button type="primary" icon="ios-download-outline">导出</Button></span>
      </Row>
      <Row class="margin-top-10">
        <Table :data="tableData" ref="table" :loading="loading" :columns="tableColumns" @on-row-dblclick="rowDblclick" stripe></Table>
        <!--<div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="page.total" :current="page.pageNum" :page-size="page.pageSize"
            show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>-->
        <Modal
          v-model="showAddNewTodo"
          title="评分详情"
          width="1000">
          <Table :data="detailTableData" ref="detailTable" :loading="detailLoading" :columns="detailTableColumns" stripe></Table>
          <div slot="footer"></div>
        </Modal>
      </Row>
    </Card>
  </Row>
</template>

<script>
import {selectCountzf, selectScoreByname} from '@/api/score'
import table2excel from '@/libs/table2excel2.js'
import {findVersionAll} from '@/api/version'

export default {
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      detailTableData: [],
      query: {
        versionid: 1,
        department: 0
      },
      loading: false,
      detailLoading: false,
      department: this.$store.state.app.departmentDic,
      showAddNewTodo: false,
      versionDic: {},
      position: {
        '1': '领导',
        '2': '普通员工'
      },
      tableColumns: [
        {
          title: '被评分人',
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
          title: '分数',
          key: 'fs'
        },
        {
          title: '评分周期',
          key: 'versionid'
        }
      ],
      detailTableColumns: [
        {
          title: '被评分人',
          key: 'username'
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
        versionid: that_.query.versionid,
        department: that_.query.department
      }
      that_.loading = true
      selectCountzf(params).then(res => {
        if (res.code === 200) {
          that_.tableData = res.data
        }
        that_.loading = false
      })
    },
    handleSearchDetail (versionid, username) {
      let that_ = this
      let params = {
        pageNum: that_.page.pageNum,
        pageSize: that_.page.pageSize,
        versionid: versionid,
        username: username
      }
      that_.detailLoading = true
      selectScoreByname(params).then(res => {
        if (res.code === 200) {
          that_.detailTableData = res.data
        }
        that_.detailLoading = false
      })
    },
    getVersionDic () {
      let that_ = this
      findVersionAll().then(res => {
        if (res.code === 200) {
          that_.versionDic = res.data
        }
      })
    },
    changePage (num) {
      this.pageNum = num
    },
    changePageSize (size) {
      this.pageSize = size
    },
    rowDblclick (row) {
      // this.$router.push({
      //   name: 'scoreDetail',
      //   query: {
      //     versionid: row.versionid,
      //     username: row.username
      //   }
      // })
      this.showAddNewTodo = true
      this.handleSearchDetail(row.versionid, row.username)
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
        versionid: this.query.versionid,
        department: this.query.department
      }
      selectCountzf(params).then(res => {
        if (res.code === 200) {
          table2excel(this.tableColumns, res.data, '评分信息', tabledic)
        }
      })
    }
  },
  mounted () {
    this.getVersionDic()
    this.handleSearch()
  }
}
</script>

<style lang="less">
@import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <Select v-model="query.begin" clearable style="width:150px;" placeholder="请选择开始周期">
          <Option v-for="(value, key) in versionDic" :key="'version' + key" :value="value.versionid">{{ value.versionid }}</Option>
        </Select>
        <Select v-model="query.end" clearable style="width:150px;margin-left:10px;" placeholder="请选择结束周期">
          <Option v-for="(value, key) in versionDic" :key="'version' + key" :value="value.versionid">{{ value.versionid }}</Option>
        </Select>
        <Select v-model="query.department" clearable style="width:150px;margin-left:10px;" placeholder="请选择部门">
          <Option v-for="(value, key) in department" :key="'department' + key" :value="key">{{ value }}</Option>
        </Select>
        <Select v-model="query.indexType" clearable style="width:150px;margin-left:10px;" placeholder="请选择指标">
          <Option v-for="(value, key) in indexDic" :key="'department' + key" :value="key">{{ value }}</Option>
        </Select>
        <span @click="getListData" style="margin: 0 10px;"><Button type="primary" icon="ios-search-strong">查询</Button></span>
        <span @click="exportData"><Button type="primary" icon="ios-download-outline">导出</Button></span>
      </Row>
      <Row class="margin-top-10">
        <Table :data="tableData" ref="table" :loading="loading" :columns="tableColumns" stripe></Table>
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
import table2excel from '@/libs/table2excel2.js'
import {selectByLd} from '@/api/score'
import {findVersionAll} from '@/api/version'
export default {
  name: 'leaderRank',
  data () {
    return {
      query: {
        department: '',
        indexType: '',
        begin: '',
        end: ''
      },
      tableData: [],
      loading: false,
      tableColumns: [],
      department: this.$store.state.app.departmentDic,
      versionDic: {},
      indexDic: this.$store.state.app.indexDic
    }
  },
  methods: {
    getListData () {
      let params = {
        begin: this.query.begin,
        end: this.query.end,
        department: this.query.department,
        zbid: this.query.indexType
      }
      this.loading = true
      selectByLd(params).then(res => {
        this.tableColumns = []
        if (res.code === 200) {
          this.tableColumns.push({
            key: 'username',
            title: '姓名',
            minWidth: 100
          })
          res.pfrColumn.map(data => {
            this.tableColumns.push({
              key: data,
              title: data,
              minWidth: 100
            })
          })
          this.tableColumns.push({
            key: 'zfs',
            title: '合计',
            minWidth: 100
          })
          this.tableColumns.push({
            key: 'pjf',
            title: '平均分',
            minWidth: 100
          })
          this.tableColumns.push({
            key: 'rs',
            title: '人数',
            minWidth: 100
          })
          this.tableData = res.data.map(data => {
            let singleData = {}
            singleData.username = data.username
            data.zbfs.split(',').map(zbfs => {
              let singleZbfs = zbfs.split(':')
              singleData[singleZbfs[0]] = singleZbfs[1]
            })
            singleData.zfs = data.zfs
            singleData.pjf = data.pjf
            singleData.rs = data.rs
            return singleData
          })
        }
        this.loading = false
      })
    },
    exportData () {
      let time = new Date().getTime()
      table2excel(this.tableColumns, this.tableData, '领导得分汇总' + time)
    },
    getVersionDic () {
      let that_ = this
      findVersionAll().then(res => {
        if (res.code === 200) {
          that_.versionDic = res.data
        }
      })
    }
  },
  created () {
    this.getVersionDic()
  },
  mounted () {
    this.getListData()
  }
}
</script>

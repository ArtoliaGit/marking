<style lang="less">
@import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <Select v-model="query.type" style="width:150px;" placeholder="请选择统计方式">
          <Option v-for="item in typeDic" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="query.begin" clearable style="width:150px;margin-left:10px;" placeholder="请选择开始周期">
          <Option v-for="(value, key) in versionDic" :key="'version' + key" :value="value.versionid">{{ value.versionid }}</Option>
        </Select>
        <Select v-model="query.end" clearable style="width:150px;margin-left:10px;" placeholder="请选择结束周期">
          <Option v-for="(value, key) in versionDic" :key="'version' + key" :value="value.versionid">{{ value.versionid }}</Option>
        </Select>
        <Select v-model="query.department" clearable style="width:150px;margin-left:10px;" placeholder="请选择部门">
          <Option v-for="(value, key) in department" :key="'department' + key" :value="key">{{ value }}</Option>
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
import {selectByPm} from '@/api/score'
import {findVersionAll} from '@/api/version'
export default {
  name: 'yearRankCount',
  data () {
    return {
      query: {
        type: '1',
        department: '',
        begin: '',
        end: ''
      },
      typeDic: [{
        value: '1',
        label: '实际分数'
      }, {
        value: '2',
        label: '折算分数'
      }],
      tableData: [],
      loading: false,
      tableColumns: [
        {
          key: 'username',
          title: '姓名'
        }, {
          key: 'zfs',
          title: '分数'
        }, {
          key: 'pjf',
          title: '平均分'
        }, {
          key: 'pm',
          title: '排名'
        }
      ],
      department: this.$store.state.app.departmentDic,
      versionDic: {}
    }
  },
  methods: {
    getListData () {
      let params = {
        begin: this.query.begin,
        end: this.query.end,
        department: this.query.department,
        type: this.query.type
      }
      this.loading = true
      selectByPm(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
        this.loading = false
      })
    },
    exportData () {
      let time = new Date().getTime()
      table2excel(this.tableColumns, this.tableData, '年排名' + time)
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
    // this.department[0] = '全部'
    this.getVersionDic()
  },
  mounted () {
    this.getListData()
  }
}
</script>

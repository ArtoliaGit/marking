<style lang="less">
  @import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <Input v-model="query.username" placeholder="请输入姓名" style="width:200px;" clearable></Input>
        <Select v-model="query.department" clearable style="width:200px;margin-left:10px;" placeholder="请选择部门">
          <Option v-for="(value, key) in department" :key="'department' + key" :value="key">{{ value }}</Option>
        </Select>
        <Select v-model="query.position" clearable style="width:200px;margin-left:10px;" placeholder="请选择职位">
          <Option v-for="(value, key) in position" :key="'position' + key" :value="key">{{ value }}</Option>
        </Select>
        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="ios-search-strong">查询</Button></span>
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
          title="用户指标关联列表"
          width="800">
          <Row>
            <Row>
              <span @click="addNew" style="margin: 0;"><Button type="primary" icon="android-add">添加</Button></span>
            </Row>
            <Row class="margin-top-10">
              <Table :data="detailTableData" ref="detailTable" :height="height" :loading="detailLoading" :columns="detailTableColumns" stripe></Table>
            </Row>
          </Row>
          <Row slot="footer"></Row>
        </Modal>
        <Modal
          v-model="showAddRelated"
          title="添加指标关联"
          width="800">
          <Row>
            <span @click="saveRelated" style="margin: 0;"><Button type="primary" icon="bookmark">保存</Button></span>
          </Row>
          <Row class="margin-top-10">
            <Table :data="noRelatedData" ref="noRelatedTable" :height="height" :loading="noRelatedLoading" :columns="relatedColumns" @on-selection-change="selectChange" stripe></Table>
          </Row>
          <Row slot="footer"></Row>
        </Modal>
      </Row>
    </Card>
  </Row>
</template>

<script>
import {findUser, findItemRelation, findNoItem, createItemRelation, deleteItemRelation} from '@/api/user'
import leaderDic from '@/config/leaderDic.js'

export default {
  name: 'userIndex',
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      detailTableData: [],
      noRelatedData: [],
      selectDataStore: [],
      query: {
        username: '',
        department: '',
        position: ''
      },
      relatedQuery: {
        department: ''
      },
      loading: false,
      detailLoading: false,
      noRelatedLoading: false,
      showAddNewTodo: false,
      showAddRelated: false,
      department: this.$store.state.app.departmentDic,
      userId: '',
      userName: '',
      departmentVal: '',
      positionVal: '',
      position: leaderDic,
      height: window.innerHeight * 0.6,
      tableColumns: [
        {
          title: '姓名',
          key: 'userName'
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
          title: '手机号',
          key: 'phone'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const color = row.status === '0' ? 'green' : 'red'
            const text = row.status === '0' ? '正常' : '禁用'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        }
      ],
      detailTableColumns: [
        {
          title: '指标',
          key: 'rzbmc'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  let para = {
                    userid: this.userId,
                    rzbid: row.rzbid
                  }
                  deleteItemRelation(para).then(res => {
                    if (res.code === 200) {
                      this.findUserList()
                      this.$Message.success('删除成功!')
                    }
                  })
                }
              }
            }, '删除')
          }
        }
      ],
      relatedColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '指标',
          key: 'zbmc'
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
        status: '0'
      }
      if (that_.query.username) params.username = that_.query.username
      if (that_.query.department) params.department = that_.query.department
      if (that_.query.position) params.position = that_.query.position
      that_.loading = true
      findUser(params).then(res => {
        if (res.code === 200) {
          that_.tableData = res.data
        }
        that_.loading = false
      })
    },
    handleAdd () {
      this.showAddNewTodo = true
    },
    changePage (num) {
      this.pageNum = num
    },
    changePageSize (size) {
      this.pageSize = size
    },
    cancelAdd () {
      this.showAddNewTodo = false
    },
    rowDblclick (index) {
      let that_ = this
      that_.userId = index.userId
      that_.userName = index.userName
      that_.relatedQuery.department = index.department
      that_.departmentVal = index.department
      that_.positionVal = index.position
      that_.showAddNewTodo = true
      that_.findUserList()
    },
    findUserList () {
      let that_ = this
      let params = {
        userid: that_.userId
      }
      that_.detailLoading = true
      findItemRelation(params).then(res => {
        if (res.code === 200) {
          that_.detailTableData = res.data
        }
        that_.detailLoading = false
      })
    },
    addNew () {
      let that = this
      that.showAddRelated = true
      that.queryUnrelated()
    },
    queryUnrelated () {
      let that = this
      let params = {
        userid: that.userId
      }
      that.noRelatedLoading = true
      findNoItem(params).then(res => {
        if (res.code === 200) {
          that.noRelatedData = res.data
        }
        that.noRelatedLoading = false
      })
    },
    saveRelated () {
      let that = this
      let data = this.selectDataStore.map(user => {
        return {
          userid: that.userId,
          username: that.userName,
          department: that.departmentVal,
          position: that.positionVal,
          rzbid: user.zbid,
          rzbmc: user.zbmc
        }
      })
      createItemRelation(data).then(res => {
        if (res.code === 200) {
          that.findUserList()
          that.$Message.success('关联成功')
        }
      })
    },
    selectChange (selection) {
      this.selectDataStore = selection
    }
  },
  mounted () {
    this.handleSearch()
  }
}
</script>

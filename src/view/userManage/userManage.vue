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
        <span @click="handleAdd" style="margin: 0;"><Button type="primary" icon="person-add">新增</Button></span>
        <span @click="exportData" style="margin: 0 10px;"><Button type="primary" icon="ios-download-outline">导出</Button></span>
      </Row>
      <Row class="margin-top-10">
        <Table :data="tableData" ref="table" :height="height" :loading="loading" :columns="tableColumns" @on-row-dblclick="rowDblclick" stripe></Table>
        <!--<div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="page.total" :current="page.pageNum" :page-size="page.pageSize"
            show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>-->
        <Modal
          v-model="showAddNewTodo"
          title="添加用户"
          @on-ok="addNew"
          @on-cancel="cancelAdd">
          <Row>
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
              <FormItem label="姓名" prop="userName">
                <Input v-model="formItem.userName" placeholder="" style="width:300px;"></Input>
              </FormItem>
              <FormItem label="密码" prop="passWord">
                <Input v-model="formItem.passWord" placeholder="" style="width:300px;"></Input>
              </FormItem>
              <FormItem label="部门" prop="department">
                <Select v-model="formItem.department" style="width:300px;" clearable>
                  <Option v-for="(value, key) in department" :key="'position' + key" :value="key">{{ value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="职位" prop="position">
                <Select v-model="formItem.position" style="width:300px;" clearable>
                  <Option v-for="(value, key) in position" :key="'position' + key" :value="key">{{ value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="手机号码" prop="phone">
                <Input v-model="formItem.phone" placeholder="" style="width:300px;"></Input>
              </FormItem>
              <FormItem label="状态" prop="status">
                <i-switch v-model="formItem.status" size="large">
                  <span slot="open">正常</span>
                  <span slot="close">禁用</span>
                </i-switch>
              </FormItem>
            </Form>
          </Row>
          <Row slot="footer">
            <Button type="text" @click="cancelAdd">取消</Button>
            <Button type="primary" @click="addNew">确定</Button>
          </Row>
        </Modal>
      </Row>
    </Card>
  </Row>
</template>

<script>
import {getUserList, createUser, updateUser, findUser, cancelUserWx} from '@/api/user'
import table2excel from '@/libs/table2excel2.js'
import leaderDic from '@/config/leaderDic.js'

export default {
  name: 'registered',
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      query: {
        username: '',
        department: '',
        position: ''
      },
      height: window.innerHeight * 0.8,
      loading: false,
      showAddNewTodo: false,
      op: 'create',
      ruleValidate: {
        userName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      department: this.$store.state.app.departmentDic,
      position: leaderDic,
      status: {
        '0': '正常',
        '1': '禁用'
      },
      tableColumns: [
        {
          title: '姓名',
          key: 'userName'
        },
        {
          title: '密码',
          key: 'passWord'
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
          title: '是否关联微信',
          key: 'wechat',
          render: (h, params) => {
            const row = params.row
            return h('div', row.wx === '' ? '未关联' : '已关联')
          }
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
                    userid: row.userId
                  }
                  cancelUserWx(para).then(res => {
                    if (res.code === 200) {
                      this.handleSearch()
                      this.$Message.success('取消关联成功!')
                    }
                  })
                }
              }
            }, '取消关联')
          }
        }
      ],
      formItem: {
        userId: '',
        userName: '',
        passWord: '',
        department: '',
        position: '',
        wx: '',
        phone: '',
        status: true
      },
      formItemCopy: {}
    }
  },
  methods: {
    handleSearch () {
      let that_ = this
      let params = {
        pageNum: that_.page.pageNum,
        pageSize: that_.page.pageSize
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
      this.op = 'create'
      this.showAddNewTodo = true
    },
    changePage (num) {
      this.pageNum = num
    },
    changePageSize (size) {
      this.pageSize = size
    },
    addNew () {
      let that_ = this
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          let data = that_.formItem
          if (data.status === true) data.status = '0'
          else data.status = '1'
          if (that_.op === 'create') {
            createUser(data).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                that_.$Message.success('操作成功!')
              }
            }).catch(() => {
              that_.$Message.error('操作失败!')
            })
          } else if (that_.op === 'update') {
            updateUser(data).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                that_.$Message.success('操作成功!')
              }
            }).catch(() => {
              that_.$Message.error('操作失败!')
            })
          }
          this.showAddNewTodo = false
          this.formItem = {...this.formItemCopy}
        }
      })
    },
    cancelAdd () {
      this.showAddNewTodo = false
      this.formItem = {...this.formItemCopy}
    },
    rowDblclick (index) {
      let that_ = this
      that_.op = 'update'
      if (index.status === '0') index.status = true
      else index.status = false
      that_.formItem = {...index}
      that_.showAddNewTodo = true
    },
    exportData () {
      let tabledic = {
        department: this.department,
        position: this.position,
        status: this.status
      }
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.total
      }
      getUserList(params).then(res => {
        if (res.code === 200) {
          let time = new Date().getTime()
          table2excel(this.tableColumns, res.data, '用户信息' + time, tabledic)
        }
      })
    }
  },
  mounted () {
    this.formItemCopy = {...this.formItem}
    this.handleSearch()
  }
}
</script>

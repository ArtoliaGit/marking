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
          title="用户关联列表"
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
          title="添加用户关联"
          width="800">
          <Row>
            <Select v-model="relatedQuery.department" clearable style="width:200px;" placeholder="请选择部门" @on-change="queryUnrelated">
              <Option v-for="(value, key) in department" :key="'department' + key" :value="key">{{ value }}</Option>
            </Select>
            <span @click="saveRelated" style="margin: 0;"><Button type="primary" icon="bookmark">保存</Button></span>
          </Row>
          <Row class="margin-top-10">
            <Table :data="noRelatedData" ref="noRelatedTable" :height="height" :loading="noRelatedLoading" :columns="relatedColumns" @on-selection-change="selectChange" stripe></Table>
          </Row>
          <Row slot="footer"></Row>
        </Modal>
        <Modal
          v-model="showUpdateModal"
          title="修改">
          <Row>
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
              <FormItem label="模板" prop="mbid">
                <Select v-model="formItem.mbid" placeholder="" clearable style="width: 300px;">
                  <Option v-for="item in scoreTemplateDic" :key="item.mbid" :value="item.mbid">{{ item.mbmc }}</Option>
                </Select>
              </FormItem>
              <FormItem label="系数" prop="xs" required>
                <Input v-model="formItem.xs" type="text" number placeholder="" style="width: 300px;"></Input>
              </FormItem>
            </Form>
          </Row>
          <Row slot="footer">
            <Button type="text" @click="cancelUpdate">取消</Button>
            <Button type="primary" @click="sureUpdate">确定</Button>
          </Row>
        </Modal>
      </Row>
    </Card>
  </Row>
</template>

<script>
import {findUser, findUserRelation, createUserRelation, deleteUserRelation, findNoUser, updateMbid, findScoreTemplateAll} from '@/api/user'
import leaderDic from '@/config/leaderDic.js'

export default {
  name: 'related',
  data () {
    const validateNumber = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error('数值必须大于0'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字'))
      } else {
        if (value > 100) {
          callback(new Error('值不能超过100'))
        } else if (value < 0) {
          callback(new Error('数值必须大于0'))
        } else {
          callback()
        }
      }
    }
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
      scoreTemplateDic: [],
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
      showUpdateModal: false,
      department: this.$store.state.app.departmentDic,
      userId: '',
      userName: '',
      ruserid: '',
      position: leaderDic,
      height: window.innerHeight * 0.6,
      formItem: {
        mbid: '',
        xs: 1
      },
      ruleValidate: {
        mbid: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        xs: [
          { validator: validateNumber, trigger: 'blur' }
        ]
      },
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
          title: '评分人',
          key: 'pfr'
        },
        {
          title: '被评分人',
          key: 'rusername'
        },
        {
          title: '部门',
          key: 'rdepartment',
          render: (h, params) => {
            const row = params.row
            return h('div', this.department[row.rdepartment] || row.rdepartment)
          }
        },
        {
          title: '职位',
          key: 'rposition',
          render: (h, params) => {
            const row = params.row
            console.log(this.position)
            return h('div', this.position[row.rposition] || row.rposition)
          }
        },
        {
          title: '模板',
          key: 'mbid',
          render: (h, params) => {
            const row = params.row
            let mbmc = this.scoreTemplateDic.filter(fl => fl.mbid === row.mbid).map(mp => mp.mbmc)
            return h('div', mbmc[0])
          }
        },
        {
          title: '系数',
          key: 'xs'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showUpdateModal = true
                    this.ruserid = row.ruserid
                    this.formItem.mbid = row.mbid
                    this.formItem.xs = row.xs
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let para = {
                      pfrid: this.userId,
                      ruserid: row.ruserid
                    }
                    deleteUserRelation(para).then(res => {
                      if (res.code === 200) {
                        this.findUserList()
                        this.$Message.success('删除成功!')
                      }
                    })
                  }
                }
              }, '删除')
            ])
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
      that_.showAddNewTodo = true
      that_.findUserList()
    },
    findUserList () {
      let that_ = this
      let params = {
        pfrid: that_.userId
      }
      that_.detailLoading = true
      findUserRelation(params).then(res => {
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
        userid: that.userId,
        department: that.relatedQuery.department,
        status: '0'
      }
      that.noRelatedLoading = true
      findNoUser(params).then(res => {
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
          pfrid: that.userId,
          pfr: that.userName,
          ruserid: user.userId,
          rusername: user.userName,
          rdepartment: user.department,
          rposition: user.position
        }
      })
      createUserRelation(data).then(res => {
        if (res.code === 200) {
          that.findUserList()
          that.$Message.success('关联成功')
        }
      })
    },
    selectChange (selection) {
      this.selectDataStore = selection
    },
    cancelUpdate () {
      this.showUpdateModal = false
      this.formItem = {
        mbid: '',
        mbmc: '',
        xs: 1
      }
    },
    sureUpdate () {
      let that = this
      let params = {
        mbid: that.formItem.mbid,
        xs: that.formItem.xs,
        pfrid: that.userId,
        ruserid: that.ruserid
      }
      updateMbid(params).then(res => {
        if (res.code === 200) {
          that.$Message.success('保存成功')
          this.handleSearch()
          this.findUserList()
        }
      })
    },
    getSocreTemplate () {
      findScoreTemplateAll().then(res => {
        if (res.code === 200) {
          this.scoreTemplateDic = res.data
        }
      })
    }
  },
  mounted () {
    this.getSocreTemplate()
    this.handleSearch()
  }
}
</script>

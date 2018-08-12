<style lang="less">
  @import "../../assets/styles/common.less";
</style>
<template>
  <Row class="margin-top-10">
    <Card>
      <Row>
        <span @click="handleAdd" style="margin: 0;"><Button type="primary" icon="person-add">新增</Button></span>
      </Row>
      <Row class="margin-top-10">
        <Table :data="tableData" ref="table" :loading="loading" :columns="tableColumns" @on-row-dblclick="rowDblclick" stripe></Table>
        <Modal
          v-model="showAddNewTodo"
          title="添加"
          @on-ok="addNew"
          @on-cancel="cancelAdd">
          <Row>
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
              <FormItem label="开始日期" prop="startdate">
                <DatePicker v-model="formItem.startdate" type="date" placeholder="" style="width: 300px"></DatePicker>
              </FormItem>
              <FormItem label="结束日期" prop="enddate">
                <DatePicker v-model="formItem.enddate" type="date" placeholder="" style="width: 300px"></DatePicker>
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
import {findVersionAll, createVersion, updateVersion} from '@/api/version'

export default {
  data () {
    return {
      tableData: [],
      loading: false,
      showAddNewTodo: false,
      op: 'create',
      ruleValidate: {
        startdate: [
          { required: true, type: 'date', message: '不能为空', trigger: 'blur' }
        ],
        enddate: [
          { required: true, type: 'date', message: '不能为空', trigger: 'blur' }
        ]
      },
      tableColumns: [
        {
          title: '评分周期',
          key: 'versionid'
        },
        {
          title: '开始日期',
          key: 'startdate'
        },
        {
          title: '结束日期',
          key: 'enddate'
        }
      ],
      formItem: {
        versionid: '',
        startdate: '',
        enddate: ''
      },
      formItemCopy: {}
    }
  },
  methods: {
    handleSearch () {
      let that_ = this
      that_.loading = true
      findVersionAll().then(res => {
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
    addNew () {
      let that_ = this
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          let data = that_.formItem
          if (that_.op === 'create') {
            createVersion(data).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                that_.$Message.success('操作成功!')
              } else {
                that_.$Message.error(res.message)
              }
            }).catch(() => {
              that_.$Message.error('操作失败!')
            })
          } else if (that_.op === 'update') {
            updateVersion(data).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                that_.$Message.success('操作成功!')
              } else {
                that_.$Message.error(res.message)
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
      that_.formItem = {...index}
      that_.showAddNewTodo = true
    }
  },
  mounted () {
    this.formItemCopy = {...this.formItem}
    this.handleSearch()
  }
}
</script>

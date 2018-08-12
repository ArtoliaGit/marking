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
              <FormItem label="评价项" prop="zbmc">
                <Input v-model="formItem.zbmc" placeholder="" style="width: 300px;"></Input>
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
import {findScoreItem, createScoreItem, updateScoreItem} from '@/api/dic'

export default {
  data () {
    return {
      tableData: [],
      loading: false,
      showAddNewTodo: false,
      op: 'create',
      ruleValidate: {
        zbmc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      tableColumns: [
        {
          title: '指标代码',
          key: 'zbid'
        },
        {
          title: '指标名称',
          key: 'zbmc'
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
      formItem: {
        zbid: '',
        zbmc: '',
        status: true
      },
      formItemCopy: {}
    }
  },
  methods: {
    handleSearch () {
      let that_ = this
      that_.loading = true
      findScoreItem().then(res => {
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
          if (data.status === true) data.status = '0'
          else data.status = '1'
          if (that_.op === 'create') {
            createScoreItem(data).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                that_.$Message.success('操作成功!')
              }
            }).catch(() => {
              that_.$Message.error('操作失败!')
            })
          } else if (that_.op === 'update') {
            updateScoreItem(data).then(res => {
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
    }
  },
  mounted () {
    this.formItemCopy = {...this.formItem}
    this.handleSearch()
  }
}
</script>

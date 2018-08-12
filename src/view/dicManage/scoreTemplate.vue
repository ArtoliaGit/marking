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
          :title="title">
          <Row>
            <Form ref="formItem" :model="form" :label-width="80" :rules="ruleValidate">
              <FormItem label="模板名称" prop="mbmc">
                <Input v-model="form.mbmc" placeholder="" style="width: 300px;" :disabled="op === 'update'"></Input>
              </FormItem>
            </Form>
          </Row>
          <Row>
            <Table :data="relateIndexData" ref="relateTable" :loading="relateIndexLoading" :columns="relateIndexColumns" stripe></Table>
          </Row>
          <Row slot="footer">
            <Button type="text" @click="addNewIndex">添加指标</Button>
            <Button type="primary" @click="cancel">确定</Button>
          </Row>
        </Modal>
        <Modal
          v-model="indexModal"
          title="添加指标">
          <Row>
            <span @click="saveIndex" style="margin: 0;"><Button type="primary" icon="android-add">保存</Button></span>
          </Row>
          <Row class="margin-top-10">
            <Table :data="indexData" ref="editTable" :loading="indexLoading" :columns="indexColumns" @on-selection-change="selectChange" stripe></Table>
          </Row>
          <Row slot="footer"></Row>
        </Modal>
      </Row>
    </Card>
  </Row>
</template>

<script>
import canEditTable from '@/components/edit-table/canEditTable.vue'
import {findScoreTemplate, findScoreTemplateAll, deleteScoreTemplate, createScoreTemplate} from '@/api/user'
import {findScoreItem} from '@/api/dic'
export default {
  name: 'scoreTemplate',
  components: {
    canEditTable
  },
  data () {
    return {
      tableData: [],
      indexData: [],
      relateIndexData: [],
      selectDataStore: [],
      loading: false,
      relateIndexLoading: false,
      indexLoading: false,
      showAddNewTodo: false,
      indexModal: false,
      title: '新增',
      form: {
        mbmc: '',
        mbid: ''
      },
      op: 'create',
      ruleValidate: {
        mbmc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      tableColumns: [
        {
          key: 'mbmc',
          title: '模板名称'
        }
      ],
      relateIndexColumns: [
        {
          key: 'zbmc',
          title: '指标名称'
        },
        {
          key: 'zsbl',
          title: '折算比例(%)',
          render: (h, params) => {
            const row = params.row
            let that = this
            return h('Input', {
              props: {
                type: 'text',
                value: row.zsbl,
                number: true
              },
              on: {
                'on-change' (event) {
                  if (event.target.value > 100 || event.target.value < 0) {
                    that.$Message.error('输入值不能大于100或者小于0！')
                    return
                  }
                  that.relateIndexData[row._index].zsbl = event.target.value
                }
              }
            })
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
                    bmid: row.mbid,
                    zbid: row.zbid
                  }
                  deleteScoreTemplate(para).then(res => {
                    if (res.code === 200) {
                      this.getListData()
                      this.getRelateByMbid()
                      this.$Message.success('删除成功!')
                    }
                  })
                }
              }
            }, '删除')
          }
        }
      ],
      indexColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'zbmc',
          title: '指标名称'
        }
      ]
    }
  },
  methods: {
    handleAdd () {
      this.op = 'create'
      this.showAddNewTodo = true
      this.form.mbmc = ''
      this.relateIndexData = []
      this.form.mbid = ''
      this.title = '新增'
    },
    cancel () {
      let that = this
      let data = this.relateIndexData
      if (data.some(ev => !ev.zsbl || ev.zsbl === '')) {
        this.$Message.error('折算比例没有填写完成')
        return
      }
      createScoreTemplate(data).then(res => {
        if (res.code === 200) {
          that.$Message.success('保存成功!')
          this.getListData()
          this.showAddNewTodo = false
        }
      })
    },
    addNewIndex () {
      let that = this
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          that.indexModal = true
          findScoreItem({'status': '0'}).then(res => {
            if (res.code === 200) {
              that.indexData = res.data
            }
          })
        }
      })
    },
    saveIndex () {
      let that = this
      let relateList = this.relateIndexData.map(mp => mp.zbid)
      let data = this.selectDataStore
        .filter(fl => !relateList.includes(fl.zbid.toString()))
        .map(mb => {
          if (that.op === 'create') {
            return {
              zbid: mb.zbid.toString(),
              mbmc: that.form.mbmc,
              zbmc: mb.zbmc
            }
          } else {
            return {
              mbid: that.form.mbid,
              zbid: mb.zbid.toString(),
              mbmc: that.form.mbmc,
              zbmc: mb.zbmc
            }
          }
        })
      this.relateIndexData = this.relateIndexData.concat(data)
      this.$Message.success('添加成功')
    },
    getListData () {
      findScoreTemplateAll().then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    rowDblclick (index) {
      this.op = 'update'
      this.showAddNewTodo = true
      this.title = '修改'
      let params = {
        mbid: index.mbid
      }
      findScoreTemplate(params).then(res => {
        if (res.code === 200) {
          this.relateIndexData = res.data
          this.form.mbid = index.mbid
          this.form.mbmc = index.mbmc
        }
      })
    },
    getRelateByMbid () {
      let params = {
        mbid: this.form.mbid
      }
      findScoreTemplate(params).then(res => {
        if (res.code === 200) {
          this.relateIndexData = res.data
        }
      })
    },
    selectChange (selection) {
      this.selectDataStore = selection
    }
  },
  mounted () {
    this.getListData()
  }
}
</script>

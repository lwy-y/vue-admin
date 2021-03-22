<template>
  <div class="module-container" v-loading="loading">
    <!-- 筛选表单 -->
    <el-card class="mb24">
      <el-form :inline="true" :model="formSearch" class="demo-form-inline">
        <el-form-item label="设备类型">
          <el-select v-model="formSearch.type" placeholder="设备类型">
            <el-option v-for="row in bladeData" :key="row.bladeId" :value="row.bladeId" :label="row.bladeName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块型号">
          <el-input v-model="formSearch.model" placeholder="模块型号"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="formSearch.port" placeholder="端口号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选表单 over-->

    <el-card style="padding:24px" v-loading="card_loading">
      <el-collapse v-model="activeName" @change="collapseChange" accordion>
        <el-collapse-item v-for="(row) in bladeData" :key="row.bladeId" :title="row.bladeName" :name="row.bladeId">

          <!-- title start-->
          <template slot="title">
            <div style="font-size: 18px;font-weight: 600;">
              {{row.bladeName}}
            </div>
          </template>
          <!-- title end-->

          <!-- 折叠面板内容 start-->
          <div>
            <el-table @selection-change="selectChange" class="mb24" ref="table" :data="tableData" style="width: 100% ">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="设备类型" prop="equType">
                <template>
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column label="端口号" prop="mport">
              </el-table-column>
              <el-table-column label="模组型号" prop="mmodel">
              </el-table-column>
              <el-table-column label="SN号" prop="msn">
              </el-table-column>
              <el-table-column label="当前IP地址" prop="mip">
              </el-table-column>
              <el-table-column label="MAC地址" prop="mmac">
              </el-table-column>
              <el-table-column label="操作">
                <template slot="header" slot-scope="scope">
                  <el-button v-if="selectData.length&&selectData.length>1" type="primary" size="small"
                    @click="hanldAllSetting(scope.row)">
                    批量配置</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="hanldSetting(scope.row)">配置</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination v-if="total" class="mb24 pagiantion" background layout="prev, pager, next"
              :page-count="pageNum" :page-size="pageSize" :total="total" @current-change="pageCurrentChange">
            </el-pagination>
          </div>
          <!-- 折叠面板内容 end-->

        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog :title="((isMultiple ? '批量' : '') + '配置网络')" @close="dialogClose()" :visible.sync="visible" width="600px"
      append-to-body>

      <!-- 内层表单 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="IP" prop="ip">
          <el-row :gutter="isMultiple?12:0">
            <el-col :span="isMultiple?12:24">
              <el-input v-model="form.ip" @blur="ipBlur"></el-input>
            </el-col>
            <el-col v-if="isMultiple" :span="2" style="text-align:center">~</el-col>
            <el-col v-if="isMultiple" :span="6"><span>{{this.form.ipEnd}}</span></el-col>
          </el-row>

        </el-form-item>
        <el-form-item label="子网掩码" prop="subnetMask">
          <el-input v-model="form.subnetMask"></el-input>
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input v-model="form.gateway"></el-input>
        </el-form-item>
        <el-form-item label="DNS1" prop="dns1">
          <el-input v-model="form.dns1"></el-input>
        </el-form-item>
        <el-form-item label="DNS2" prop="dns2">
          <el-input v-model="form.dns2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内层表单 over-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取 消</el-button>
        <el-button type="primary" @click="handleButton('form')">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {
    mapGetters
  } from "vuex";

  import {
    showModule,
    showAllBlade,
    moduleConfig
  } from "@/api/module"

  export default {
    name: "serve",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      const DEFAULT_Form = {
        ip: '',
        ipEnd: '',
        subnetMask: '',
        gateway: '',
        dns1: '',
        dns2: '',
      }

      let form = Object.assign({
        ...DEFAULT_Form
      })

      var validateIP = (rule, val, callback) => {
        if (!this.isMultiple) {
          callback()
        } else {
          let arr = val.split('.')
          let ipstart = parseInt(arr[arr.length - 1])
          let len = this.selectData.length - 1
          if (ipstart + len > 255) {
            callback(new Error('部分ip地址格式错误'))
          } else {
            callback()
          }
        }
      }

      return {
        loading: false,
        card_loading: false,
        bladeData: [],
        formSearch: {
          type: '',
          model: '',
          port: ''
        },
        rules: {
          ip: [{
            required: true,
            whitespace: true,
            message: '请输入ip地址',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确ip地址格式",
            trigger: "blur",
          }, {
            validator: validateIP,
            trigger: 'blur'
          }],
          subnetMask: [{
            required: true,
            whitespace: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确子网掩码格式",
            trigger: "blur",
          }],
          gateway: [{
            required: true,
            whitespace: true,
            message: '请输入网关地址',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确网关格式",
            trigger: "blur",
          }],
          dns1: [{
            required: true,
            whitespace: true,
            message: '请输入DSN1',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确DSN地址格式",
            trigger: "blur",
          }],
          dns2: [{
            required: true,
            whitespace: true,
            message: '请输入DSN2',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确DSN地址格式",
            trigger: "blur",
          }],
        },
        pageNum: 1,
        pageSize: 10,
        total: 0,
        activeName: '',
        tableData: [],
        selectData: [],
        selectRow: {},
        visible: false,
        isMultiple: false,
        DEFAULT_Form,
        form,
      }
    },
    created() {
      this.showAllBlade()
    },
    methods: {
      // 获取全部刀片
      showAllBlade() {
        this.loading = true
        showAllBlade().then(res => {
          if (res && res.retCode === 200) {
            this.bladeData = res.data
            this.formSearch.type = res.data[0].bladeId
            this.loading = false
            this.showModule()
          }
        })
      },
      // 获取模块
      showModule() {
        let data = Object.assign({
          bladeId: this.formSearch.type,
          mmodel: this.formSearch.model || null,
          mport: this.formSearch.port || null,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.card_loading = true
        showModule(data).then(res => {
          if (res && res.retCode === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
            this.activeName = this.formSearch.type
            this.card_loading = false
          }
        })
      },
      // 折叠面板
      collapseChange(val) {
        console.log(val)
        if (val && val !== this.formSearch.type) {
          this.formSearch.model = ''
          this.formSearch.port = ''
          this.formSearch.type = val
          this.tableData = []
          this.pageNum = 1
          this.pageSize = 10
          this.total = 0
          this.showModule()
        }
      },
      // 列表筛选
      searchSubmit() {
        this.showModule()
      },
      // 页码跳转
      pageCurrentChange(val) {
        this.pageNum = val
        this.showModule()
      },
      selectChange(val) {
        this.selectData = val
        // console.log(this.selectData)
      },
      // 点击批量配置
      hanldAllSetting() {
        this.isMultiple = true
        this.visible = true
      },
      // 点击配置
      hanldSetting(row) {
        this.isMultiple = false
        this.selectRow = row
        this.visible = true
      },
      ipBlur(e) {
        if (!this.isMultiple) {
          return false
        } else {
          console.log(1)
          this.$refs['form'].validateField('ip', valid => {
            console.log(3)
            console.log(valid)
            if (!valid) {
              console.log(2)
              let arr = e.target.value.split('.')
              let ipstart = parseInt(arr[arr.length - 1])
              let len = this.selectData.length - 1
              let ipEnd = ipstart + len
              arr[arr.length - 1] = ipEnd
              this.form.ipEnd = arr.join('.')
            } else {
              this.form.ipEnd = ''
            }
          })
        }
      },
      // 提交表单
      handleButton(formName) {
        let data = {}
        this.$refs[formName].validate((valid) => {
          if (valid) {
            data = Object.assign({}, this.form)
            if (this.isMultiple) {
              data.id = this.selectData.map(item => item.mid).join(',')
            } else {
              data.id = this.selectRow.mid
            }
            data.ipEnd = data.ipEnd || null
            moduleConfig(data).then(res => {
              if (res && res.retCode === 200) {
                this.$message({
                  message: '模块网络配置成功',
                  type: 'success'
                })
              }
              this.visible = false
              this.showModule()
            })
          }
        })
      },

      dialogClose() {
        this.$refs['form'].resetFields()
        this.form = Object.assign({}, {
          ...this.DEFAULT_Form
        })

      },
    }

  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .module {
    &-container {
      margin: 30px;

      .el-table__expanded-cell[class*=cell] {
        padding: 0 0px 0 47px;
      }
    }
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>

<style lang="scss">
  .module {
    &-container {
      margin: 30px;

      .el-table__expanded-cell[class*=cell] {
        padding: 0 0px 0 48px;
      }
    }
  }

</style>

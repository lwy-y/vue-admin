<template>
  <div class="serve-container">
    <el-card class="mb24">
      <div slot="header">
        <span>服务器网络配置信息</span>
        <el-button style="float: right; margin-top: -10px" type="primary" @click="getInternet()">刷新</el-button>
      </div>
      <div v-loading="loading">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="intName" label="名称">
          </el-table-column>
          <el-table-column prop="ip" label="地址">
          </el-table-column>
          <el-table-column prop="intId" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="configButton(scope.row)">配置</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>

      <!-- 外层弹窗 -->
      <el-dialog @close="radio=''" title="模式选择" :visible.sync="outerVisible" width="400px">
        <el-radio-group v-model="radio">
          <el-radio :label="1">配置静态IP</el-radio>
          <el-radio :label="0">配置DHCP</el-radio>
        </el-radio-group>

        <!-- 内层弹窗 -->
        <el-dialog title="配置交换机" @close="innerDialogClose()" :visible.sync="innerVisible" width="600px" append-to-body>

          <!-- 内层表单 -->
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="IP" prop="ip">
              <el-input v-model="form.ip"></el-input>
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
            <el-button @click="innerVisible = false;outerVisible = false">取 消</el-button>
            <el-button type="primary" @click="innerButton('form')">确定</el-button>
          </div>
        </el-dialog>
        <!-- 内层弹窗 over-->

        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="outerButton()">确定</el-button>
        </div>
      </el-dialog>
      <!-- 外层弹窗 over-->

    </el-card>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";

  import {
    getInternet,
    setInternet
  } from "@/api/network"

  export default {
    name: "serve",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      const formRawData = {
        ip: '',
        subnetMask: '',
        gateway: '',
        dns1: '',
        dns2: '',
      }
      let form = Object.assign({}, {
        ...formRawData
      })
      return {
        loading: false,
        tableData: [],
        rowData: {},
        radio: '',
        outerVisible: false,
        innerVisible: false,
        formRawData,
        form,
        rules: {
          ip: [{
            required: true,
            message: '请输入ip',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确ip地址格式",
            trigger: "blur",
          }],
          subnetMask: [{
            required: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确子网掩码格式",
            trigger: "blur",
          }],
          gateway: [{
            required: true,
            message: '请输入网关',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确网关格式",
            trigger: "blur",
          }],
          dns1: [{
            required: true,
            message: '请输入DNS1',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确iDNS格式",
            trigger: "blur",
          }],
          dns2: [{
            required: true,
            message: '请输入DNS2',
            trigger: 'blur'
          }, {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确DNS格式",
            trigger: "blur",
          }],
        },
      };
    },
    created() {
      this.getInternet()
    },
    methods: {
      getInternet() {
        this.loading = true
        getInternet().then(res => {
          if (res && res.retCode === 200) {
            console.log(res)
            this.tableData = res.data
            console.log(this.tableData)
            this.loading = false
          }
        })

      },
      configButton(data) {
        console.log(data)
        this.rowData = {
          ...data
        }
        this.outerVisible = true
      },
      // 外层弹框确定按钮
      outerButton() {
        if (this.radio) {
          this.innerVisible = true
        } else {
          let obj = {
            id: this.rowData.intId,
            intStatus: 0
          }
          setInternet(obj).then(res => {
            if (res && res.retCode === 200) {
              this.$message({
                type: 'success',
                message: '配置成功'
              })
              this.outerVisible = false
              this.getInternet()
            }
          })
        }
      },
      innerButton(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = Object.assign(this.form, {
              id: this.rowData.intId,
              intStatus: 1,
            })
            setInternet(data).then(res => {
              if (res && res.retCode === 200) {
                this.$message({
                  type: 'success',
                  message: '配置成功'
                })
                this.innerVisible = false
                this.getInternet()
              }
            })
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
      },
      innerDialogClose() {
        this.outerVisible = false
        this.$refs['form'].resetFields()
        this.form = Object.assign({}, {
          ...this.formRawData
        })
      },
    },
  };

</script>

<style lang="scss" scoped>
  @import "@/styles/comment.scss";

  .serve {
    &-container {
      margin: 30px;
    }

  }

</style>

<template>
  <div class="fan-container">
    <el-card v-loading="loading">
      <div slot="header">
        <span>服务器风扇设置</span>
        <el-button @click="outerVisible=true" style="float: right; margin-top: -10px" type="primary">配置转数</el-button>
      </div>
      <div>
        <el-table :data="allData" style="width: 100%" class="mb24">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="equipment" label="设备">
          </el-table-column>
          <el-table-column prop="setting" label="设置方式">
            <template slot-scope="props">
              <span>{{props.row.setting?"自动设置":"手动设置"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nowSpeed" label="当前转数">
            <!-- <span>{{allData.nowSpeed}}</span> -->
          </el-table-column>
          <el-table-column prop="nowPercentage" label="当前百分比">
            <template slot-scope="props">
              <span>{{props.row.nowPercentage?props.row.nowPercentage+'%':''}}</span>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 外层弹窗 -->
      <el-dialog @close="modelSelect=''" title="模式选择" top="36vh" :visible.sync="outerVisible" width="400px">
        <el-select style="width:100%" v-model="modelSelect" placeholder="请选择">
          <el-option label="手动设置" :value="1">
          </el-option>
          <el-option label="自动设置" :value="2">
          </el-option>
        </el-select>

        <!-- 内层弹窗 -->
        <el-dialog title="配置交换机" top="24vh" @close="innerDialogClose()" :visible.sync="innerVisible" width="600px"
          append-to-body>

          <!-- 内层表单 -->
          <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="设备">
              服务器风扇
            </el-form-item>
            <el-form-item label="当前转数">
              {{allData[0]?allData[0].nowPercentage:0 + '%'}}
            </el-form-item>
            <el-form-item label="转数调整为" prop="percentage">
              <el-input-number style="margin-right:8px" v-model="formData.percentage" :min="1" :max="100" label="%">
              </el-input-number>%
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
          <el-button v-show="modelSelect" type="primary" @click="outerButton()">确定</el-button>
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
    fanShow,
    modifyFan
  } from "@/api/fan";
  export default {
    name: "Dashboard",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      const formRawData = {
        percentage: 100
      }
      let formData = Object.assign({}, {
        ...formRawData
      })
      return {
        loading: false,
        allData: [],
        outerVisible: false,
        innerVisible: false,
        modelSelect: '',
        formRawData,
        formData,
        rules: {
          percentage: [{
            required: true,
            message: '请调整转数',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.fanShow()
    },
    methods: {
      fanShow() {
        this.loading = true
        fanShow().then(res => {
          if (res && res.retCode === 200) {
            this.allData = res.data
            this.loading = false
          }
        })
      },
      handleClick(row) {
        console.log(row)
      },
      outerButton() {
        if (this.modelSelect === 1) {
          this.formData.percentage = this.allData[0].nowPercentage
          this.innerVisible = true
        } else {
          let data = {
            setting: 1
          }
          modifyFan(data).then(res => {
            if (res && res.retCode === 200) {
              this.$alert('服务器风扇已经设置为自动控制模式，系统会根据模块CUP温度自动调整风扇转速。', '设置成功', {
                confirmButtonText: '确定',
                callback: action => {
                  this.outerVisible = false
                  this.fanShow()
                }
              })
            }
          })


        }
      },
      innerButton(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = Object.assign({
              nowPercentage: this.formData.percentage,
              nowSpeed: this.allData[0].nowPercentage,
              setting: 0
            })
            modifyFan(data).then(res => {
              if (res && res.retCode === 200) {
                this.$alert(`风扇设置成功! 当前转速调整为${this.formData.percentage}%。`, '设置成功', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.innerVisible = false
                    this.fanShow()
                  }
                })
              }
            })
          } else {
            return false;
          }
        });
      },
      innerDialogClose() {
        this.outerVisible = false
        this.$refs['form'].resetFields()
        this.formData = Object.assign({}, {
          ...this.formRawData
        })
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .fan {
    &-container {
      margin: 30px;
    }
  }

</style>

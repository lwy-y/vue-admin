<template>
  <div class="power-container">
    <el-card v-loading="loading">
      <div slot="header">
        <div>电源设置</div>
      </div>
      <div>
        <el-form :model="detailForm" label-width="120px">
          <el-form-item label="刀片机设备">{{detailForm.bladeName}}</el-form-item>
          <el-form-item label="模块">{{detailForm.mmodel}}</el-form-item>
          <el-form-item label="SN号">{{detailForm.msn}}</el-form-item>
          <el-form-item label="当前状态">
            <div style="display: flex; align-items: center">
              <div :class="['light',detailForm.psStatus ?'red':'green'].join(' ')"></div>
              <div>{{detailForm.psStatus ?'已断电':'供电中'}}</div>
            </div>
          </el-form-item>
        </el-form>
        <el-card class="mb24">
          <div slot="供电设置"></div>
          <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="供电状态修改" prop="psStatus">
                <el-radio-group v-model="form.psStatus">
                  <el-radio :label="0">上电</el-radio>
                  <el-radio :label="1">下电</el-radio>
                  <el-radio :label="2">重启</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleClick('form')">确定</el-button>
                <el-button type="primary" @click="handleCancel('form')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    moduleChangePs,
    getModuleById
  } from '@/api/module'

  export default {
    data() {
      console.log(this.$route.query, this.$route.params)
      const detailForm = {
        ...this.$route.query
      }
      const mid = this.$route.params.id
      return {
        loading: true,
        mid,
        detailForm,
        form: {
          psStatus: null,
        },
        rules: {
          psStatus: [{
            required: true,
            message: '请选择电源状态',
          }]
        }
      }
    },
    created() {
      if (!this.mid) {
        this.$router.go(-1)
      } else {
        this.getModuleById()
      }
    },
    methods: {
      getModuleById() {
        this.loading = true
        let data = {
          Mid: parseInt(this.mid)
        }
        // let data = this.mid
        getModuleById(data).then(res => {
          if (res && res.retCode === 200) {
            this.detailForm = Object.assign(
              this.detailForm, res.data
            )
            this.loading = false
            console.log(this.detailForm)
          }
        })
      },
      handleCancel(form) {
        this.form = {
          psStatus: null,
        }
        this.$refs[form].resetFields()
      },
      handleClick(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.loading = true
            let data = {
              mid: this.mid,
              ...this.form
            }
            moduleChangePs(data).then(res => {
              if (res && res.retCode === 200) {
                this.$message({
                  message: '模块电源状态修改成功',
                  type: 'success'
                })
                this.form = {
                  psStatus: null,
                }
                this.$refs[form].resetFields()
                this.getModuleById()
              }
            })
          }
        })
      },
    }

  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .power {
    &-container {
      margin: 30px;
    }
  }

</style>

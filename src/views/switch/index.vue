<template>
  <div class="switch-container">
    <el-card>
      <div slot="header">
        <span>VLAN</span>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" class="mb24">
          <el-table-column prop="bladeName" label="设备">
          </el-table-column>
          <el-table-column prop="bladeModel" label="设备型号">
          </el-table-column>
          <el-table-column prop="bladeIp" label="当前IP">
          </el-table-column>
          <el-table-column prop="bladeId" label="网络设置">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="primary" size="small">命令行</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";

  import {
    showAllBlade,
  } from "@/api/module"

  export default {
    name: "SwitchSetting",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      return {
        tableData: []
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
            this.tableData = res.data
          }
        })
      },
      handleClick(row) {
        console.log(row)
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .switch {
    &-container {
      margin: 30px;
    }
  }

</style>

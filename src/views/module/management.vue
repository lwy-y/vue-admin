<template>
  <div class="management-container" v-loading="loading">
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

    <el-card style="padding:24px">
      <el-collapse v-model="activeName" @change="collapseChange" accordion>
        <el-collapse-item v-for="(row) in bladeData" :key="row.bladeId" :title="row.bladeName" :name="row.bladeId">
          <template slot="title">
            <div style="font-size: 18px;font-weight: 600;">
              {{row.bladeName}}
            </div>
          </template>
          <div>
            <el-table v-loading="card_loading" class="mb24" ref="table" :data="tableData" style="width: 100% ">
              <!-- <el-table-column label="设备类型" prop="equType">
              <template>
                <span></span>
              </template>
            </el-table-column> -->
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
              <el-table-column label="操作" width="300px">
                <template slot-scope="prop">
                  <el-button type="primary" size="small" @click="$router.push({
                    path:`/module/information/${prop.row.mid}`,
                    query:{
                      bladeId:row.bladeId,
                      bladeName:row.bladeName,
                      ...prop.row
                    }
                    })">运行信息</el-button>
                  <el-button type="primary" size="small" @click="$router.push({path:'/module/control'})">命令行
                  </el-button>
                  <el-button type="primary" size="small" @click="$router.push({
                    path:`/module/powerSettings/${prop.row.mid}`,
                    query:{
                      bladeId:row.bladeId,
                      bladeName:row.bladeName,
                    }
                    })">
                    电源配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination v-if="total" class="mb24 pagiantion" background layout="prev, pager, next"
              :page-count="pageNum" :page-size="pageSize" :total="total" @current-change="pageCurrentChange">
            </el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

  </div>

</template>

<script>
  import {
    mapGetters
  } from "vuex";

  import {
    showModule,
    showAllBlade,
  } from "@/api/module"

  export default {
    name: "serve",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      return {
        loading: false,
        card_loading: false,
        formSearch: {
          type: '',
          model: '',
          port: ''
        },
        activeName: '',
        bladeData: [],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    created() {
      this.showAllBlade()
    },

    methods: {
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
      searchSubmit() {
        this.showModule()
      },
      // 页码跳转
      pageCurrentChange(val) {
        this.pageNum = val
        this.showModule()
      },
      // 折叠面板
      collapseChange(val) {
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
    }
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .management {
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

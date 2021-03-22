<template>
  <div class="messageW-container">
    <!-- 筛选表单 -->
    <el-card class="mb24">
      <el-form :inline="true" ref="formSearch" :model="formSearch" class="demo-form-inline">
        <el-col :span="5" class="minW3">
          <el-form-item label="设备编号">
            <el-input v-model="formSearch.equNum" placeholder="设备编号"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="5" class="minW3">
          <el-form-item label="设备位置">
            <el-input v-model="formSearch.equlocation" placeholder="设备位置"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="minW3">
          <el-form-item label="告警原因">
            <el-select v-model="formSearch.alarmReason">
              <el-option value="CPU使用率告警"></el-option>
              <el-option value="内存告警"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="minW3">
          <el-form-item label="告警时间">
            <el-date-picker v-model="formSearch.alarmTime" type="datetimerange" range-separator="~"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="minW3">
          <el-form-item>
            <el-button type="primary" @click="searchSubmit('formSearch')">搜索</el-button>
            <el-button type="primary" @click="resetFormSearch('formSearch')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <!-- 筛选表单 over-->

    <el-card>
      <el-table :data="tableData" style="width: 100%" class="mb24">
        <el-table-column label="设备编号" prop="caveatNo">
        </el-table-column>
        <el-table-column label="所属机柜" prop="belongCabinet">
        </el-table-column>
        <el-table-column label="所属BMC" prop="belongBmc">
        </el-table-column>
        <el-table-column label="端口号" prop="port">
        </el-table-column>
        <el-table-column label="IP地址" prop="ip">
        </el-table-column>
        <el-table-column label="MAC地址" prop="mac">
        </el-table-column>
        <el-table-column label="告警原因" prop="reason">
          <!-- <template slot-scope="prop">
            <span>{{convertData(prop.row,"alarmReason")}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="告警级别" prop="alert">
          <template slot-scope="prop">
            <span>{{convertData(prop.row,"alert")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="告警值" prop="alertVal">
          <!-- <template slot-scope="prop">
            <span>{{prop.row.alarmValue+'%'}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="告警时间" prop="alertTime">
          <template slot-scope="prop">
            <div>
              {{{value:prop.row.alertTime,format:"YYYY-MM-DD HH:mm:ss"} | formatDate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="equId">
          <template slot-scope="prop">
            <el-button size="small" @click="viewDevices(prop.row)">查看设备</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mb24 pagiantion" background layout="prev, pager, next" :page-count="pageNum"
        :page-size="pageSize" :total="total" @current-change="pageCurrentChange">
      </el-pagination>
    </el-card>

  </div>

</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import moment from 'moment'
  import {
    caveatShow
  } from '@/api/news.js'

  export default {
    name: "serve",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      const formRawSearch = {
        equNum: "",
        equlocation: "",
        alarmReason: "",
        alarmTime: "",
      }
      let formSearch = Object.assign({}, {
        ...formRawSearch
      })
      return {
        formRawSearch,
        formSearch,
        caveatDTO: {},
        pageSize: 10,
        pageNum: 1,
        total: 0,
        tableData: [{
          equId: 1,
          equNum: "CRIUS0119483004",
          cabinet: "机柜名称",
          BMC: "服务器名称",
          port: "1234",
          IP: "100.168.2.100",
          MAC: "00-00-00-00-00-00-00-E0",
          alarmReason: 0,
          alarmlevel: 0,
          alarmValue: 80,
          alarmTime: "2021-01-20 13:00:00"
        }, ]
      }
    },
    created() {
      this.caveatShow()
    },
    methods: {
      caveatShow() {
        let data = Object.assign({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }, this.caveatDTO)
        caveatShow(data).then(res => {
          if (res && res.retCode === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
          }
        })
      },

      /**
       * 数据转换
       * data: 当行数据， parmas: 需要转换的参数名
       */
      convertData(data, parmas = String) {
        const obj = {
          alarmReason: {
            0: "CPU使用率告警",
            1: "内存告警",
          },
          alert: {
            1: "严重",
          },
        };
        return obj[parmas][data[parmas]];
      },
      /**
       * 搜索
       */
      searchSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = this.formSearch
            this.caveatDTO = {
              alertEndTime: form.alarmTime ? moment(form.alarmTime[1]).format(
                'yyyy-MM-DD HH:mm:ss') : null,
              alertStartTime: form.alarmTime ? moment(form.alarmTime[0]).format(
                'yyyy-MM-DD HH:mm:ss') : null,
              belongBmc: form.equlocation || null,
              caveatNo: form.equNum || null,
              reason: form.alarmReason || null,
            }
            this.caveatShow()
          }
        })
        // this.caveatDTO
      },
      /**
       * 重置表单
       */
      resetFormSearch(formName) {
        this.$refs[formName].resetFields()
        this.formSearch = Object.assign({}, {
          ...this.formRawSearch
        })
        this.caveatDTO = {}
        this.caveatShow()
      },
      /**
       * 页码切换
       */
      pageCurrentChange(val) {
        this.pageNum = val
        this.caveatShow()
      },
      /**
       * 查看设备
       */
      viewDevices(data) {

      },
    }
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .module {
    &-container {
      margin: 30px;
    }
  }

</style>

<style lang="scss">
  .messageW {
    &-container {
      margin: 30px;
    }
  }

</style>

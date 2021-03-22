<template>
  <div class="information-container">
    <el-card v-loading="loading">
      <div slot="header">
        <div>运行信息</div>
      </div>
      <div class="mb24">

        <!-- 头部信息 start -->
        <el-form :inline="true" :model="mdata" class="demo-form-inline">
          <el-row gutter="12">
            <el-col :span="6">
              <el-form-item label="所属容器">
                容器1
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属刀片服务器">
                {{mdata.bladeName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块型号">
                {{mdata.mmodel}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="端口号">
                {{mdata.mport}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="当前IP地址">
                {{mdata.mip}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SN号">
                {{mdata.msn}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="MAC地址">
                {{mdata.mmac}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="CUP架构">
                armeabi-v7a
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ROM版本">
                V1.1.1
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 头部信息 end -->
        <el-divider></el-divider>
        <el-row gutter="24" style="padding-top:24px">
          <el-col :span="8" style="min-width:450px">
            <el-col :span="12" style="text-align:center">
              <el-col :span="12" class="mb24">
                <div class="mb8">CPU核数</div>
                <div style="color:#409eff">6</div>
              </el-col>
              <el-col :span="12" class="mb24">
                <div class="mb8">最高频率</div>
                <div style="color:#409eff">1.8GHz</div>
              </el-col>
              <el-col :span="12" class="mb24">
                <div class="mb8">内存总量</div>
                <div style="color:#409eff">3.75GB</div>
              </el-col>
              <el-col :span="12" class="mb24">
                <div class="mb8">磁盘总量</div>
                <div style="color:#409eff">5.75GiB</div>
              </el-col>
              <el-col :span="12" class="mb24">
                <div class="mb8">温度</div>
                <div style="color:#409eff">36.9℃</div>
              </el-col>
              <el-col :span="12" class="mb24">
                <div class="mb8">运行时间</div>
                <div style="color:#409eff">5.71小时</div>
              </el-col>

            </el-col>
            <el-col :span="12">
              <div class="mb24">
                CPU使用率
                <el-progress :stroke-width="18" color="#67c23a" :percentage="30"></el-progress>
              </div>
              <div class="mb24">
                内存使用率
                <el-progress :stroke-width="18" color="#67c23a" :percentage="30"></el-progress>
              </div>
              <div class="mb24">
                磁盘使用率
                <el-progress :stroke-width="18" color="#67c23a" :percentage="30"></el-progress>
              </div>
            </el-col>
          </el-col>
          <el-col :span="8" style="min-width:450px">
            <div class="title-center">CPU使用率</div>
            <ve-line :legend="lineLegend" :grid="lineGrid" :extend="cpu_chartExtend" :data="cpu_chartData"></ve-line>
          </el-col>
          <el-col :span="8" style="min-width:450px">
            <div class="title-center">内存信息</div>
            <ve-line :legend="lineLegend" :grid="lineGrid" :extend="cpu_chartExtend" :data="cpu_chartData"></ve-line>
          </el-col>
          <el-col :span="8" style="min-width:450px">
            <div class="title-center">系统平均负载</div>
            <ve-line :legend="lineLegend" :grid="lineGrid" :extend="cpu_chartExtend" :data="cpu_chartData"></ve-line>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>1分钟平均负载</div>
              <div>10.78%</div>
            </div>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>5分钟平均负载</div>
              <div>10.78%</div>
            </div>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>10分钟平均负载</div>
              <div>10.78%</div>
            </div>

          </el-col>
          <el-col :span="8" style="min-width:450px">
            <div class="title-center">磁盘使用率</div>
            <ve-line :legend="lineLegend" :grid="lineGrid" :extend="cpu_chartExtend" :data="cpu_chartData"></ve-line>
            <div style="display:flex;justify-content: space-around;padding:8px">
              <div>合计</div>
              <div>
                19.12%
              </div>
              <div>
                16.12%
              </div>
              <div>
                16.12%
              </div>
            </div>

          </el-col>
          <el-col :span="8" style="min-width:450px">
            <div class="title-center">硬件温度</div>
            <ve-line :legend="lineLegend" :grid="lineGrid" :extend="cpu_chartExtend" :data="cpu_chartData"></ve-line>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>合计</div>
              <div>3.75 GiB</div>
            </div>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>可用</div>
              <div>3.73 GiB</div>
            </div>
            <div style="display:flex;justify-content: space-between;padding:8px">
              <div>已用</div>
              <div>640.25 GiB</div>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
  // import {
  //   moduleChangePs,
  //   getModuleById
  // } from '@/api/module'

  export default {
    data() {
      console.log(this.$route.query, this.$route.params)
      const mid = this.$route.params.id
      const mdata = this.$route.query
      const columns = ['time', mdata.mmodel]
      let cpuRow = {}
      cpuRow[mdata.mmodel] = 30
      const cpuRows = [{
        time: '00:30',
        ...cpuRow
      }, {
        time: '01:30',
        ...cpuRow
      }, {
        time: '02:30',
        ...cpuRow
      }, {
        time: '03:30',
        ...cpuRow
      }, {
        time: '04:30',
        ...cpuRow
      }, {
        time: '05:30',
        ...cpuRow
      }, {
        time: '06:30',
        ...cpuRow
      }, {
        time: '07:30',
        ...cpuRow
      }, {
        time: '08:30',
        ...cpuRow
      }, {
        time: '09:30',
        ...cpuRow
      }, {
        time: '10:30',
        ...cpuRow
      }, ]
      return {
        loading: true,
        mid,
        mdata,
        lineLegend: {
          bottom: 20,
        },
        lineGrid: {
          right: 40,
        },
        cpu_chartExtend: {
          series: {
            markLine: {
              // data: [{
              //   yAxis: 0,
              //   lineStyle: {
              //     color: "red"
              //   },
              // }, ],
            },
          },
          yAxis: {
            // 纵坐标网格线设置，同理横坐标
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#ccc",
              },
            },
          },
        },
        cpu_chartData: {
          columns,
          rows: cpuRows,
        },
      }
    },
    created() {
      if (!this.mid) {
        this.$router.go(-1)
      } else {
        // this.getModuleById()
        this.loading = false
      }
    },
    methods: {

    }

  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .information {
    &-container {
      margin: 30px;
    }
  }

</style>

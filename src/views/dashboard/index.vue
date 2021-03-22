<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-card style="margin-bottom: 24px">
      <div slot="header">
        <span>服务器信息</span>
        <!-- <el-button
          style="float: right; margin-left: 16px; margin-top: -10px"
          type="primary"
          >搜索</el-button
        > -->
        <el-button style="float: right; margin-top: -10px" type="primary" @click="refresh()">刷新</el-button>
      </div>
      <div v-loading="loading_server">
        <el-form :model="serverData" label-width="180px">
          <el-form-item label="设备型号">
            {{serverData.sysModel}}
          </el-form-item>
          <el-form-item label="SN号">
            {{serverData.sysNo}}
          </el-form-item>
          <el-form-item label="BMC当前MAC地址">
            {{serverData.sysMac}}
          </el-form-item>
          <el-form-item label="BMC当前IP地址">
            {{serverData.sysIp}}
          </el-form-item>
          <!-- <el-form-item label="服务器风扇状态">
            <div style="display: flex; align-items: center">
              <div :class="['light',form.serverFanStatus?'red':'green'].join(' ')"></div>
              <div>{{serverData.serverFanStatus?"异常":"正常"}}</div>
            </div>
          </el-form-item> -->
          <el-form-item label="系统运行时间">
            {{bootTime}}
          </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" label-width="180px">
          <el-divider></el-divider>
          <el-form-item label="服务器电源控制" prop="serverPsC">
            <el-switch class="serverPsC" @change="(val)=>changePsC(val)" v-model="form.serverPsC" active-color="green"
              inactive-color="red" :active-value="0" :inactive-value="1" :active-text="form.serverPsC ? 'OFF' : 'NO'">
            </el-switch>
          </el-form-item>
          <el-form-item label="服务器电源1" prop="ps1Caveat">
            <el-col :span="11">
              <div style="display: flex; align-items: center">
                <div :class="['light',form.serverPs1?'red':'green'].join(' ')"></div>
                <div>{{form.serverPs1?'0V':'220V'}}</div>
              </div>
            </el-col>
            <el-col :span="11">
              <el-switch class="serverPsC" @change="(val)=>changeCaveat(val,'ps1Caveat')" v-model="form.ps1Caveat"
                active-color="green" inactive-color="red" :active-value="0" :inactive-value="1"
                :disabled="form.serverPs1?true:false" :active-text="form.ps1Caveat ? '报警关闭' :'报警开启' ">
              </el-switch>
            </el-col>
          </el-form-item>
          <el-form-item label="服务器电源2" prop="ps1Caveat">
            <el-col :span="11">
              <div style="display: flex; align-items: center">
                <div :class="['light',form.serverPs2?'red':'green'].join(' ')"></div>
                <div>{{form.serverPs2?'0V':'220V'}}</div>
              </div>
            </el-col>
            <el-col :span="11">
              <el-switch class="serverPsC" @change="(val)=>changeCaveat(val,'ps2Caveat')" v-model=" form.ps2Caveat"
                active-color="green" inactive-color="red" :active-value="0" :inactive-value="1"
                :disabled="form.serverPs2?true:false" :active-text="form.ps2Caveat ?'报警关闭' :'报警开启' ">
              </el-switch>
            </el-col>
          </el-form-item>
        </el-form>
        <!-- <el-switch v-model="form.delivery"></el-switch> -->
      </div>
    </el-card>

    <div v-for="(row,index) in bladeData" :key="index" class="card mb24">
      <div class="header" @click="changeBladeVisible(index)">{{"刀片"+ row.bladeId}}</div>
      <div :class="bladeData[index].isblock ? 'content' : 'close'">
        <el-form :model="form" label-width="180px">
          <el-form-item label="设备型号">{{row.bladeModel}}</el-form-item>
          <el-form-item label="SN号">{{row.bladeSn}}</el-form-item>
          <el-form-item label="MAC地址">{{row.bladeMac}}</el-form-item>
          <el-form-item label="刀片运行状态">{{row.bladeStatus?'异常':'正常'}} </el-form-item>
          <el-form-item label="软件版本号">{{row.bladeVersion}}</el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";

  import {
    systemShow,
    changePsC,
    changeCaveat,
  } from "@/api/system"

  import moment from 'moment'

  // export default {
  //   name: "Dashboard",
  //   computed: {
  //     ...mapGetters(["name"]),
  //   },
  // };

  export default {
    name: "Dashboard",
    computed: {
      ...mapGetters(["name"]),
    },
    data() {
      return {
        loading: true,
        loading_server: false,
        form: {
          serverPsC: 0,
          ps1Caveat: 0,
          ps2Caveat: 0,
        },
        serverData: {},
        modulesData: [],
        bladeData: [{
          isblock: false
        }],
        timer: null,
        bootTime: null
      };
    },
    created() {
      this.systemShow()
    },
    destroyed: function () {
      // 每次离开当前界面时，清除定时器
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      // 系统信息
      systemShow() {
        clearInterval(this.timer)
        this.timer = null
        systemShow().then(res => {
          if (res.retCode && res.retCode === 200) {
            this.serverData = res.data.system
            this.form = Object.assign(this.form, res.data.system)
            this.form.ps1Caveat = this.form.serverPs1 ? 1 : this.form.ps1Caveat
            this.form.ps2Caveat = this.form.serverPs2 ? 1 : this.form.ps2Caveat
            if (res.data.system.serverPsC === 0) {
              this.getBootTime()
            } else {
              this.bootTime = null
            }
            this.bladeData = res.data.blades.map(item => {
              return {
                ...item,
                isblock: true
              }
            })
            this.loading = false
          }
        })
      },
      getBootTime() {
        this.timer = setInterval(() => {
          var nowTime = moment()
          var startTime = moment(this.form.bootTime)
          // console.log(moment(nowTime.diff(startTime, 's')).get('s'))
          var s = moment(nowTime.diff(startTime, 's'))
          console.log(s)
          var t;
          if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            console.log(hour, min, sec)
            if (hour < 10) {
              t = '0' + hour + ":";
            } else {
              t = hour + ":";
            }

            if (min < 10) {
              t += "0";
            }
            t += min + ":";
            if (sec < 10) {
              t += "0";
            }
            t += sec;
          }
          console.log(t)
          this.bootTime = t
          // this.bootTime = nowTime.diff(startTime, 's') < 60 ? nowTime.diff(startTime, 's') + '秒':nowTime.diff(startTime, 's') < 60 ?
        }, 1000)

      },
      // 刷新
      refresh() {
        this.loading = true
        this.systemShow()
      },
      // 电源控制
      changePsC(val) {
        console.log(val)
        this.loading_server = true
        changePsC().then(res => {
          if (res && res.retCode === 200) {
            this.$message({
              message: '电源状态修改成功',
              type: 'success'
            })
            this.systemShow()
          } else {
            this.form.serverPsC = val ? 0 : 1
          }
          this.loading_server = false
        })
      },
      changeCaveat(val, row) {
        let {
          ps1Caveat,
          ps2Caveat
        } = this.serverData
        let data = {
          ps1Caveat,
          ps2Caveat
        }
        data[row] = val ? 1 : 0
        this.loading_server = true
        changeCaveat(data).then(res => {
          if (res && res.retCode === 200) {
            this.$message({
              message: '电源告警状态修改成功',
              type: 'success'
            })
            this.systemShow()
          } else {
            this.form[row] = val ? 0 : 1
          }
          this.loading_server = false
        })
      },
      changeBladeVisible(index) {
        if (this.bladeData[index]) {
          this.bladeData[index].isblock = this.bladeData[index].isblock ?
            false :
            true;
        }
      },
    },
  };

</script>

<style lang="scss" scoped>
  @import "@/styles/comment.scss";

  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .box-card {
      width: 480px;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  // .clearfix {
  //   position: relative;
  // }

  .card {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    border-radius: 4px;
    overflow: hidden;
    -webkit-box-sizing: inherit;
    box-sizing: inherit;

    .header {
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .content {
      padding: 20px;
    }

    .close {
      display: none;
    }
  }

</style>

<style lang="scss">
  .serverPsC {
    .el-switch__label.is-active {
      color: #303133
    }
  }

</style>

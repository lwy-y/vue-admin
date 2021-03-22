<template>
  <div class="dev">
    <div class="dev-header">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="BMC服务器" prop="armId" class="mb0">
          <el-select v-model="filterObj.bladeId" filterable placeholder="请选择" @change="onSubmit">
            <el-option v-for="item in OptionData" :key="item.bladeId" :label="item.bladeName" :value="item.bladeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="timeNow">
          <el-date-picker type="date" :clearable="false" value-format="yyyy-MM-dd" placeholder="选择日期"
            v-model="filterObj.timeNow" style="width: 100%;" @change="onSubmit"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>-->
      </el-form>
    </div>
    <div class="dev-content">
      <div :class="echartsData.length?'dev-content-list':['dev-content-list','nodata'].join(' ')">
        <div class="ech" v-for="(item,key) in echartsData" :key="key">
          <div class="title-center">{{item.label}}</div>
          <ve-line :legend="lineLegend" :grid="lineGrid" :extend="item.chartExtend" :data="item.chartData"></ve-line>
        </div>
      </div>

      <div class="dev-content-right">
        <div class="dev-content-list-one">
          <div class="dev-content-list-one-header">告警设置</div>
          <div class="dev-content-list-one-content">
            <div class="dev-content-list-one-content-list" v-for="warnRow in WarnList" :key="warnRow.warninName"
              @click="showDialog(warnRow)">
              <div>{{warnRow.warninName}}</div>
              <div style="color:#F56C6C;">{{warnRow.threshold}}</div>
              <div style="cursor: pointer;">
                <i class="el-icon-edit-outline"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="dev-content-list-one">
          <div class="dev-content-list-one-header">设备列表</div>
          <div class="dev-content-list-two-content">
            <el-table :data="deviceList" ref="multipleTable" tooltip-effect="dark" style="width: 100%"
              @select="handleSelectionChange" @select-all="handleSelectionChange">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="mmodel" label="设备"></el-table-column>
              <el-table-column prop="mip" label="IP地址" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!--告警值设置-->
    <el-dialog :title="warnForm.warninName" :visible.sync="visible" :modal-append-to-body="false" :append-to-body="true"
      center width="480px" :close="()=>cancelWarnValue('warnForm')">
      <el-form :model="warnForm" ref="warnForm" :rules="warnFormRule" label-width="140px">
        <el-form-item :label="warnForm.warninName" prop="threshold">
          <el-input v-model.trim="warnForm.threshold" placeholder="请输入告警值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>cancelWarnValue('warnForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditWarnValue('warnForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    showAllBlade,
    showModule,
    showEquipment,
    showAlarm,
    updateWarn,
  } from '@/api/module'

  import moment from 'moment'

  export default {
    name: "deviceInformation",
    data() {
      const validateThreshold = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error("警告值不能为空"));
        } else if (value > 100) {
          callback(new Error("最大值为100"));
        } else {
          callback();
        }
      };
      return {
        visible: false,
        deviceIdList: [],
        alertRuleForm: {
          value: "",
        },
        alertRules: {
          value: [{
            required: true,
            message: "告警值不能为空",
            trigger: "change"
          }, ],
        },
        lineLegend: {
          bottom: 20,
        },
        lineGrid: {
          right: 40,
        },
        echartsData: [],
        deviceData: [],
        gj: {},
        filterObj: {
          bladeId: 0,
          timeNow: new Date(),
        },
        OptionData: [],
        WarnList: [],
        deviceList: [],
        warnForm: {
          warninName: "",
          threshold: 0,
        },
        warnFormRule: {
          threshold: [{
              pattern: /^([0-9]\d*|0)(\.\d{1,2})?$/,
              message: "请输入0~100的数字，做多可以设置2位小数吧",
            },
            {
              required: true,
              validator: validateThreshold,
              trigger: "change"
            },
          ],
        },
      };
    },
    created() {
      this.getOptionList(); // 获取服务器列表
      this.getWarnList();
    },
    methods: {
      // 获取服务器列表
      getOptionList() {
        showAllBlade().then(res => {
          if (res && res.retCode === 200) {
            this.OptionData = res.data;
            // 默认选择第一个服务器
            if (res.data.length && res.data[0].bladeId && !this.filterObj.bladeId) {
              this.filterObj.bladeId = res.data[0].bladeId;
            }
            // 获取设备列表
            this.getDeviceList();
          }
        })
      },

      // 获取服务器下设备列表
      getDeviceList() {
        let data = {
          bladeId: this.filterObj.bladeId,
          pageNum: 1,
          pageSize: 9999
        }
        showModule(data).then(res => {
          if (res && res.retCode === 200) {
            let result = res.data.records
            this.deviceList = result
            if (result.length) {
              let list = [];
              result.forEach((item, index) => {
                if (index < 5) {
                  list.push(item.mid);
                }
              });
              this.deviceIdList = list;
              this.$nextTick(() => {
                // console.log("执行了");
                result.forEach((item, index) => {
                  if (index < 5) {
                    item && this.$refs.multipleTable.toggleRowSelection(item);
                  }
                  // if (index === 5 || index === result.length) {
                  //   this.getDeviceGraph();
                  // }
                });
                this.getDeviceGraph();
                // this.$refs.multipleTable.toggleAllSelection();
              });
            }
          }
        })
        // let params = {
        //   armId: this.filterObj.armId,
        // };
        // getArmDeviceList(params).then((res) => {
        //   if (res && res.error_code === 200) {
        //     let result = res.data ? res.data : [];
        //     this.deviceList = result;
        //     if (result.length) {
        //       let list = [];
        //       result.forEach((item, index) => {
        //         if (index < 5) {
        //           list.push(item.deviceId);
        //         }
        //       });
        //       this.deviceIdList = list;
        //       this.$nextTick(() => {
        //         // console.log("执行了");
        //         result.forEach((item, index) => {
        //           if (index < 5) {
        //             item && this.$refs.multipleTable.toggleRowSelection(item);
        //           }
        //           if (index === 5 || index === result.length) {
        //             this.getDeviceGraph();
        //           }
        //         });
        //         // this.$refs.multipleTable.toggleAllSelection();
        //       });
        //     }
        //   }
        // });

      },

      getDeviceGraph() {
        // console.log(this.deviceIdList)
        let params = {
          bladeId: this.filterObj.bladeId,
          time: moment(this.filterObj.timeNow).format("yyyy-MM-DD"),
          moduleId: this.deviceIdList.map((item) => item).join(','),
        };
        // this.deviceList.forEach((item) => {
        //   this.$refs.deviceIdTable.toggleRowSelection(item, true);
        // });
        showEquipment(params).then((res) => {
          if (res && res.retCode == 200) {
            // console.log(res);
            // return false
            let result = res.data ? res.data : [];
            this.deviceData = result;
            this.setEchartsData();
          }
        });
      },

      setEchartsData() {
        let result = this.deviceData;
        // console.log(result)
        let deviceData = result.map((item) => item.moduleId);
        // result.map(item=>...item.cupUsage)
        let columns = ["time"].concat(
          Array.from(new Set(result.map((item) => item.mmodel)))
        );
        let warnList = this.WarnList;
        let arr = [{
            name: "cpuUsage",
            label: "CPU使用率"
          },
          {
            name: "cpuTemperature",
            label: "CPU温度"
          },
          {
            name: "disk",
            label: "硬盘"
          },
          {
            name: "memory",
            label: "内存"
          },
          {
            name: 'internet',
            label: '网络'
          },
          // {
          //   name: "networkDown",
          //   label: "网络下行数据"
          // },
          // {
          //   name: "networkUp",
          //   label: "网络上行数据"
          // },
        ];
        let data = arr.map((item) => {
          return {
            name: item.name,
            label: item.label,
            chartData: {
              columns,
              rows: [],
            },
            chartExtend: {
              series: {
                markLine: {
                  // data: [
                  //   {
                  //     yAxis: 0,
                  //     lineStyle: { color: "red" },
                  //   },
                  // ],
                },
                type: "line",
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
          };
        });

        data.forEach((dataRow) => {
          let resultData = [];
          result.forEach((item) => {
            // console.log(item[dataRow.name], dataRow.name)
            resultData.push({
              ...item,
              data: item[dataRow.name],
              time: moment(item.time).format('HH:mm'),
              deviceSerial: item.mmodel
            });
            // item[dataRow.name] &&
            //   item[dataRow.name].forEach((row) => {
            //     resultData.push({
            //       ...row,
            //       deviceSerial: item.moduleId
            //     });
            //   });
          });
          let newData = [];
          let timeData = [];
          resultData.forEach((item) => {
            if (!timeData.includes(item.time)) {
              let obj = {
                time: item.time,
              };
              obj[item.deviceSerial] = item.data;
              // console.log(obj, 33333)
              newData.push(obj);
              timeData.push(item.time);
            } else {
              let obj = newData.filter((row) => row.time === item.time)[0];
              obj[item.deviceSerial] = item.data;
            }
          });
          // console.log(newData, 111111)
          dataRow.chartData.rows = newData;
          if (dataRow.name === "cpuUsage") {
            dataRow.chartExtend.series.markLine.data = [{
              yAxis: warnList.find(
                (item) => item.warninName === "CPU使用率"
              ).threshold,
              lineStyle: {
                color: "red"
              },
            }, ];
          }
          if (dataRow.name === "cpuTemperature") {
            dataRow.chartExtend.series.markLine.data = [{
              yAxis: warnList.find(
                (item) => item.warninName === "CPU温度"
              ).threshold,
              lineStyle: {
                color: "red"
              },

            }, ];
          }
          if (dataRow.name === "disk") {
            dataRow.chartExtend.series.markLine.data = [{
              yAxis: warnList.find(
                (item) => item.warninName === "硬盘"
              ).threshold,
              lineStyle: {
                color: "red"
              },
            }, ];
          }
          if (dataRow.name === "memory") {
            dataRow.chartExtend.series.markLine.data = [{
              yAxis: warnList.find(
                (item) => item.warninName === "内存"
              ).threshold,
              lineStyle: {
                color: "red"
              },
            }, ];
          }
          if (dataRow.name === "internet") {
            dataRow.chartExtend.series.markLine.data = [{
              yAxis: warnList.find(
                (item) => item.warninName === "网络"
              ).threshold,
              lineStyle: {
                color: "red"
              },
            }, ];
          }
        });
        // console.log(data);
        this.echartsData = data;
        // console.log(this.echartsData)
      },

      // 获取警告值
      getWarnList() {
        showAlarm().then((res) => {
          if (res && res.retCode === 200) {
            // console.log(res)
            let result = res.data;
            let data = []
            let warninNameobj = {
              'cpuUsage': 'CPU使用率',
              'cpuTemperature': 'CPU温度',
              'disk': '硬盘',
              'memory': '内存',
              'internet': '网络',
            }
            for (var item in result) {
              if (item !== 'alarmId') {
                let obj = {}
                obj.alarmId = result.alarmId
                obj.warninName = warninNameobj[item]
                obj.threshold = result[item]
                obj.warnin = item
                data.push(obj)
              }
            }
            // console.log(this.warnList)
            this.WarnList = data

            // if (this.echartsData.length) {
            //   this.setEchartsData();
            // }
          }
        });
      },
      handleSelectionChange(val, row) {
        // console.log(val);
        if (!val.length) {
          row && this.$refs.multipleTable.toggleRowSelection(row);
          !row && this.$refs.multipleTable.toggleAllSelection();
          return false;
        }
        let list = val.map((item) => item.mid);
        this.deviceIdList = list;
        this.$nextTick(() => {
          this.getDeviceGraph();
        });
      },
      setDayNow(date) {
        const n = new Date(date);
        let year = "";
        let month = "";
        let day = "";
        year = n.getFullYear();
        month = n.getMonth() + 1;
        day = n.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return {
          year: year.toString(),
          month: month.toString(),
          day: day.toString(),
        };
      },
      onSubmit() {
        this.echartsData = [];
        this.getDeviceList();
      },
      // // 获取设备警告
      // getDeviceCaveat() {
      //   // console.log(this.resetParams(),9988);
      //   const data = this.resetParams();
      //   getDeviceCaveat(data)
      //     .then((res) => {
      //       console.log(res, "获取设备警告");
      //       this.gj = res.data;
      //     })
      //     .catch((err) => {
      //       console.log(err, "获取设备警告0");
      //     });
      // },
      // 获取设备图表信息
      // getDeviceInfoGraph() {
      //   const data = this.resetParams();
      //   getDeviceInfoGraph(data).then((res) => {
      //     this.setEcharts(res.data);
      //   });
      // },
      // 处理图标数据
      setEcharts(data) {
        const list = this.list;
        const Json = {
          name: [],
          color: [],
          cup: {
            time: [],
            data: [],
          },
          nc: {
            time: [],
            data: [],
          },
          cp: {
            time: [],
            data: [],
          },
          up: {
            time: [],
            data: [],
          },
          down: {
            time: [],
            data: [],
          },
        };
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (list[j].id === data[i].deviceId) {
              Json.name.push(list[j].name);
              Json.color.push(list[j].color);
              if (data[i].cupUsage.length) {
                const time = data[i].cupUsage.map((x) => x.time);
                const list = data[i].cupUsage.map((x) => x.data);
                if (Json.cup.time.length < time.length) {
                  Json.cup.time = [...time];
                }
                Json.cup.data.push([...list]);
              }
              if (data[i].memory.length) {
                const time = data[i].memory.map((x) => x.time);
                const list = data[i].memory.map((x) => x.data);
                if (Json.nc.time.length < time.length) {
                  Json.nc.time = [...time];
                }
                Json.nc.data.push([...list]);
              }
              if (data[i].disk.length) {
                const time = data[i].disk.map((x) => x.time);
                const list = data[i].disk.map((x) => x.data);
                if (Json.cp.time.length < time.length) {
                  Json.cp.time = [...time];
                }
                Json.cp.data.push([...list]);
              }
              if (data[i].networkUp.length) {
                const time = data[i].networkUp.map((x) => x.time);
                const list = data[i].networkUp.map((x) => x.data);
                if (Json.up.time.length < time.length) {
                  Json.up.time = [...time];
                }
                Json.up.data.push([...list]);
              }
              if (data[i].networkDown.length) {
                const time = data[i].networkDown.map((x) => x.time);
                const list = data[i].networkDown.map((x) => x.data);
                if (Json.down.time.length < time.length) {
                  Json.down.time = [...time];
                }
                Json.down.data.push([...list]);
              }
            }
          }
        }
        const cup = Json.cup;
        if (cup.time.length) {
          this.CPUOption.xAxis.data = cup.time;
          this.CPUOption.color = Json.color;
          this.CPUOption.legend.data = Json.name;
          const series = [];
          for (let i = 0; i < cup.data.length; i++) {
            series.push({
              name: Json.name[i],
              type: "line",
              symbol: "none",
              data: cup.data[i],
              lineStyle: {
                color: Json.color[i], // 改变折线颜色
              },
            });
          }
          this.CPUOption.series = series;
          this.CPUEchart1.setOption(this.CPUOption);
          this.isCPUEchart = false;
        } else {
          this.isCPUEchart = true;
        }

        const nc = Json.nc;
        if (nc.time.length) {
          this.NCEchart.xAxis.data = nc.time;
          this.NCEchart.color = Json.color;
          this.NCEchart.legend.data = Json.name;
          const series = [];
          for (let i = 0; i < nc.data.length; i++) {
            series.push({
              name: Json.name[i],
              type: "line",
              symbol: "none",
              data: nc.data[i],
              lineStyle: {
                color: Json.color[i], // 改变折线颜色
              },
            });
          }
          this.NCEchart.series = series;
          this.NCEchart1.setOption(this.NCEchart);
          this.isNCEchart = false;
        } else {
          this.isNCEchart = true;
        }

        const cp = Json.cp;
        if (cp.time.length) {
          this.WDEchart.xAxis.data = cp.time;
          this.WDEchart.color = Json.color;
          this.WDEchart.legend.data = Json.name;
          const series = [];
          for (let i = 0; i < cp.data.length; i++) {
            series.push({
              name: Json.name[i],
              type: "line",
              symbol: "none",
              data: cp.data[i],
              lineStyle: {
                color: Json.color[i], // 改变折线颜色
              },
            });
          }
          this.WDEchart.series = series;
          this.WDEchart1.setOption(this.WDEchart);
          this.isWDEchart = false;
        } else {
          this.isWDEchart = true;
        }

        const up = Json.up;
        if (up.time.length) {
          this.WLEchart.xAxis.data = up.time;
          this.WLEchart.color = Json.color;
          this.WLEchart.legend.data = Json.name;
          const series = [];
          for (let i = 0; i < up.data.length; i++) {
            series.push({
              name: Json.name[i],
              type: "line",
              symbol: "none",
              data: up.data[i],
              lineStyle: {
                color: Json.color[i], // 改变折线颜色
              },
            });
          }
          this.WLEchart.series = series;
          this.WLEchart1.setOption(this.WLEchart);
          this.isWLEchart = false;
        } else {
          this.isWLEchart = true;
        }

        const down = Json.down;
        if (down.time.length) {
          this.WLEchartDown.xAxis.data = down.time;
          this.WLEchartDown.color = Json.color;
          this.WLEchartDown.legend.data = Json.name;
          const series = [];
          for (let i = 0; i < down.data.length; i++) {
            series.push({
              name: Json.name[i],
              type: "line",
              symbol: "none",
              data: down.data[i],
              lineStyle: {
                color: Json.color[i], // 改变折线颜色
              },
            });
          }
          this.WLEchartDown.series = series;
          this.WLEchartDown1.setOption(this.WLEchartDown);
          this.isWLEchartDown = false;
        } else {
          this.isWLEchartDown = true;
        }
      },
      // 处理请求参数
      resetParams() {
        const deviceId = this.list.map((item) => item.id);
        const time = this.setDayNow(this.filterObj.timeNow);
        return {
          deviceId: [...deviceId],
          ...time,
        };
      },
      // 告警值弹窗
      showDialog(row) {
        this.visible = true;
        this.warnForm = Object.assign({
          ...row
        })
        // this.warnForm.warninName = row.warninName;
        // this.warnForm.threshold = row.threshold;
        // this.warnForm.warningId = row.warningId;
      },
      // 提交表单处理
      submitEditWarnValue(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.warnForm[this.warnForm.warnin] = this.warnForm.threshold
            const params = Object.assign(this.warnForm, {});
            updateWarn(params).then((res) => {
              if (res && res.retCode === 200) {
                this.$message.success("告警值设置成功");
                this.getWarnList();
                this.cancelWarnValue(formName);
              }
            });
          }
        });
      },
      cancelWarnValue(formName) {
        this.warnForm = {
          warninName: "",
          threshold: 0,
        };
        this.$refs[formName].resetFields();
        this.visible = false;
      },
    },

  };

</script>

<style scoped>
  .dev {
    background-color: #f2f2f2;
    min-height: calc(100vh - 84px);
  }

  .dev>.dev-header {
    background-color: #fff;
    padding-top: 25px;
    padding-left: 25px;
  }

  .dev>.dev-content {
    margin: 1%;
    display: flex;
  }

  .dev>.dev-content>.dev-content-list {
    flex: 1;
  }

  .dev>.dev-content>.dev-content-right {
    width: 300px;
    margin-left: 24px;
  }

  .dev>.dev-content>.dev-content-list>div {
    width: 100%;
    background-color: white;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .dev>.dev-content>.dev-content-right>.dev-content-list-one {
    background-color: #fff;
    margin-bottom: 16px;
  }

  .dev>.dev-content>.dev-content-right>.dev-content-list-one>.dev-content-list-one-header {
    padding: 20px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
  }

  .dev-content-list-two-content {
    padding: 20px;
  }

  .dev-content-list-two-content-list {
    display: flex;
    justify-content: space-between;
  }

  .dev-content-list-two-content-list-one {
    display: flex;
    margin-top: 10px;
    color: #777;
  }

  .dev-content-list-two-content-list-one>div {
    width: 33.333333%;
  }

  .dev-content-list-two-content-list-one>div:nth-child(2) {
    text-align: center;
  }

  .dev-content-list-two-content-list-one>div:nth-child(3) {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .dev-content-list-two-content-list-one>div:nth-child(3)>span {
    width: 50%;
    height: 10px;
    display: inline-block;
  }

  .dev>.dev-content>.dev-content-right>.dev-content-list-one>.dev-content-list-one-content {
    padding: 16px;
  }

  .dev>.dev-content>.dev-content-right>.dev-content-list-one>.dev-content-list-one-content>.dev-content-list-one-content-list {
    background-color: #f5f5f5;
    margin-bottom: 16px;
    padding: 10px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dev>.dev-content>.dev-content-right>.dev-content-list-one>.dev-content-list-one-content>.dev-content-list-one-content-list>.dev-content-list-one-content-list-right {
    color: #999;
    margin-top: 10px;
  }

  .ech {
    position: relative;
  }

  .ech .title-center {
    padding: 24px 0 0;
    text-align: center;
  }

  .notTitle {
    width: 100%;
    height: 300px;
    position: absolute;
    z-index: 9;
    background-color: #fff;
    text-align: center;
    line-height: 300px;
    border-radius: 5px;
  }

  .nodata {
    /* background-image: url("../../assets/images/noData.png"); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 300px;
    margin-top: 100px;

  }

</style>

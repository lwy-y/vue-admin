<template>
  <div id="content-wrapper">
    <div id="app">
      <div class="container-fluid d-flex flex-column">
        <div class="row grow-1 flex-reset">
          <div class="col-sm height-auto-fill" style="min-height: 0; overflow-y: auto; padding: 20px;flex: 1;">
            <div style="padding: 5px 25px 5px;">
              <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- <el-tab-pane label="运行信息" name="info" style="width: 100%;">
                  <div>
                    <div class="block">
                      <span class="demonstration">设备名称：</span>
                      <span class="demonstration" style="margin-right:24px;" v-text="deviceName"></span>
                      <span class="demonstration">时间：</span>
                      <el-date-picker v-model="timeNow" type="date" @change="changeTime" value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>
                    </div>
                    <div>
                      <div class="info-all-all">
                        <div class="info-all">
                          <div class="info-content">
                            <div>
                              <span>{{runHeaderDetail.runTime}}小时</span>
                              <span>运行时间</span>
                            </div>
                            <div>
                              <span>{{runHeaderDetail.totalMemorySpace}}Gb</span>
                              <span>内存总量</span>
                            </div>
                            <div>
                              <span>{{runHeaderDetail.cpuCore}}</span>
                              <span>CPU核数</span>
                            </div>
                            <div>
                              <span>{{runHeaderDetail.cpuArchitecture}}</span>
                              <span>CPU架构</span>
                            </div>
                          </div>
                          <div class="info-content" style="margin-top: 20px">
                            <div style="text-align: left">
                              <span style="letter-spacing: 0">{{runHeaderDetail.romVersion}}</span>
                              <span>ROM版本</span>
                            </div>
                          </div>
                        </div>
                        <div class="info-all-right">
                          <div>
                            <div>
                              <span class="all-border-top">总CPU使用率</span>
                              <div class="all-border">
                                <span class="all-border-width" :style="{width: runHeaderDetail.cpuUsage + '%'}"></span>
                              </div>
                            </div>
                            <div>
                              <span class="all-border-top">内存使用率</span>
                              <div class="all-border">
                                <span class="all-border-width"
                                  :style="{width: runHeaderDetail.totalMemorySpace>0 ? (((runHeaderDetail.totalMemorySpace - runHeaderDetail.memoryFreeSpace) / runHeaderDetail.totalMemorySpace) * 100).toFixed(2) + '%': '0%'}"></span>
                              </div>
                            </div>
                            <div>
                              <span class="all-border-top">存储使用率</span>
                              <div class="all-border">
                                <span class="all-border-width"
                                  :style="{width: runHeaderDetail.storage > 0 ? (((runHeaderDetail.storage - runHeaderDetail.availableSpace) / runHeaderDetail.storage) * 100).toFixed(2) + '%': '0%' }"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="info-all-all-echart">
                        <div>
                          <div ref="CPUEchart" style="width: 100%; height: 300px"></div>
                        </div>
                        <div>
                          <div ref="NCEchart" style="width: 100%; height: 300px"></div>
                        </div>
                        <div>
                          <div ref="WDEchart" style="width: 100%; height: 300px"></div>
                        </div>
                        <div>
                          <div ref="WLEchart" style="width: 100%; height: 300px"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane> -->
                <el-tab-pane label="Terminal" name="terminal">
                  <p>
                    <code>Ctrl+Ins</code>复制，
                    <code>Shift+Ins</code>粘贴
                  </p>
                  <div ref="xterm" class="xterm-wrapper"></div>
                  <div style="margin-top:24px">
                    <strong>常用命令</strong>
                    <ul>
                      <li>
                        查看IP地址
                        <term-snippet :term="term" command="ifconfig | grep Mask" />
                      </li>
                      <li>
                        查看前台应用
                        <term-snippet :term="term" command="dumpsys activity activities | grep mFocusedActivity" />
                      </li>
                      <li>
                        列出第三方应用
                        <term-snippet :term="term" command="pm list packages -3" />
                      </li>
                      <li>
                        屏幕分辨率
                        <term-snippet :term="term" command="wm size" />
                      </li>
                      <li>
                        点亮屏幕
                        <term-snippet :term="term" command="input keyevent 224"></term-snippet>熄灭屏幕
                        <term-snippet :term="term" command="input keyevent 223"></term-snippet>
                      </li>
                      <li>
                        minicap
                        <term-snippet :term="term" command="LD_LIBRARY_PATH=/data/local/tmp /data/local/tmp/minicap -i">
                        </term-snippet>
                      </li>
                      <li>
                        更多参考
                        <a href="https://github.com/mzlogin/awesome-adb" target="_blank">awesome-adb</a>
                      </li>
                    </ul>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="remotecontrol-go-back">
                <!-- <el-button v-if="this.nettype == 2" icon="el-icon-s-promotion" @click="changeNetWork(1)">内网</el-button>
                <el-button v-if="this.nettype == 1" icon="el-icon-s-promotion" @click="changeNetWork(2)">外网</el-button>-->
                <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--已安装应用选择框-->
    <el-dialog title="选择应用" :visible.sync="appInstallDialogVisible" width="600px" :modal-append-to-body="false"
      :append-to-body="true" @closed="appOnclose('appInstallRuleForm')" center>
      <el-form :model="appInstallRuleForm" ref="appInstallRuleForm" :rules="scriptRules" class="demo-ruleForm">
        <el-form-item prop="appSelected" class="radio-form-item" label-width="0">
          <!-- <el-radio v-model="appInstallRuleForm.appSelected"  border v-for="(item,i) in appListData" :key="i" :label="item.appId">{{item.appName}}</el-radio> -->
          <el-radio v-model="appInstallRuleForm.appSelected" border v-for="(item,i) in appListData" :key="i"
            :label="item.appId">
            <span>{{item.appName}} - {{item.createDatetime | dateFormat}}</span>
          </el-radio>
        </el-form-item>
        <el-form-item class="mb0 center">
          <el-button class="mw100" type="primary" @click="submitScript('appInstallRuleForm')">确定</el-button>
          <el-button class="mw100" @click="appInstallDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import ImagePool from "./ImagePool.js";
  // import {
  //   uploadFile,
  //   updateSlide,
  //   sendPoint,
  //   getInstallApp,
  //   openApp,
  //   saveRecordingScript,
  // } from "@/api/equipment";
  // import {
  //   getBusinessList,
  //   uploadCallback
  // } from "@/api/business";
  // import {
  //   getOneDeviceInfoTop,
  //   getOneDeviceInfoGraph
  // } from "@/api/newJs";
  // import {
  //   parseTime
  // } from "@/utils/index";
  // import {
  //   getToken
  // } from "@/utils/auth";
  import echarts from "echarts";
  export default {
    name: "remotecontrol",
    data() {
      let agentAtxAddress = window.sessionStorage.getItem("deviceIp");
      let id = this.$route.query.id;
      let name = this.$route.query.name;

      return {
        timeNow: new Date(), // 时间
        CPUOption: {
          title: {
            text: "CUP使用率",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["CUP使用率"],
            bottom: "0%",
          },
          color: ["#00ccff"],
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#ddd", // 颜色
              },
            },
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                //改变刻度字体样式
                color: "#999",
              },
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#999", // 颜色
              },
            },
          },
          series: [{
            name: "CUP使用率",
            type: "line",
            symbol: "none",
            data: [],
            lineStyle: {
              color: "#00ccff", //改变折线颜色
            },
          }, ],
        },
        NCEchart: {
          title: {
            text: "内存信息",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["内存信息"],
            bottom: "0%",
          },
          color: ["#00ccff"],
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#ddd", // 颜色
              },
            },
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                //改变刻度字体样式
                color: "#999",
              },
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#999", // 颜色
              },
            },
          },
          series: [{
            name: "内存信息",
            type: "line",
            symbol: "none",
            data: [],
            lineStyle: {
              color: "#00ccff", //改变折线颜色
            },
          }, ],
        },
        WDEchart: {
          title: {
            text: "CPU温度",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["CPU温度"],
            bottom: "0%",
          },
          color: ["#00ccff"],
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#ddd", // 颜色
              },
            },
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                //改变刻度字体样式
                color: "#999",
              },
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#999", // 颜色
              },
            },
          },
          series: [{
            name: "CPU温度",
            type: "line",
            symbol: "none",
            data: [],
            lineStyle: {
              color: "#00ccff", //改变折线颜色
            },
          }, ],
        },
        WLEchart: {
          title: {
            text: "网络流量",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["上传流量", "下载流量"],
            bottom: "0%",
          },
          color: ["#00ccff", "#1890ff"],
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#ddd", // 颜色
              },
            },
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                //改变刻度字体样式
                color: "#999",
              },
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#999", // 颜色
              },
            },
          },
          series: [{
              name: "上传流量",
              type: "line",
              symbol: "none",
              data: [],
              lineStyle: {
                color: "#00ccff", //改变折线颜色
              },
            },
            {
              name: "下载流量",
              type: "line",
              symbol: "none",
              data: [],
              lineStyle: {
                color: "#1890ff", //改变折线颜色
              },
            },
          ],
        },
        radio1: "",
        radio2: "",
        radio3: "",
        radio4: "",
        nettype: 1,
        textarea: "",
        run: {
          sleep: 30,
          forRange: 4,
          text: "",
        },
        screen: "",
        isMouseMove: false,
        newMousedownx: "",
        newMousedowny: "",
        NewMouseupx: "",
        NewMouseupy: "",
        isStartMove: true,
        // deviceIp: agentAtxAddress+,
        // udid: this.$route.query.udid,
        udid: agentAtxAddress + ":5555",
        deviceId: id,
        deviceName: name,
        deviceIp: agentAtxAddress,
        activeName: "terminal", //info
        canvas: {
          bg: null,
          fg: null,
        },
        canvasStyle: {
          opacity: 1,
          // width: '400px',
          // height: '200px',
          width: "auto",
          // height: '200px',
          maxHeight: "unset",
        },
        rotation: 0,
        term: null, // Terminal object
        websockets: {
          screen: null,
          touchpad: null,
          winput: null,
        },
        whatsinput: {
          text: "",
          disabled: true,
        },
        topApp: {
          packageName: "",
          activity: "",
          pid: "",
        },
        imagePool: new ImagePool(100),
        browserUrl: "",
        app: {
          installUrl: "",
          finished: true,
          packageName: "",
          message: "",
          launch: true,
        },
        userSettings: Object.assign({
          inputName: "",
          inputCommand: "",
          visible: false,
          shortcuts: [{
            command: "input keyevent POWER",
            name: "删除",
          }, ],
        }, {}),
        fileStrig: "",
        actionUrl: "http://" + process.env.BASE_HOST + ":8001/api",
        headerToken: getToken(),
        form: {
          scriptFileUrl: "",
          businessId: "",
          apkFileUrl: "",
        },
        businessListData: [],
        appInstallDialogVisible: false,
        appInstallRuleForm: {
          appSelected: null,
        },
        scriptRules: {},
        appListData: [],
        deviceNewId: this.$route.query && this.$route.query.id ? this.$route.query.id : "",
        isRecord: false,
        isLu: false,
        inputSwipe: [],
        appPackageName: "",
        inputSwipeArr: [],
        scriptForm: {
          scriptName: "",
          uploadUrl: "",
        },
        rules: {
          //脚本表单验证
          scriptName: [{
            required: true,
            message: "请输入脚本名称",
            trigger: "blur"
          }, ],
        },
        getdeviceStatus: 0,
        tableDataSpan1: "",
        tableDataSpan2: "",
        tableDataSpan3: "",
        tableDataSpan4: "",
        tableDataSpan5: "",
        tableDataSpan6: "",
        tableDataSpan7: "",
        tableDataSpan8: "",
        tableDataSpan9: "",
        tableDataSpan10: "",
        tableDataSpan11: "",
        tableDataSpan12: "",
        tableDataSpan13: "",
        tableDataSpan14: "",
        tableDataSpan15: "",
        tableDataSpan16: "",
        tableDataSpan17: "",
        tableDataSpan18: "",
        tableDataSpan121: "",
        show1: 2,
        show2: 2,
        show3: 2,
        show4: 2,
        CPUEchart1: "",
        NCEchart1: "",
        WDEchart1: "",
        WLEchart1: "",
        runHeaderDetail: {},
      };
    },
    created() {
      this.getdeviceStatus = this.$route.query.deviceStatus;
      // this.ws1 = new WebSocket(this.whatsInputUrl)
      // this.ws2 = new WebSocket("ws://" + this.address + "/term")
      this.ws3 = new WebSocket("ws://" + this.address + "/minicap");
      // this.ws4 = new WebSocket("ws://" + `${this.address.split(":")[0]}:9999` + "/minitouch")

      let miniTouchIp = window.sessionStorage.getItem("miniTouchIp");
      this.ws4 = new WebSocket("ws://" + this.address + "/minitouch");

      // this.ws5 = ws://100.168.1.203:7912/minitouch
      // this.getBusinessListData();
      this.getOneDeviceInfoTop();
      this.getOneDeviceInfoGraph();
    },
    filters: {
      dateFormat(date) {
        return date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    destroyed() {
      this.wsClose();
    },
    methods: {
      // 切换时间
      changeTime() {
        console.log(123);
        this.getOneDeviceInfoTop();
        this.getOneDeviceInfoGraph();
      },
      // 获取单个的图表信息
      getOneDeviceInfoGraph() {
        let time = this.setDayNow(this.timeNow);
        let data = {
          deviceId: [this.deviceId],
          ...time,
        };
        getOneDeviceInfoGraph(data)
          .then((res) => {
            console.log(res, "我是当个图标");
            let list = res.data;
            this.setCPUEchart(list);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // 获取单个顶部信息
      getOneDeviceInfoTop() {
        let time = this.setDayNow(this.timeNow);
        let data = {
          deviceId: [this.deviceId],
          ...time,
        };
        getOneDeviceInfoTop(data)
          .then((res) => {
            this.runHeaderDetail = res.data ? res.data : {};
          })
          .catch((err) => {
            console.log(err);
          });
      },
      setDayNow(date) {
        let n = new Date(date);
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
      // 初始化CPU
      firstE() {
        this.CPUEchart1 = echarts.init(this.$refs.CPUEchart);
        this.NCEchart1 = echarts.init(this.$refs.NCEchart);
        this.WDEchart1 = echarts.init(this.$refs.WDEchart);
        this.WLEchart1 = echarts.init(this.$refs.WLEchart);
      },
      // 生成CPUEchart
      setCPUEchart(data) {
        console.log(data, 8888888888);
        let {
          cupUsage,
          memory,
          temperature,
          networkUp,
          networkDown
        } = data;

        let cup = this.restData(cupUsage, "time", "data");
        this.CPUOption.xAxis.data = cup.timeList;
        this.CPUOption.series[0].data = cup.numberList;
        this.CPUEchart1.setOption(this.CPUOption);

        let nc = this.restData(memory, "time", "data");
        this.NCEchart.xAxis.data = nc.timeList;
        this.NCEchart.series[0].data = nc.numberList;
        this.NCEchart1.setOption(this.NCEchart);

        let wd = this.restData(temperature, "time", "data");
        this.WDEchart.xAxis.data = wd.timeList;
        this.WDEchart.series[0].data = wd.numberList;
        this.WDEchart1.setOption(this.WDEchart);

        let wlUp = this.restData(networkUp, "time", "data");
        let wlIn = this.restData(networkDown, "time", "data");
        this.WLEchart.xAxis.data = wlUp.timeList;
        this.WLEchart.series[0].data = wlUp.numberList;
        this.WLEchart.series[1].data = wlIn.numberList;
        this.WLEchart1.setOption(this.WLEchart);
      },
      restData(arr, time, data) {
        let timeList = [];
        let numberList = [];
        if (!arr.length) {
          return {
            timeList,
            numberList,
          };
        }
        for (let i = 0; i < arr.length; i++) {
          timeList.push(arr[i][time]);
          numberList.push(arr[i][data]);
        }
        return {
          timeList,
          numberList,
        };
      },
      //radio
      changeHandler1(value) {
        // if(this.tableDataSpan12 == ''){return}
        if (this.radio1 == 1) {
          this.tableDataSpan12 =
            '<i class="el-icon-success" style="color: #67C23A" ></i>';
        } else {
          this.tableDataSpan12 =
            '<i class="el-icon-error" style="color: #F56C6C" ></i>';
        }
      },
      changeNetWork(type) {
        // this.nettype = type;
        // if( this.nettype == 2){
        //   this.ws3 = new WebSocket("ws://100.168.1.154:9959")
        //   this.mirrorDisplay()
        //   console.log(this.deviceId)
        //   this.ws4 = new WebSocket("ws://100.168.1.154:8001/api/websocketForWeb/"+this.deviceId)
        //   this.syncTouchpad()
        // }
      },
      changeHandler2(value) {
        // if(this.tableDataSpan13 == ''){return}
        if (this.radio2 == 1) {
          this.tableDataSpan13 =
            '<i class="el-icon-success" style="color: #67C23A" ></i>';
        } else {
          this.tableDataSpan13 =
            '<i class="el-icon-error" style="color: #F56C6C" ></i>';
        }
      },
      changeHandler3(value) {
        // if(this.tableDataSpan15 == ''){return}
        if (this.radio3 == 1) {
          this.tableDataSpan15 =
            '<i class="el-icon-success" style="color: #67C23A" ></i>';
        } else {
          this.tableDataSpan15 =
            '<i class="el-icon-error" style="color: #F56C6C" ></i>';
        }
      },
      changeHandler4(value) {
        // if(this.tableDataSpan17 == ''){return}
        if (this.radio4 == 1) {
          this.tableDataSpan17 =
            '<i class="el-icon-success" style="color: #67C23A" ></i>';
        } else {
          this.tableDataSpan17 =
            '<i class="el-icon-error" style="color: #F56C6C" ></i>';
        }
      },
      //循环
      addFor(number) {
        let text = `for i in range(${number}):\r\n    `;
        this.insertInputTxt("textarea", text);
      },
      //添加开始录制视频
      addStartText() {
        let text = `with open(anchorID.txt) as f:\r\n  pass('开始录制')\r\n`;
        this.insertInputTxt("textarea", text);
      },
      addEndText() {
        let text = `with open(anchorID.txt) as f:\r\n  pass('开始录制')\r\n`;
        this.insertInputTxt("textarea", text);
      },
      //点击添加
      addText(val) {
        this.insertInputTxt("textarea", val + "\r\n");
      },
      //插入事件
      insertInputTxt(id, insertTxt) {
        console.log(id, insertTxt);
        var elInput = document.getElementById(id);
        var startPos = elInput.selectionStart;
        var endPos = elInput.selectionEnd;
        if (startPos === undefined || endPos === undefined) return;
        var txt = elInput.value;
        var result =
          txt.substring(0, startPos) + insertTxt + txt.substring(endPos);
        elInput.value = result;
        this.textarea = result;
        elInput.focus();
        elInput.selectionStart = startPos + insertTxt.length;
        elInput.selectionEnd = startPos + insertTxt.length - 1;
      },
      coords1(boundingW, boundingH, relX, relY, rotation) {
        var w, h, x, y;
        switch (rotation) {
          case 0:
            w = boundingW;
            h = boundingH;
            x = relX;
            y = relY;
            break;
          case 90:
            w = boundingH;
            h = boundingW;
            x = boundingH - relY;
            y = relX;
            break;
          case 180:
            w = boundingW;
            h = boundingH;
            x = boundingW - relX;
            y = boundingH - relY;
            break;
          case 270:
            w = boundingH;
            h = boundingW;
            x = relY;
            y = boundingW - relX;
            break;
        }
        return {
          xP: x / w,
          yP: y / h,
        };
      },
      // 结束请求
      wsClose() {
        console.log("wsClose");
        // this.ws1.close()
        // this.ws2.close()
        this.ws3.close();
        this.ws4.close();
      },
      onUpload(resp, file, files) {
        if (!resp.success) {
          this.$message({
            message: resp.description,
            type: "error",
          });
          return;
        }
        this.app.installUrl = resp.data.url;
        this.appInstall();
      },
      appInstall() {
        this.app.packageName = "";
        this.app.finished = false;
        this.app.message = "安裝中 ...";
        $.ajax({
            method: "post",
            url: this.source.url + "/app/install?udid=" + this.udid,
            data: {
              url: this.app.installUrl,
              launch: this.app.launch,
              secret: this.source.secret,
            },
          })
          .done((ret) => {
            this.app.message = ret.output;
            this.app.packageName = ret.packageName;
          })
          .fail((err) => {
            if (err.status == 400) {
              this.app.message = err.responseJSON.description;
            } else {
              this.app.message = err.responseText;
            }
          })
          .always(() => {
            this.app.finished = true;
          });
      },
      addTopAppToShortcut() {
        this.$prompt(
            "给 <code>" + this.topApp.packageName + "</code> 起个名字",
            "快捷方式添加", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              dangerouslyUseHTMLString: true,
            }
          )
          .then(({
            value
          }) => {
            let command = [
              "monkey",
              "-p",
              this.topApp.packageName,
              "-c",
              "android.intent.category.LAUNCHER",
              "1",
            ].join(" ");
            this.addShortcut(value, command);
          })
          .catch(() => {});
      },
      fixInputMethod() {
        this.$notify.info({
          title: "输入法",
          message: "修复中",
        });
        const inputMethod = "com.buscode.whatsinput/.WifiInputMethod";
        return this.runShell("ime enable " + inputMethod)
          .then(() => {
            return this.runShell("ime set " + inputMethod);
          })
          .then(() => {
            this.$refs.whatsinput.focus();
            // return this.loadWhatsinput()
          })
          .then(
            () => {
              this.$notify.success({
                message: "输入法修复完成"
              });
            },
            () => {
              this.$notify.success({
                message: "输入法修复失败，F12查看详情"
              });
            }
          );
      },
      loadWhatsinput(callback) {
        console.log("whatsInputUrl", this.whatsInputUrl);
        let defer = $.Deferred();
        // let ws = new WebSocket(this.whatsInputUrl)
        let ws = this.ws1;
        this.websockets.winput = ws;
        ws.onopen = (ev) => {
          defer.resolve();
          console.log("whatsinput connected");
        };
        ws.onmessage = (ev) => {
          console.log("winput recv", ev);
          let data = JSON.parse(ev.data);
          switch (data.type) {
            case "InputStart":
              this.whatsinput.text = data.text;
              this.whatsinput.disabled = false;
              setTimeout(() => {
                this.$refs.whatsinput.focus();
              }, 1);
              break;
            case "InputFinish":
              this.whatsinput.disabled = true;
              break;
            case "InputChange":
              this.whatsinput.text = data.text;
              break;
          }
        };
        ws.onerror = (ev) => {
          console.error(ev);
          defer.reject();
        };
        ws.onclose = (ev) => {
          console.log("winput closed");
          if (ws === this.websockets.winput) {
            this.websockets.winput = null;
          }
        };
        return defer;
      },
      sendInputText() {
        console.log("sync", this.whatsinput.text);
        let ws = this.websockets.winput;
        ws.send(
          JSON.stringify({
            type: "InputEdit",
            text: this.whatsinput.text,
          })
        );
      },
      sendInputKey(key) {
        console.log("Sync key", key);
        let code = {
          enter: 66,
          tab: 61
        } [key] || key;
        let ws = this.websockets.winput;
        ws.send(
          JSON.stringify({
            type: "InputKey",
            code: "" + code,
          })
        );
      },
      loadUserSettings() {
        return $.getJSON("/api/v1/user/settings").then((ret) => {
          this.userSettings.shortcuts = ret.shortcuts || [];
        });
      },
      updateUserSettings() {
        return $.ajax({
          method: "put",
          url: "/api/v1/user/settings",
          dataType: "json",
          data: JSON.stringify({
            shortcuts: this.userSettings.shortcuts,
          }),
        }).then((ret) => {
          console.log("设置已更新");
        });
      },
      triggerShortcut(v) {
        return this.runShell(v.command).done((ret) => {
          this.$notify({
            dangerouslyUseHTMLString: true,
            message: "CMD: <code>" +
              v.command +
              "</code><br>Output: <code>" +
              ret.output +
              "</code>",
          });
          console.log("Shell", v.command, "output", ret);
        });
      },
      addShortcut(name, command) {
        if (!name || !command) {
          return;
        }
        let s = this.userSettings;
        s.shortcuts.push({
          name,
          command
        });
        s.inputName = "";
        s.inputCommand = "";
        s.visible = false;
        // return this.updateUserSettings()
      },
      removeShortcut(c) {
        this.userSettings.shortcuts = this.userSettings.shortcuts.filter((v) => {
          return v.name != c.name;
        });
        // return this.updateUserSettings()
      },
      hotfix() {
        // 修复屏幕旋转问题
        // this.$notify({
        // message: "Hotfixing",
        // position: 'top-left',
        // duration: 1000,
        // })
        $.ajax({
          method: "get",
          url: this.deviceUrl + "/info/rotation",
        }).done((ret) => {
          this.$notify({
            message: "Rotation updated",
            position: "bottom-left",
            duration: 1000,
          });
        });
      },
      stopUsing() {
        $.ajax({
          method: "delete",
          url: "/api/v1/user/devices/" + this.udid,
          dataType: "json",
        }).always(() => {
          window.close();
        });
      },
      openBrowser(url) {
        if (!/^https?:\/\//.test(url)) {
          url = "http://" + url;
        }
        this.browserUrl = "";
        return this.runShell("am start -a android.intent.action.VIEW -d " + url);
      },
      runShell(command) {
        return $.ajax({
          method: "get",
          url: this.deviceUrl + "/shell",

          data: {
            command: command,
          },
          dataType: "json",
        }).then((ret) => {
          console.log("runShell", command, ret);
          return ret;
        });
      },
      runKeyevent(key) {
        return this.runShell("input keyevent " + key.toUpperCase());
      },
      refreshWebsocket() {
        this.ws3 = new WebSocket("ws://" + this.address + "/minicap");
        this.mirrorDisplay();
        this.ws4 = new WebSocket("ws://" + this.address + "/minitouch");
        this.syncTouchpad();
      },
      sleep(millisecond) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, millisecond);
        });
      },
      async handleTabClick(tab, event) {
        if (tab.name == "terminal") {
          if (!this.term) {
            this.loadTerminal();
          }
        } else if (tab.name == "test") {
          for (let i = 1; i < 19; i++) {
            await this.sleep(3000);
            if (i == 1) {
              this.tableDataSpan1 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过，可正常打开';
            } else if (i == 2) {
              this.tableDataSpan2 =
                '<i class="el-icon-error" style="color: #F56C6C" ></i>检测未通过，没有，需要登录';
            } else if (i == 3) {
              this.tableDataSpan3 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 4) {
              this.tableDataSpan4 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 5) {
              this.tableDataSpan5 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 6) {
              this.tableDataSpan6 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 7) {
              this.tableDataSpan7 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 8) {
              this.tableDataSpan8 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>传播直播节目';
            } else if (i == 9) {
              this.tableDataSpan9 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>传播点播节目';
            } else if (i == 10) {
              this.tableDataSpan10 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 11) {
              this.tableDataSpan11 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过';
            } else if (i == 12) {
              if (this.radio1 == 1) {
                this.tableDataSpan12 =
                  '<i class="el-icon-success" style="color: #67C23A" ></i>';
              } else if (this.radio1 == 2) {
                this.tableDataSpan12 =
                  '<i class="el-icon-error" style="color: #F56C6C" ></i>';
              }
            } else if (i == 13) {
              if (this.radio2 == 1) {
                this.tableDataSpan13 =
                  '<i class="el-icon-success" style="color: #67C23A" ></i>';
              } else if (this.radio2 == 2) {
                this.tableDataSpan13 =
                  '<i class="el-icon-error" style="color: #F56C6C" ></i>';
              }
            } else if (i == 14) {
              this.tableDataSpan14 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过，有能力';
            } else if (i == 15) {
              if (this.radio3 == 1) {
                this.tableDataSpan15 =
                  '<i class="el-icon-success" style="color: #67C23A" ></i>';
              } else if (this.radio3 == 2) {
                this.tableDataSpan15 =
                  '<i class="el-icon-error" style="color: #F56C6C" ></i>';
              }
            } else if (i == 16) {
              this.tableDataSpan16 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过，有记录';
            } else if (i == 17) {
              if (this.radio4 == 1) {
                this.tableDataSpan17 =
                  '<i class="el-icon-success" style="color: #67C23A" ></i>';
              } else if (this.radio4 == 2) {
                this.tableDataSpan17 =
                  '<i class="el-icon-error" style="color: #F56C6C" ></i>';
              }
            } else if (i == 18) {
              this.tableDataSpan18 =
                '<i class="el-icon-success" style="color: #67C23A" ></i>检测通过，没有植入';
            }
          }
        } else if (tab.name == "info") {
          setTimeout(() => {
            this.CPUEchart1.resize();
            this.NCEchart1.resize();
            this.WDEchart1.resize();
            this.WLEchart1.resize();
          }, 200);
        }
      },
      loadTerminal() {
        let term;
        let ws = new WebSocket("ws://" + this.address + "/term");
        // let ws = this.ws2;
        ws.binaryType = "arraybuffer";

        function ab2str(buf) {
          return String.fromCharCode.apply(null, new Uint8Array(buf));
        }
        ws.onopen = (evt) => {
          term = new Terminal({
            screenKeys: true,
            useStyle: true,
            cursorBlink: true,
          });
          term.on("data", (data) => {
            ws.send(new TextEncoder().encode("\x00" + data));
          });
          term.on("resize", (evt) => {
            ws.send(
              new TextEncoder().encode(
                "\x01" +
                JSON.stringify({
                  cols: evt.cols,
                  rows: evt.rows,
                })
              )
            );
          });
          term.on("title", (title) => {
            console.log("title", title);
          });
          term.open(this.$refs.xterm, {
            focus: true
          });
          term.fit();
          this.term = term;
          new ResizeSensor(this.$refs.xterm, function (e) {
            term.resize();
            term.fit();
          });
        };
        ws.onmessage = (evt) => {
          if (evt.data instanceof ArrayBuffer) {
            term.write(ab2str(evt.data));
          } else {
            alert(evt.data);
          }
        };
        ws.onclose = (evt) => {
          term.write("Session terminated");
          term.destroy();
        };
        ws.onerror = (evt) => {
          console.log(evt);
        };
      },
      openDisplayTouchpad() {
        this.mirrorDisplay();
        this.syncTouchpad();
      },
      closeDisplayTouchpad() {
        this.closeMirrorDisplay();
        this.closeSyncTouchpad();
      },
      mirrorDisplay() {
        // let ws = new WebSocket("ws://" + this.address + "/minicap");
        let ws = this.ws3;
        this.websockets.screen = ws;
        ws.onopen = (ev) => {
          console.log("ws3-onopen");
          console.time("minicap开始于结束时间");
          this.canvasStyle.opacity = 1;
        };
        ws.onmessage = (message) => {
          console.log(message, "ws3onmessage");
          if (message.data instanceof Blob) {
            this.drawBlobImageToCanvas(message.data, this.canvas.bg);
          } else if (/data size: /.test(message.data)) {
            // console.log("receive message:", message.data)
          } else if (/^rotation/.test(message.data)) {
            this.rotation = parseInt(message.data.substr("rotation ".length), 10);
            console.log("rotation:", this.rotation);
          } else {
            console.log("receive message:", message.data);
          }
        };
        ws.onclose = (e) => {
          console.log(
            " ws3  websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
          );
          console.timeEnd("minicap开始于结束时间");
          if (this.websockets.screen === ws) {
            this.websockets.screen = null;
            // this.$message({
            //     showClose: true,
            //     message: '设备屏幕同步中断',
            //     type: 'error',
            // });
            this.canvasStyle.opacity = 0.5;
          }
        };
        ws.onerror = function (ev) {
          console.log("screen websocket error");
        };
        if (this.type == 2) {
          ws.send(this.deviceIp);
        }
      },
      closeMirrorDisplay() {
        this.canvasStyle.opacity = 0.5;
        if (this.websockets.screen) {
          let ws = this.websockets.screen;
          this.websockets.screen = null;
          ws.close();
        }
      },
      syncTouchpad() {
        let element = this.canvas.bg; // maybe fg is better
        let screen = {
          bounds: {},
        };
        let udid = this.udid;
        // let ws = new WebSocket("ws://" + `${this.address.split(":")[0]}:9999` + "/minitouch")
        let ws = this.ws4;
        this.websockets.touchpad = ws;
        ws.onopen = (ret) => {
          console.log("ws4-onopen");
          console.time("minitouch开始于结束时间");
          touchReset(); // fix when device is out of control
        };

        // ws.onmessage = (message) => {
        //     // console.log("minitouch recv", message)
        //     console.log("1111111111111111111111",message)

        // }
        ws.onclose = (e) => {
          console.log(
            " ws4  websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
          );
          console.timeEnd("minitouch开始于结束时间");
          if (this.websockets.touchpad === ws) {
            this.websockets.touchpad = null;
          }
          element.removeEventListener("mousedown", mouseDownListener);
          element.removeEventListener("mousewheel", mouseWheelListener);
        };

        function calculateBounds() {
          var el = element;
          screen.bounds.w = el.offsetWidth;
          screen.bounds.h = el.offsetHeight;
          screen.bounds.x = 0;
          screen.bounds.y = 0;
          while (el.offsetParent) {
            screen.bounds.x += el.offsetLeft;
            screen.bounds.y += el.offsetTop;
            el = el.offsetParent;
          }
        }
        /**
         * Rotation affects the screen as follows:
         *
         * 0deg
         * |------|
         * | MENU |
         * |------|
         * --> | | --|
         * | | | v
         * | |
         * | |
         * |------|
         * |----|-| |-|----|
         * | |M| | | |
         * | |E| | | |
         * 90deg | |N| |U| | 270deg
         * | |U| |N| |
         * | | | |E| |
         * | | | |M| |
         * |----|-| |-|----|
         * |------|
         * ^ | | |
         * |-- | | <--
         * | |
         * | |
         * |------|
         * | UNEM |
         * |------|
         * 180deg
         *
         * Which leads to the following mapping:
         *
         * |--------------|------|---------|---------|---------|
         * | | 0deg | 90deg | 180deg | 270deg |
         * |--------------|------|---------|---------|---------|
         * | CSS rotate() | 0deg | -90deg | -180deg | 90deg |
         * | bounding w | w | h | w | h |
         * | bounding h | h | w | h | w |
         * | pos x | x | h-y | w-x | y |
         * | pos y | y | x | h-y | h-x |
         * |--------------|------|---------|---------|---------|
         */
        function coords(boundingW, boundingH, relX, relY, rotation) {
          var w, h, x, y;
          switch (rotation) {
            case 0:
              w = boundingW;
              h = boundingH;
              x = relX;
              y = relY;
              break;
            case 90:
              w = boundingH;
              h = boundingW;
              x = boundingH - relY;
              y = relX;
              break;
            case 180:
              w = boundingW;
              h = boundingH;
              x = boundingW - relX;
              y = boundingH - relY;
              break;
            case 270:
              w = boundingH;
              h = boundingW;
              x = relY;
              y = boundingW - relX;
              break;
          }
          return {
            xP: x / w,
            yP: y / h,
          };
        }
        let touchDown = (index, x, y, pressure) => {
          // ws.send(`{"mCurrentFocus":true}`)
          let scaled = coords(
            screen.bounds.w,
            screen.bounds.h,
            x,
            y,
            this.rotation
          );
          console.log(
            "touchDown:",
            JSON.stringify({
              operation: "d",
              index: index,
              deviceID: udid,
              pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
            })
          );
          this.fileStrig +=
            JSON.stringify({
              operation: "d",
              // index: index,
              // deviceID: udid,
              // pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
              timestamp: new Date().valueOf(),
            }) + "\n";
          ws.send(
            JSON.stringify({
              operation: "d",
              index: index,
              deviceID: udid,
              pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
            })
          );
        };
        let touchMove = (index, x, y, pressure) => {
          let scaled = coords(
            screen.bounds.w,
            screen.bounds.h,
            x,
            y,
            this.rotation
          );
          console.log(
            "touchMove:",
            JSON.stringify({
              operation: "m",
              index: index,
              deviceID: udid,
              pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
            })
          );
          this.fileStrig +=
            JSON.stringify({
              operation: "m",
              // index: index,
              // deviceID: udid,
              // pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
              timestamp: new Date().valueOf(),
            }) + "\n";
          ws.send(
            JSON.stringify({
              operation: "m",
              index: index,
              deviceID: udid,
              pressure: pressure,
              xP: scaled.xP,
              yP: scaled.yP,
            })
          );
        };

        function touchWait(millseconds) {
          console.log(
            "touchWait:",
            JSON.stringify({
              operation: "w",
              deviceID: udid,
              milliseconds: millseconds,
            })
          );
          ws.send(
            JSON.stringify({
              operation: "w",
              deviceID: udid,
              milliseconds: millseconds,
            })
          );
        }
        let touchUp = (index) => {
          console.log(
            "touchUp:",
            JSON.stringify({
              operation: "u",
              index: index,
              deviceID: udid,
            })
          );
          this.fileStrig +=
            JSON.stringify({
              operation: "u",
              // index: index,
              // deviceID: udid,
              timestamp: new Date().valueOf(),
            }) + "\n";
          ws.send(
            JSON.stringify({
              operation: "u",
              deviceID: udid,
              index: index,
            })
          );
        };

        function touchReset() {
          console.log(
            "touchReset:",
            JSON.stringify({
              operation: "r",
              deviceID: udid,
            })
          );
          ws.send(
            JSON.stringify({
              operation: "r",
              deviceID: udid,
            })
          );
        }

        function touchCommit() {
          console.log(
            "touchCommit:",
            JSON.stringify({
              operation: "c",
              deviceID: udid
            })
          );
          ws.send(JSON.stringify({
            operation: "c",
            deviceID: udid
          }));
        }
        let mouseDownListener = (event) => {
          console.log("=====mouseDown=====");
          var e = event;
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          e.preventDefault();
          // activate whatsinput
          this.$refs.whatsinput.focus();
          // Middle click equals HOME
          if (e.which === 2) {
            this.runKeyevent("HOME");
            return;
          }
          // Right click equals BACK
          if (e.which === 3) {
            this.runKeyevent("BACK");
            return;
          }
          // fakePinch = e.altKey
          calculateBounds();
          var x = e.pageX - screen.bounds.x;
          var y = e.pageY - screen.bounds.y;
          var pressure = 0.5;
          // activeFinger(0, e.pageX, e.pageY, pressure);
          touchDown(0, x, y, pressure);
          touchCommit();
          // element.removeEventListener('mousemove', mouseHoverListener);
          element.addEventListener("mousemove", mouseMoveListener);
          document.addEventListener("mouseup", mouseUpListener);
        };
        let mouseMoveListener = (event) => {
          console.log("=====mouseMoveListener=====");
          var e = event;
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          // Skip secondary click
          if (e.which === 3) {
            return;
          }
          e.preventDefault();
          var pressure = 0.5;
          activeFinger(0, e.pageX, e.pageY, pressure);
          var x = e.pageX - screen.bounds.x;
          var y = e.pageY - screen.bounds.y;
          touchMove(0, x, y, pressure);
          touchCommit();
        };

        function mouseUpListener(event) {
          console.log("=====mouseUpListener=====");
          var e = event;
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          // Skip secondary click
          if (e.which === 3) {
            return;
          }
          e.preventDefault();

          touchUp(0);
          touchCommit();
          stopMousing();
          console.log("=====mouseUpListener End=====");
        }

        function stopMousing() {
          console.log("=====stopMousing=====");
          element.removeEventListener("mousemove", mouseMoveListener);
          console.log("removeEventListener mousemove");
          // element.addEventListener('mousemove', mouseHoverListener);
          document.removeEventListener("mouseup", mouseUpListener);
          console.log("removeEventListener mouseup");
          deactiveFinger(0);
        }

        function activeFinger(index, x, y, pressure) {
          console.log("=====activeFinger=====");
          var scale = 0.5 + pressure;
          $(".finger-" + index)
            .addClass("active")
            .css("transform", "translate3d(" + x + "px," + y + "px,0)");
        }

        function deactiveFinger(index) {
          console.log("=====deactiveFinger=====");
          $(".finger-" + index).removeClass("active");
        }

        function preventHandler(event) {
          event.preventDefault();
        }
        let wheel = {
          count: 0,
          key: null,
          mouseY: null,
        };

        function mouseWheelListener(event) {
          console.log("=====mouseWheelListener=====");
          let e = event;
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          calculateBounds();
          let x = e.pageX - screen.bounds.x;
          let y = e.pageY - screen.bounds.y;
          let pressure = 0.5;
          if (wheel.key === null) {
            // mouse down
            wheel.mouseY = y;
            touchDown(1, x, y, pressure);
            touchCommit();
          } else {
            clearTimeout(wheel.key);
          }
          // 从 wheel.mouseY --> targetY 分10步移动完
          wheel.count += 1;
          const stepCount = 10; // 10 steps
          const direction = e.deltaY > 0 ? -1 : 1;
          const offsetY = wheel.count * direction * 0.2 * screen.bounds.h;
          const targetY = Math.max(0, Math.min(y + offsetY, screen.bounds.h));
          let mouseY = wheel.mouseY;
          const stepY = (targetY - mouseY) / stepCount;
          for (let i = 0; i < stepCount; i += 1) {
            mouseY += stepY;
            touchWait(10); // 间隔10ms
            touchMove(1, x, mouseY, pressure);
            touchCommit();
          }
          wheel.mouseY = targetY; // 记录当前点的位置
          wheel.key = setTimeout(() => {
            // wheel stopped do mouse up
            touchUp();
            touchCommit();
            wheel.key = null;
            wheel.count = 0;
          }, 100);
        }
        /* bind listeners */
        element.addEventListener("mousedown", mouseDownListener);
        element.addEventListener("mousewheel", mouseWheelListener);
        // element.addEventListener('mousemove', mouseHoverListener);
      },
      closeSyncTouchpad() {
        console.log("=====closeSyncTouchpad=====");
        if (this.websockets.touchpad) {
          this.websockets.touchpad.close();
        }
      },
      fitCanvas(canvas) {
        // console.log(canvas,canvas.parentElement, '面板属性')
        // if (canvas.width > canvas.height) {
        //     // 横屏显示，宽高相等
        //     this.canvasStyle.maxHeight = canvas.parentElement.clientHeight + "px";
        //     this.canvasStyle.height = "auto"
        //     this.canvasStyle.width = canvas.parentElement.clientHeight + "px"
        // } else {
        //     this.canvasStyle.maxHeight = "unset"
        //     this.canvasStyle.height = canvas.parentElement.clientHeight + "px"
        //     this.canvasStyle.width = "auto"
        // }
        console.log(canvas.width, "面板属性", canvas.height);
        this.canvasStyle.maxHeight = canvas.height;
        this.canvasStyle.height = canvas.height;
        this.canvasStyle.width = canvas.width;
      },
      drawBlobImageToCanvas(blob, canvas) {
        // 画图，即：显示画面
        // Support jQuery Promise
        var dtd = $.Deferred();
        var ctx = canvas.getContext("2d"),
          URL = window.URL || window.webkitURL,
          BLANK_IMG =
          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
          img = this.imagePool.next();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          this.fitCanvas(canvas);
          // Try to forcefully clean everything to get rid of memory
          // leaks. Note self despite this effort, Chrome will still
          // leak huge amounts of memory when the developer tools are
          // open, probably to save the resources for inspection. When
          // the developer tools are closed no memory is leaked.
          img.onload = img.onerror = null;
          img.src = BLANK_IMG;
          img = null;
          blob = null;
          URL.revokeObjectURL(url);
          url = null;
          dtd.resolve();
        };
        img.onerror = function () {
          // Happily ignore. I suppose this shouldn't happen, but
          // sometimes it does, presumably when we're loading images
          // too quickly.
          // Do the same cleanup here as in onload.
          img.onload = img.onerror = null;
          img.src = BLANK_IMG;
          img = null;
          blob = null;
          URL.revokeObjectURL(url);
          url = null;
          dtd.reject();
        };
        var url = URL.createObjectURL(blob);

        img.src = url;
        return dtd;
      },
      closeWindowWhenReleased(interval) {
        setTimeout(() => {
          if (document.hidden) {
            $.getJSON("/api/v1/user/devices/" + this.udid)
              .done((ret) => {
                this.closeWindowWhenReleased(5000);
              })
              .fail((ret) => {
                let content =
                  "设备" +
                  this.idleTimeout +
                  "秒内没有操作，设备自动释放，点击刷新重新占用该设备";
                this.$alert(content, "设备超时提示", {
                    confirmButtonText: "刷新",
                    type: "warning",
                  })
                  .then(() => {
                    location.reload();
                  })
                  .catch(() => {
                    window.close();
                  });
              });
          } else {
            // $.getJSON("/api/v1/user/devices/" + udid + "/active")
            //     .done((ret) => {
            //         this.closeWindowWhenReleased(interval)
            //     })
            //     .fail(function (ret) {
            //         console.log(ret)
            //         alert("设备可能被释放了，Press F12 to debug")
            //     })
          }
        }, interval);
      },
      initClipboardJS() {
        var clipboard = new ClipboardJS(".clipboard-copy");
        clipboard.on("success", function (e) {
          e.clearSelection();
          showTooltip(e.trigger, "Copied!");
        });
        document.querySelectorAll(".clipboard-copy").forEach((e) => {
          e.addEventListener("mouseleave", clearTooltip);
          e.addEventListener("blur", clearTooltip);
        });

        function clearTooltip(e) {
          const target = e.currentTarget;
          setTimeout(() => {
            target.innerHTML = "";
          }, 200);
        }

        function showTooltip(elem, msg) {
          elem.innerHTML = "&nbsp;<small>" + msg + "</small>";
        }
      },
      refreshTopApp() {
        this.runShell("dumpsys activity top").then((ret) => {
          const reActivity = String.raw `\s*ACTIVITY ([A-Za-z0-9_.]+)\/([A-Za-z0-9_.]+) \w+ pid=(\d+)`;
          let matches = ret.output.match(new RegExp(reActivity, "g"));
          if (matches.length > 0) {
            let m = matches.pop().match(new RegExp(reActivity));
            this.topApp.packageName = m[1];
            this.topApp.activity = m[2];
            this.topApp.pid = m[3];
          }
        });
      },
      // 业务列表请求
      getBusinessListData() {
        let params = {
          pageNum: 1,
          pageSize: 999
        };
        getBusinessList(params).then((res) => {
          if (res.error_code === 200) {
            let data = res.data;
            this.businessListData =
              data.records && data.records.length > 0 ? data.records : [];
            console.log(this.businessListData, "业务数据");
          }
        });
      },
      // 上传文件
      uploadFile(filename, filecontent) {
        let formData = new FormData(),
          file = new File([filecontent], filename, {
            type: "text/plain"
          });

        formData.append("file", file);
        uploadFile(formData).then((res) => {
          if (res.error_code) {
            // this.form.scriptFileUrl = res.data.fileUrl
            this.scriptForm.uploadUrl = res.data;
            console.log(this.scriptForm.uploadUrl, res, "文件值");
          }
        });
      },
      // 下载文件
      downloadFile(filename, filecontent) {
        let file = new File([filecontent], filename, {
            type: "text/plain"
          }),
          link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = filename; // 这里填保存成的文件名
        link.click();
        URL.revokeObjectURL(link.href);
      },
      // 执行脚本
      trancribeScript() {
        let ws = this.ws4,
          date = new Date(),
          todayTime = parseTime(date, "{y}{m}{d}{h}{i}{s}"),
          fileName = "filename" + todayTime + "text.txt",
          fileStrig =
          JSON.stringify({
            packageName: this.topApp.packageName,
            activity: this.topApp.activity,
          }) +
          "\n" +
          this.fileStrig;
        this.uploadFile(fileName, fileStrig);
        // this.downloadFile(fileName, fileStrig)
      },
      // 开始录制
      startRecord() {
        let udid = this.udid,
          ws = this.ws4;

        let id = this.$route.query.id;
        updateSlide({
          id
        }).then((res) => {
          if (res.error_code === 200) {
            console.log("操作成功！");
          }
        });
        // 发送请求
        ws.send(
          JSON.stringify({
            mCurrentFocus: true,
            deviceID: udid,
          })
        );
        // 成功后监听
        ws.onmessage = (message) => {
          let data = message.data ? JSON.parse(message.data) : {};
          let appCurrentINFO = data.appCurrentINFO ?
            data.appCurrentINFO.split("/") : ["", ""];
          this.topApp.packageName = appCurrentINFO[0];
          this.topApp.activity = appCurrentINFO[1];
        };
      },
      // 停止录制
      stopRecord() {},
      // 保存录制操作
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            uploadCallback(this.form).then((res) => {
              if (res.error_code === 200) {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "保存录制脚本成功",
                  type: "success",
                  duration: 1500,
                });
              }
            });
          }
        });
      },
      // 保存脚本提交
      scriptOnSubmit(formName) {
        if (!this.scriptForm.uploadUrl) {
          this.$message.warning("没有找到要上传的录制脚本");
          return;
        }
        console.log(this.appInstallRuleForm.appSelected, "22");
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                let params = Object.assign(this.scriptForm, {
                  scriptType: 2,
                  appId: this.appInstallRuleForm.appSelected,
                });
                saveRecordingScript(params).then((res) => {
                  if (res.error_code === 200) {
                    this.$refs[formName].resetFields();
                    this.scriptForm.uploadUrl = null;
                    this.inputSwipe = [];
                    this.$message({
                      message: "保存录制脚本成功",
                      type: "success",
                      duration: 1500,
                    });
                  }
                });
              }
            });
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 文件上传成功调用
      handleOnsuccess(res, file, fileList) {
        if (res.error_code === 200) {
          this.form.apkFileUrl = res.data.fileUrl;
        }
      },
      // 鼠标滑动坐标传输
      sendPointFun(params) {
        sendPoint(params).then((res) => {
          console.log(res, "返回内容");
        });
      },
      // 开始录制 - 新版本
      startRecordAction() {
        this.$alert("开始录制后，为保证数据准确，请勿刷新或切换网页", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          this.getInstallAppFetch();
          this.appInstallDialogVisible = true;
          this.appInstallRuleForm.appSelected = null;
        });
      },
      // 停止录制脚本 - 新版本
      stopRecordAction() {
        let date = new Date(),
          todayTime = parseTime(date, "{y}{m}{d}{h}{i}{s}"),
          fileName = "filename" + todayTime + "text.py";
        this.isRecord = false;
        if (this.inputSwipeArr.length == 0) {
          this.isLu = false;
          return;
        }
        this.uploadFile(fileName, this.textAction(this.inputSwipeArr));
      },
      // 处理录制文本
      textAction(inputSwipeArr) {
        let endSymbol = "\n\ttime.sleep(5)\n\t";
        let startStr =
          'import os\nimport sys\nimport time\nimport uiautomator2 as ut2\nsys.path.append(os.path.dirname(os.path.abspath(__file__)))\ndef main():\n\tdevice_serial="0.0.0.0:7912"\n\tapk="' +
          this.appPackageName +
          '"\n\td=ut2.connect(device_serial)\n\td.app_start(apk, stop=True)' +
          endSymbol;
        inputSwipeArr.map((f) => {
          if (f.x1 == f.x2 && f.y1 == f.y2) {
            startStr += "d.click(" + f.x1 + "," + f.y1 + ")" + endSymbol;
          } else {
            startStr +=
              "d.swipe(" +
              f.x1 +
              "," +
              f.y1 +
              "," +
              f.x2 +
              "," +
              f.y2 +
              ")" +
              endSymbol;
          }
        });
        startStr += 'd.press("back")\nmain()\n1/0';
        return startStr;
      },
      // 重置表单
      appOnclose(formName) {
        // this.$refs[formName].resetFields();
      },
      // 获取设备已安装应用
      getInstallAppFetch() {
        getInstallApp({
          deviceId: this.deviceNewId
        }).then((res) => {
          if (res.error_code === 200) {
            this.appListData = res.data ? res.data : [];
          }
        });
      },
      // 选择应用请求
      submitScript() {
        if (!this.appInstallRuleForm.appSelected) {
          this.$message.warning("请选择应用!");
          return;
        }
        let params = {
          deviceId: this.deviceNewId,
          appId: this.appInstallRuleForm.appSelected,
        };
        openApp(params).then((res) => {
          if (res.error_code === 200) {
            this.inputSwipe = [];
            this.$message.success("应用打开成功,录屏开始");
            this.appInstallDialogVisible = false;
            this.isRecord = true;
            this.isLu = true;
            this.appPackageName = this.appListData.find(
              (f) => f.appId == this.appInstallRuleForm.appSelected
            ).appPackageName;
            this.appPackageName = this.appPackageName ?
              this.appPackageName.substr(0, this.appPackageName.indexOf("/")) :
              "";
          }
        });
      },
    },
    mounted: function () {
      this.firstE();
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://cdn.jsdelivr.net/npm/moment@2.23.0/moment.min.js";
      document.body.appendChild(s);

      this.canvas.bg = this.$refs.bgCanvas;
      this.canvas.fg = this.$refs.fgCanvas;
      let ctx = this.canvas.bg.getContext("2d");
      this.openDisplayTouchpad();

      new ResizeSensor(this.canvas.bg.parentElement, (e) => {
        this.fitCanvas(this.canvas.bg);
      });
      // 常用功能面板 自适应
      new ResizeSensor(this.$refs.commonContainer, (e) => {
        let el = this.$refs.commonContainer;
        if (e.width < 750) {
          el.style.columnCount = 1;
        } else {
          el.style.columnCount = 2;
        }
      });
      let mousedownx, mousedowny, mouseupx, mouseupy;
      // 点击事件处理
      // this.canvas.bg.addEventListener('click', e => {
      //     let x = e.pageX - this.canvas.bg.getBoundingClientRect().left;
      //     let y = e.pageY - this.canvas.bg.getBoundingClientRect().top;
      //     console.log(e,e.pageX,e.pageY,x,y,this.canvas.bg.getBoundingClientRect().left, this.canvas.bg.getBoundingClientRect().top,'点击事件获取坐标')
      // })
      // 鼠标按下事件
      this.canvas.bg.addEventListener("mousedown", (e) => {
        mousedownx = e.pageX - this.canvas.bg.getBoundingClientRect().left;
        mousedowny = e.pageY - this.canvas.bg.getBoundingClientRect().top;
        this.isMouseMove = true;
        this.newMousedownx = mousedownx;
        this.newMousedowny = mousedowny;
        let wx = this.ws4;
        if (wx.readyState != wx.OPEN) {
          console.log("连接已中断!");
          return false;
        }
        let element = this.canvas.bg; // maybe fg is better
        let el = element;
        let screen = {
          bounds: {},
        };
        screen.bounds.w = el.offsetWidth;
        screen.bounds.h = el.offsetHeight;
        screen.bounds.x = 0;
        screen.bounds.y = 0;
        let scaled = this.coords1(
          screen.bounds.w,
          screen.bounds.h,
          this.newMousedownx,
          this.newMousedowny,
          this.rotation
        );
        wx.send(
          JSON.stringify({
            operation: "d",
            index: 0,
            deviceID: this.deviceNewId,
            pressure: 0.5,
            xP: scaled.xP,
            yP: scaled.yP,
          })
        );
        wx.send(JSON.stringify({
          operation: "c",
          deviceID: this.deviceNewId
        }));
      });
      this.canvas.bg.addEventListener("mousemove", (e) => {
        //判断是否允许发送坐标
        if (this.isMouseMove) {
          let NewMouseupx = e.pageX - this.canvas.bg.getBoundingClientRect().left; //新的坐标点
          let NewMouseupy = e.pageY - this.canvas.bg.getBoundingClientRect().top; // 新的坐标点
          //是否是第一次移动
          if (this.isStartMove) {
            this.isStartMove = false;
            this.NewMouseupx = NewMouseupx;
            this.NewMouseupy = NewMouseupy;
          } else {
            this.newMousedownx = this.NewMouseupx; //获取上次的坐标点
            this.newMousedowny = this.NewMouseupy; //获取上次的坐标点
            this.NewMouseupx = NewMouseupx;
            this.NewMouseupy = NewMouseupy;
          }
          // let params = {
          //     deviceId: this.deviceNewId,
          //     type: (this.newMousedownx == this.NewMouseupx && this.newMousedowny == this.NewMouseupy) ? 0 : 1,
          //     x1:(this.newMousedownx * 1.6).toFixed(2),
          //     y1: (this.newMousedowny * 1.6).toFixed(2),
          //     x2: (this.NewMouseupx * 1.6).toFixed(2),
          //     y2: (this.NewMouseupy * 1.6).toFixed(2),
          //     time: 0,
          // }
          let element = this.canvas.bg; // maybe fg is better
          let el = element;
          let screen = {
            bounds: {},
          };
          screen.bounds.w = el.offsetWidth;
          screen.bounds.h = el.offsetHeight;
          screen.bounds.x = 0;
          screen.bounds.y = 0;
          if (this.$route.query.deviceStatus == 2) return;
          let x = this.newMousedownx - this.NewMouseupx;
          let y = this.newMousedowny - this.NewMouseupy;
          let scaled = this.coords1(
            screen.bounds.w,
            screen.bounds.h,
            this.NewMouseupx,
            this.NewMouseupy,
            this.rotation
          );
          let wx = this.ws4;
          if (wx.readyState != wx.OPEN) {
            console.log("连接已中断!");
            return false;
          }
          wx.send(
            JSON.stringify({
              operation: "w",
              deviceID: this.deviceNewId,
              milliseconds: 10,
            })
          );
          wx.send(JSON.stringify({
            operation: "c",
            deviceID: this.deviceNewId
          }));
          wx.send(
            JSON.stringify({
              operation: "m",
              index: 0,
              deviceID: this.deviceNewId,
              pressure: 0.5,
              xP: scaled.xP,
              yP: scaled.yP,
            })
          );
          wx.send(JSON.stringify({
            operation: "c",
            deviceID: this.deviceNewId
          }));
        }
      });
      // 鼠标松开事件
      this.canvas.bg.addEventListener("mouseup", (e) => {
        this.isMouseMove = false;
        let wx = this.ws4;
        wx.send(
          JSON.stringify({
            operation: "u",
            deviceID: this.deviceNewId,
          })
        );
        wx.send(JSON.stringify({
          operation: "c",
          deviceID: this.deviceNewId
        }));
        mouseupx = e.pageX - this.canvas.bg.getBoundingClientRect().left;
        mouseupy = e.pageY - this.canvas.bg.getBoundingClientRect().top;
        let params = {
          deviceId: this.deviceNewId,
          type: mousedownx == mouseupx && mousedowny == mouseupy ? 0 : 1,
          x1: (mousedownx * 1.6).toFixed(2),
          y1: (mousedowny * 1.6).toFixed(2),
          x2: (mouseupx * 1.6).toFixed(2),
          y2: (mouseupy * 1.6).toFixed(2),
          time: 0,
        };
        //坐标发送
        // this.$route.query.deviceStatus != 2 && this.sendPointFun(params);
        let shellStr;
        let inputSwipe = this.inputSwipe ? this.inputSwipe : [];
        if (this.$route.query.deviceStatus == 2) return;
        if (mousedownx == mouseupx && mousedowny == mouseupy) {
          shellStr = "input tap " + params.x1 + " " + params.y1;
        } else {
          shellStr =
            "input swipe " +
            params.x1 +
            " " +
            params.y1 +
            " " +
            params.x2 +
            " " +
            params.y2;
        }
        let newShellStr;
        if (mousedownx == mouseupx && mousedowny == mouseupy) {
          newShellStr = `d.click(${params.x1},${params.y1})`;
        } else {
          newShellStr = `d.swipe(${params.x1},${params.y1},${params.x2},${params.y2})`;
        }
        // this.runShell(shellStr);
        this.insertInputTxt("textarea", newShellStr + "\r\n");
        console.log(shellStr);
        if (this.isRecord) {
          inputSwipe.push(shellStr);
          this.inputSwipeArr.push(params);
        }
        this.inputSwipe = this.textarea;
      });
      this.canvas.bg.addEventListener("contextmenu", (event) =>
        event.preventDefault()
      );
      // save the bandwidth
      document.addEventListener("visibilitychange", () => {
        let pageHidden = document.hidden;
        if (pageHidden) {
          this.closeDisplayTouchpad();
        } else {
          this.openDisplayTouchpad();
        }
      });
      // 更新使用时间
      setInterval(() => {
        let duration = moment.now() - moment(this.usingBeganAt);
        // this.$refs.usingTime.innerHTML = moment.utc(duration).format("HH:mm:ss")
      }, 1000);
      // 唤醒屏幕
      this.runKeyevent("WAKEUP");
      // 加载用户配置
      // this.loadUserSettings()
      // 加载whatsinput输入法
      // this.loadWhatsinput()
      // 当设备不使用时自动退出
      console.log("Refresh:", (this.idleTimeout / 2) * 1000);
      this.closeWindowWhenReleased(5000);
      this.initClipboardJS();
      this.time = setInterval(() => {
        this.refreshWebsocket();
      }, 20000);
    },
    destroyed() {
      clearInterval(this.time); // 清除定时器
      this.time = null;
    },
    computed: {
      address() {
        // let agentAtxAddress = "100.168.20.76:42088"
        // let agentAtxAddress = this.$route.params.addressIp;
        let agentAtxAddress = window.sessionStorage.getItem("deviceIp");
        agentAtxAddress = agentAtxAddress ? agentAtxAddress + ":7912" : "";
        console.log(agentAtxAddress, "有一个地址");
        return agentAtxAddress;
      },
      deviceUrl() {
        return "http://" + this.address;
      },
      remoteTerminal() {
        return "http://" + this.address + "/term";
      },
      screenshotUrl() {
        return "http://" + this.address + "/screenshot/0";
      },
      remoteConnectAddr() {
        return "adb connect ";
      },
      whatsInputUrl() {
        return "ws://192.168.1.110:9998";
      },
      displayLinked() {
        return this.websockets.screen !== null;
      },
    },
    components: {
      "term-snippet": {
        props: {
          command: String,
          term: Object,
        },
        methods: {
          run() {
            this.term.emit("data", this.command + "\n");
            this.term.focus();
          },
        },
        template: '<code style="cursor: pointer" @click="run" v-text="command"></code>',
      },
      "remote-js": {
        render(createElement) {
          return createElement("script", {
            attrs: {
              type: "text/javascript",
              src: this.src
            },
          });
        },
        props: {
          src: {
            type: String,
            required: true
          },
        },
      },
    },
  };

</script>


<style "utf-8">
  @import "./remotecontrol.scss";

  .table-c table {
    border-bottom: 1px solid #000000;
    border-top: 1px solid #000000;
    border-right: 1px solid #000000;
  }

  .table-c table td {
    border-left: 1px solid #000000;
    line-height: 30px;
  }

  .td1 {
    width: 160px;
    height: 60px;
    border-bottom: 1px solid #000000;
  }

  .td2 {
    width: 690px;
  }

  .td3 {
    width: 250px;
  }

  .td2 .td3 {
    text-align: center;
    margin: auto 20px;
  }

  .td5 {
    border-bottom: 1px dashed #000000;
  }

  .td6 {
    border-bottom: 1px solid #000000;
  }

  .span1 {}

  .info-all-all {
    padding: 24px 0;
    border-top: 1px solid #eee;
    margin-top: 12px;
    display: flex;
    border-bottom: 1px solid #eee;
  }

  .info-all-all-echart>div {
    margin-bottom: 40px;
    border-top: 1px solid #eee;
    padding-top: 40px;
  }

  .info-all {}

  .info-all-right {
    flex: 1;
    margin-left: 100px;
  }

  .info-all-right>div>div {
    margin-bottom: 10px;
  }

  .info-content {
    display: flex;
  }

  .info-content>div {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    text-align: center;
  }

  .info-content>div>span:nth-child(1) {
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 2px;
    margin-bottom: 12px;
  }

  .info-content>div>span:nth-child(2) {
    color: #999;
    font-size: 12px;
  }

  .all-border-top {
    color: #999;
    font-size: 14px;
    display: inline-block;
    margin-bottom: 5px;
  }

  .all-border {
    height: 10px;
    width: 80%;
    background-color: #eee;
    position: relative;
  }

  .all-border-width {
    position: absolute;
    left: 0;
    top: 0;
    height: 10px;
    width: 50%;
    background-color: #1890ff;
  }

</style>

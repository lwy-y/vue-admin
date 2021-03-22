<template>
  <div class="oat-container">
    <el-card>
      <div slot="header">
        <span>OAT升级</span>
        <el-button style="float: right; margin-top: -10px" type="primary">上传升级文件</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="data" label="日期">
          </el-table-column>
          <el-table-column prop="edition" label="硬件版本">
          </el-table-column>
          <el-table-column prop="devicesNum" label="当前版本设备数">
          </el-table-column>
          <el-table-column prop="address" label="下载地址">
          </el-table-column>
          <el-table-column prop="type" label="状态">
            <template slot-scope="prop">
              <div>{{ prop.row.type ? "已发布" : "未发布" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="configButton(scope.row)">发布</el-button>
              <el-button size="small" type="text" style="color: red" @click="configButton(scope.row)">删除</el-button>
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
        tableData: [{
          data: "2021-01-05 12:12:12",
          name: 'crius01-userdebug 7.1.2 nhg47k eng.hotech.20200623.205731 test-keys',
          devicesNum: 10,
          address: '192.168.1.11',
          type: 0,
          id: 1,
        }, {
          data: "2021-01-05 12:12:12",
          name: 'crius01-userdebug 7.1.2 nhg47k eng.hotech.20200623.205731 test-keys',
          devicesNum: 10,
          address: '192.168.1.11',
          type: 0,
          id: 2,
        }, {
          data: "2021-01-05 12:12:12",
          name: 'crius01-userdebug 7.1.2 nhg47k eng.hotech.20200623.205731 test-keys',
          devicesNum: 10,
          address: '192.168.1.11',
          type: 0,
          id: 3,
        }, ],
        rowData: {},
        radio: '',
        outerVisible: false,
        innerVisible: false,
        formRawData,
        form,
        rules: {
          ip: [{
            required: true,
            message: '请输入IP',
            trigger: 'blur'
          }],
          subnetMask: [{
            required: true,
            message: '请输入子网掩码',
            trigger: 'blur'
          }],
          gateway: [{
            required: true,
            message: '请输入网关',
            trigger: 'blur'
          }],
          dns1: [{
            required: true,
            message: '请输入DNS1',
            trigger: 'blur'
          }],
          dns2: [{
            required: true,
            message: '请输入DNS2',
            trigger: 'blur'
          }],
        },
      };
    },
    methods: {
      configButton(data) {
        this.rowData = {
          ...data
        }
        this.outerVisible = true
      },
      outerButton() {
        if (this.radio) {
          this.innerVisible = true
        } else {
          this.outerVisible = false
        }
      },
      innerButton(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert("submit!");
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
  .oat {
    &-container {
      margin: 30px;
    }

  }

</style>

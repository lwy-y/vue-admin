<template>
  <div class="user-container" v-loading="loading">
    <!-- 添加本地用户 -->
    <el-card class="mb24">
      <!-- card-title -->
      <div slot="header">
        <span>添加本地用户</span>
      </div>
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="uname" class="minW8">
            <el-col :span="5" class="minW3">
              <el-input v-model="ruleForm.uname" autocomplete="off"></el-input>
            </el-col>
            <el-col :offset="1" :span="5" class="minW3">
              <span>1~32个字符，只能包含英文字母，数字，下划线</span>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="upassword" class="minW8">
            <el-col :span="5" class="minW3">
              <el-input show-password v-model="ruleForm.upassword" autocomplete="off"></el-input>
            </el-col>
            <el-col :offset="1" :span="5" class="minW3">
              <span>1~32个字符，不能包含空格</span>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="ustatus">
            <el-select v-model="ruleForm.ustatus" placeholder="请选择">
              <el-option label="在用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级" prop="utype">
            <el-select v-model="ruleForm.utype" placeholder="请选择">
              <el-option label="管理员" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 添加本地用户 结束-->

    <!-- 本地用户管理 -->
    <el-card>
      <!-- card-title -->
      <div slot="header">
        <span>本地用户管理</span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="uname" label="用户名"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ convertState(scope.row, "ustatus") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">
            <span>{{ convertState(scope.row, "utype") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="editBottom(scope.row, 'ruleForm')">修改</el-button>
            <el-button size="small" type="info" v-if="scope.row.uid != 6" @click="deleteBottom(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 本地用户管理 结束-->
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import {
    getUserList,
    saveUser
  } from "@/api/user"

  export default {
    name: "User",
    computed: {
      ...mapGetters(["name"]),
    },
    created() {
      this.getUserList()
    },
    data() {
      const ruleFormOriginal = {
        uname: "",
        upassword: "",
        ustatus: "",
        utype: "",
      };
      let ruleForm = {
        ...ruleFormOriginal
      };
      return {
        loading: true,
        ruleFormOriginal,
        ruleForm,
        rules: {
          uname: [{
              required: true,
              message: "请填写用户名!",
              trigger: "blur"
            },
            {
              min: 1,
              max: 32,
              message: "请填写1~32个字符!"
            },
            {
              pattern: /^\w+$/,
              message: "只能输入字母，数字，下划线!",
              trigger: "change",
            },
          ],
          upassword: [{
              required: true,
              message: "请填写密码!",
              trigger: "blur"
            },
            {
              min: 1,
              max: 32,
              message: "请填写1~32个字符!"
            },
            {
              pattern: /^\S+$/,
              message: "不能包含空格!",
              trigger: "change"
            },
          ],
          ustatus: [{
            required: true,
            message: "请选择状态!",
            trigger: "blur"
          }],
          utype: [{
            required: true,
            message: "请选择等级!",
            trigger: "blur"
          }],
        },
        tableData: [],
      };
    },
    methods: {
      /**
       * 获取用户列表
       */
      getUserList() {
        this.loading = true
        getUserList().then(res => {
          this.tableData = res.data ? res.data : []
          this.loading = false
        })
      },
      /**
       * 保存用户信息 data
       */
      saveUser(data) {
        saveUser(data).then(res => {
          if (res.retCode === 200) {
            this.$message({
              message: data.isDelete ? "用户删除成功" : (data.uid ? '用户修改成功' : '用户新建成功'),
              type: 'success'
            });
          }
          this.resetForm('ruleForm')
          this.getUserList()
        })
      },
      /**
       * 点击表单确定按钮
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = Object.assign({}, {
              ...this.ruleForm
            })
            data.uid = parseInt(data.uid)
            this.saveUser(data)
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
        // console.log(this.$refs[formName], this.ruleForm);
      },
      /**
       * 重置表单||点击表单取消按钮
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.ruleForm = Object.assign({}, {
          ...this.ruleFormOriginal
        });
      },
      /**
       * 转换表格数据
       * data:num, parmas:string
       */
      convertState(data, parmas = String) {
        const obj = {
          ustatus: {
            0: "在用",
          },
          utype: {
            1: "管理员",
          },
        };
        return obj[parmas][data[parmas]];
      },
      /**
       * 点击修改按钮
       */
      editBottom(row, formName) {
        this.resetForm(formName);
        this.ruleForm = Object.assign(this.ruleForm, {
          ...row
        });
      },
      /**
       * 点击删除按钮
       */
      deleteBottom(row) {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            let data = Object.assign({
              ...row
            }, {
              isDelete: 1
            })
            this.saveUser(data)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
    },
  };

</script>

<style lang="scss" scoped>
  @import "~@/styles/comment.scss";

  .user {
    &-container {
      margin: 30px;
    }
  }

</style>

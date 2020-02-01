<template>
  <div>
    <el-row :gutter="25">
      <el-col :span="7">
        <el-input
          placeholder="请输入姓名、曾用名、身份证搜索"
          v-model="search"
          @keyup.enter.native="plist(search)"
          @clear="plist(search)"
          clearable>
          <el-button slot="append" icon="el-icon-search" @click="plist(search)"/>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addfrom">添加数据</el-button>
      </el-col>
    </el-row>
    <!--  数据内容  -->
    <el-table
      :data="datalist"
      height="580"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="idnumber" label="身份证" width="180" align="center"/>
      <el-table-column prop="name" label="姓名" width="100" align="center"/>
      <el-table-column prop="sex" label="性别" width="50" align="center"/>
      <el-table-column prop="birthday" label="生日" width="150" align="center"/>
      <el-table-column label="年龄" width="80" align="center">
        <template slot-scope="scope">
          {{getAge(scope.row.birthday)}}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="150" align="center"/>
      <el-table-column prop="home" label="通讯地址" width="350" align="center"/>
      <el-table-column prop="zhuangtai" label="人员状态" width="250" align="center"/>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template slot-scope="scope">
          {{scope.row.user}}
          <el-tooltip class="item" effect="dark" content="修改" placement="left" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="right" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页控制  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="p"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>

    <!-- 添加数据提示框 -->
    <el-dialog
      title="添加个人数据"
      :visible.sync="addData"
      width="60%"
      center>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写数据" description="填写数据"/>
        <el-step title="检查数据" description="检查数据"/>
      </el-steps>
      <el-card v-if="active===0">
        <!--  内容区域  -->
        <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="80px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item>
                <el-switch
                  v-model="addswitch"
                  active-text="选择未分配账号"
                  inactive-text="直接创建账号" @change="addswitchm">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号" v-if="addswitch" prop="user">
                <el-select v-model="addForm.user" placeholder="请选择未分配账号">
                  <el-option label="不创建" value="1"/>
                  <el-option label="区域二" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="身份证" prop="idnumber">
                <el-input v-model="addForm.idnumber"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="户籍地址" prop="permanent">
                <el-input v-model="addForm.permanent"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通讯地址" prop="home">
                <el-input v-model="addForm.home"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!--        <el-form-item>-->
          <!--          <el-button @click="quxiao('addForm')">取 消</el-button>-->
          <!--          <el-button @click="submitForm('addForm')" type="primary">下一步</el-button>-->
          <!--        </el-form-item>-->
        </el-form>
      </el-card>
      <!--  数据确认区域  -->
      <el-card v-if="active===1">
        <el-form label-width="80px">
          {{addForm}}
          <!--        <el-form-item>-->
          <!--          <el-button style="margin-top: 12px;" @click="prev">上一步</el-button>-->
          <!--          <el-button type="primary" @click="tijiao('addForm')">提 交</el-button>-->
          <!--        </el-form-item>-->
        </el-form>
      </el-card>
      <!--  底部确认区域  -->
      <span slot="footer" class="dialog-footer">
          <el-button @click="quxiao('addForm')" v-if="active===0">取  消</el-button>
          <el-button style="margin-top: 12px;" @click="prev" v-if="active!==0">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="submitForm('addForm')" v-if="active!==1">下一步</el-button>
          <el-button type="primary" @click="tijiao('addForm')" v-if="active===1">提  交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Username',
  data () {
    return {
      search: '',
      p: 1,
      page_size: 10,
      datalist: [],
      count: null,
      // 添加数据
      // addselect: true,
      addswitch: false,
      formpassword: true,
      addData: false,
      active: 0,
      addForm: {},
      addrules: {
        user: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        named: [
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        idnumber: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { min: 18, max: 18, message: '长为18个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长为11个字符', trigger: 'blur' }
        ],
        permanent: [
          { required: true, message: '请输入户籍地址', trigger: 'blur' }
        ],
        home: [
          { required: true, message: '请输入通讯地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    plist: async function (search, size, p) {
      await this.$http.get('PersonalInformationList', {
        params: {
          search: search,
          page_size: size,
          p: p
        }
      })
        .then(req => {
          this.datalist = req.data.results
          this.count = req.data.count
          if (req.data.count === 0) {
            this.$message.warning('无数据')
          }
        })
        .catch(error => {
          this.$message.warning('获取数据失败')
          console.log(error)
        })
    },
    getAge (teacherBirthday) {
      // 根据生日判断用户年龄
      let birthdays = new Date(teacherBirthday.replace(/-/g, '/'))
      let d = new Date()
      return d.getFullYear() -
        birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() ||
        (d.getMonth() === birthdays.getMonth() &&
          d.getDate() < birthdays.getDate())
          ? 1
          : 0)
    },
    handleSizeChange (val) {
      this.page_size = val
      this.p = 1
      this.plist(this.search, this.page_size, this.p)
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.p = val
      this.plist(this.search, this.page_size, this.p)
      console.log(`当前页: ${val}`)
    },
    quxiao (formName) {
      this.addswitch = false
      this.addData = false
      this.$refs[formName].resetFields()
      this.addForm = { 'user': 1 }
    },
    tijiao () {
      this.addswitch = false
      this.addData = false
    },
    addfrom () {
      this.active = 0
      this.addData = true
      this.addForm = { 'user': 1 }
    },
    changpass () {
      // 判断是否显示明文密码
      this.formpassword = !this.formpassword
    },
    addswitchm () {
      // 判断是否可以选择账号
      if (!this.addswitch) {
        // this.addForm = {}
        this.addForm.user = 1
      } else {
        this.addForm.user = ''
      }
    },
    prev () {
      if (--this.active > 1) this.active = 0
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.active++ > 1) this.active = 0
        } else {
          console.log('error submit!!')
          this.$message.warning('数据错误')
          return false
        }
      })
    }
  },
  created () {
    this.plist()
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 90%;
  height: 62px;
}
</style>

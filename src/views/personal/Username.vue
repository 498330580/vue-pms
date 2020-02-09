<template>
    <div>
        <!--  表头  -->
        {{fenzu}}
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
        <!--  数据内容(表格)  -->
        <el-table
                :data="datalist"
                height="580"
                border
                stripe
                style="width: 100%" @filter-change="filterChange">
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
            <el-table-column prop="dangtuans[0].politics.name" label="政治面貌" width="80" align="center"/>
            <el-table-column prop="mobile" label="电话" width="150" align="center"/>
            <el-table-column prop="permanent" label="户籍地址" width="330" align="center"/>
            <el-table-column prop="jiguan.jiguan" label="籍贯" width="110" align="center"/>
            <el-table-column prop="home" label="通讯地址" width="330" align="center"/>
            <el-table-column prop="drivinglicense.name" label="驾照" width="80" align="center"/>
            <el-table-column prop="yonggongs[0].zhuangtai.name" label="人员状态" width="80" align="center"/>
            <el-table-column prop="yonggongs[0].shenfenguilei.name" label="人员类别" width="80" align="center"/>
            <el-table-column prop="dadui.name" label="所属大队" width="80" align="center"
                             :filters="dadui" :column-key="'dadui'" :filter-multiple="false"/>
            <el-table-column prop="fenzu.name" label="所属中队" width="110" align="center"
                             :filters="fenzu" :column-key="'fenzu'" :filter-multiple="false"/>
            <el-table-column prop="jiediao.name" label="是否借调" width="130" align="center"/>
            <el-table-column prop="bianzhi.name" label="编制位置" width="80" align="center"/>
            <el-table-column label="操作" align="center" fixed="right" width="180">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="修改" placement="left" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.idnumber)"/>
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

        <!-- 修改数据弹窗 -->
        <el-dialog
                title="修改数据"
                :visible.sync="modifyData" label-width="70px"
                width="60%" :show-close="false" :destroy-on-close="true" :close-on-press-escape="false"
                :close-on-click-modal="false"
                center>
            <el-form :model="modifyinfo" :rules="addrules" ref="modifyinfo" label-width="80px" :disabled="fromdisabled">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="账号" prop="user">
                            <el-select v-model="modifyinfo.user"
                                       :disabled="modifydisabled">
                                <el-option v-for="user in dataselect" :key="user.id" :label=user.username
                                           :value="user.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="modifyinfo.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="modifyinfo.mobile"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证" prop="idnumber">
                            <el-input v-model="modifyinfo.idnumber"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="户籍地址" prop="permanent">
                            <el-input v-model="modifyinfo.permanent"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通讯地址" prop="home">
                            <el-input v-model="modifyinfo.home"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="fromdisabled">
              <el-button @click="modifyquxiao">关  闭</el-button>
              <el-button type="primary" @click="fromdisabled = false">修  改</el-button>
            </span>
            <span slot="footer" class="dialog-footer" v-else>
              <el-button @click="modifyquxiao">取 消</el-button>
              <el-button type="primary" @click="modifytijiao">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加数据提示框 -->
        <el-dialog
                title="添加个人数据"
                :visible.sync="addData"
                width="60%" :show-close="false" :destroy-on-close="true" :close-on-press-escape="false"
                :close-on-click-modal="false" :close="xiaohui"
                center>
            <!--  内容区域  -->
            <el-form :model="modifyinfo" :rules="addrules" ref="addForm" label-width="80px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="账号" prop="user">
                            <el-select v-model="modifyinfo.user" :disabled="modifydisabled">
                                <el-option v-for="user in dataselect" :key="user.id" :label=user.username
                                           :value="user.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="modifyinfo.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="modifyinfo.mobile"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证" prop="idnumber">
                            <el-input v-model="modifyinfo.idnumber"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="户籍地址" prop="permanent">
                            <el-input v-model="modifyinfo.permanent"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通讯地址" prop="home">
                            <el-input v-model="modifyinfo.home"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--  底部确认区域  -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="quxiao">取  消</el-button>
              <el-button type="primary" @click="tijiao">提  交</el-button>
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
      // 大队中队小组分类数据
      dadui: [],
      fenzu: [],
      filters: {},
      // 是否可以添加数据
      adddisabled: true,
      // 表单是否可编辑
      fromdisabled: true,
      // 修改数据
      // 判断是否弹窗
      modifyData: false,
      // 数据
      modifyinfo: {},
      modifydisabled: true,
      // 添加数据
      // 未分配账号列表
      dataselect: [],
      // 判断弹出框是否关闭
      addData: false,
      // 表单验证
      addrules: {
        user: [
          { required: true, message: '请选择账号', trigger: 'change' }
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
          // { type: 'number', message: '请输入数字', trigger: 'blur' },
          { min: 18, max: 18, message: '长为18个字符', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { type: 'number', message: '请输入数字', trigger: 'blur' },
          { min: 11, max: 11, message: '长为11个字符', trigger: 'blur' },
          {
            pattern: /^1([3456789])\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
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
    // 大队中队分类数据获取
    async daduizhongdilist (category, id) {
      await this.$http.get('DaduiZhongduiTypeList', {
        params: {
          category_type: category,
          parent_category: id
        }
      }).then(req => {
        const persons = req.data
        if (category === '大队') {
          for (let i = 0; i < persons.length; i++) {
            const dic = {}
            // console.log(persons[i])
            dic['text'] = persons[i].name
            dic['value'] = persons[i].id
            this.dadui.push(dic)
          }
        } else {
          for (let i = 0; i < persons.length; i++) {
            const dic = {}
            // console.log(persons[i])
            dic['text'] = persons[i].name
            dic['value'] = persons[i].id
            this.fenzu.push(dic)
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message.warning('获取大队、中队数据失败')
        return []
      })
    },
    // 人员信息获取
    plist: async function (search, size, p, dadui, fenzu) {
      await this.$http.get('PersonalInformationList', {
        params: {
          search: search,
          page_size: size,
          p: p,
          dadui: dadui,
          fenzu: fenzu
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
    // 获取当前用户数据
    async userone (id) {
      this.$http.get('UserInformation/' + id).then(req => {
        if (req.status === 200) {
          this.dataselect.unshift(req.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 未启用账号获取
    async userlist (usernameid) {
      await this.$http.get(
        'UserInformationNoneList'
      ).then(req => {
        if (req.data.length === 0) {
          // 不存在多个未分配账号
          this.modifydisabled = true
          if (usernameid) {
            this.userone(usernameid)
          }
        } else {
          // 存在多个未分配账号
          this.dataselect = req.data
          let staff = window.sessionStorage.getItem('pms')
          let superuser = window.sessionStorage.getItem('superuser')
          if (usernameid) {
            this.userone(usernameid)
          } else {
            this.dataselect.unshift({ 'id': 1, 'username': '自动生成账号' })
          }
          this.modifydisabled = !(staff || superuser)
        }
      }
      ).catch(err => {
        console.log(err)
      })
    },
    // 根据生日判断用户年龄
    getAge (teacherBirthday) {
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
    // 页面数据条数判断
    handleSizeChange (val) {
      this.page_size = val
      this.p = 1
      this.plist(this.search, this.page_size, this.p)
      console.log(`每页 ${val} 条`)
    },
    // 页码判断
    handleCurrentChange (val) {
      this.p = val
      this.plist(this.search, this.page_size, this.p)
      console.log(`当前页: ${val}`)
    },
    // 以下为修改数据弹窗函数
    // 编辑按钮
    async modify (idnumber) {
      await this.$http.get(
        'PersonalInformationList/' + idnumber
      ).then(req => {
        if (req.status === 200) {
          this.modifyData = true
          this.modifyinfo = req.data
          this.userlist(this.modifyinfo.user.id)
        } else {
          console.log(req)
          this.$message.warning('无法获取个人数据')
        }
      }).catch(err => {
        console.log(err)
        this.$message.warning('获取数据错误')
      })
    },
    // 取消
    modifyquxiao () {
      // 重置数据
      this.modifyData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
      this.fromdisabled = true
    },
    // 提交
    modifytijiao () {
      // 重置数据
      this.modifyData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
      this.fromdisabled = true
    },
    // 以下为添加数据弹窗函数
    // 取消弹出框
    quxiao () {
      this.$refs.addForm.resetFields()
      // 重置数据
      this.addData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
    },
    // 提交弹出框数据
    tijiao () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$http.post('PersonalInformationList',
            this.modifyinfo)
            .then(req => {
              if (req.status === 201) {
                this.$message.warning('创建' + '  ' + req.data.idnumber + '-' + req.data.name + '  ' + '成功')
                // 重置数据
                this.addData = false
                this.dataselect = []
                this.modifydisabled = false
                this.modifyinfo = {}
                // 重新获取列表
                this.plist(this.search)
              }
            })
            .catch(err => {
              console.log(err.response)
              if (err.response.status === 406) {
                this.$message.warning(err.response.data.message)
              }
              if (err.response.status === 400) {
                let x
                for (x in err.response.data) {
                  this.$message.warning('' + err.response.data[x])
                }
              }
            })
        } else {
          console.log('error submit!!')
          this.$message.warning('数据错误')
        }
      })
    },
    // 添加数据按钮
    addfrom () {
      this.addData = true
      this.modifyinfo = { 'user': 1 }
      this.dataselect.unshift({ 'id': 1, 'username': '自动生成账号' })
      this.userlist()
    },
    // 弹窗关闭回调
    xiaohui () {
      this.modifyData = false
      this.addData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
    },
    // 列表筛选设置
    filterChange (val) {
      console.log('筛选')
      // console.log(val.hasOwnProperty('dadui'))
      if (val.hasOwnProperty('dadui')) {
        this.filters['dadui'] = val.dadui[0]
        if (val.dadui[0] === undefined) {
          this.fenzu = []
        } else {
          this.daduizhongdilist('', val.dadui[0])
        }
      }
      if (val.hasOwnProperty('fenzu')) {
        this.filters['fenzu'] = val.fenzu[0]
      }
      console.log(this.filters)
      this.plist(this.search, this.page_size, this.p, this.filters['dadui'], this.filters['fenzu'])
      // if (this.filters['dadui'].length === 0) {
      //   this.fenzu = []
      // }
    }
  },
  created () {
    this.daduizhongdilist('大队')
    // this.daduizhongdilist('中队')
    // this.daduizhongdilist('小组')
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

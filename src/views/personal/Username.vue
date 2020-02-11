<template>
    <div>
        <!--  表头  -->
        <el-row :gutter="24">
            <!--搜索框-->
            <el-col :span="7">
                <el-input
                        placeholder="请输入姓名、曾用名、身份证搜索"
                        v-model="search"
                        @keyup.enter.native="plist(search)"
                        @clear="plist()"
                        clearable>
                    <el-button slot="append" icon="el-icon-search" @click="plist(search)"/>
                </el-input>
            </el-col>
            <!--按钮-->
            <el-col :span="12">
                <!--添加数据按钮-->
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addfrom">添加数据</el-button>
                <!--清空筛选按钮-->
                <el-button type="primary" icon="el-icon-delete" @click="clearFilter">清空所有筛选</el-button>
                <!--重新加载数据按钮-->
                <el-button type="primary" icon="el-icon-refresh" @click="shuaxin">刷新数据</el-button>
            </el-col>
            <el-button type="primary" plain @click="ceshi">测试数据用</el-button>
        </el-row>
        <!--  数据内容(表格)  -->
        <h6>说明：岗位工龄只显示本岗位的工龄，转辅警人员之前的协勤工龄请到用工信息中查询。</h6>
        <el-table
                ref="filterTable"
                v-loading="tableloading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="datalist"
                height="650"
                border
                stripe
                highlight-current-row
                style="width: 100%"
                @filter-change="filterChange">
            <el-table-column type="index" label="序号" width="60" align="center"/>
            <el-table-column prop="idnumber" label="身份证" width="180" align="center"/>
            <el-table-column prop="name" label="姓名" width="100" align="center"/>
            <el-table-column prop="sex" label="性别" width="80" align="center"
                             :filters="sex" :column-key="'sex'" :filter-multiple="false"/>
            <el-table-column prop="birthday" label="生日" width="150" align="center"/>
            <el-table-column label="年龄" width="80" align="center">
                <template slot-scope="scope">
                    {{getAge(scope.row.birthday)}}
                </template>
            </el-table-column>
            <el-table-column prop="dangtuans[0].politics.name" label="政治面貌" width="100" align="center"
                             :filters="Politics" :column-key="'Politics'" :filter-multiple="false">
                <template slot-scope="scope">
                    <span v-if="scope.row.dangtuans.length !== 0">
                        <el-tag v-if="getAge(scope.row.birthday)>=28 && scope.row.dangtuans[0].politics.name==='共青团员'"
                                type="danger">
                        {{scope.row.dangtuans[0].politics.name}}
                        </el-tag>
                        <el-tag v-else>{{scope.row.dangtuans[0].politics.name}}</el-tag>
                    </span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="150" align="center"/>
            <el-table-column label="学历状态" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.educations.length !== 0">{{scope.row.educations[0].xueli.name}}</span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="permanent" label="户籍地址" width="330" align="center"/>
            <el-table-column prop="jiguan.jiguan" label="籍贯" width="200" align="center"
                             :filters="DiZhi" :column-key="'DiZhi'" :filter-multiple="false"/>
            <el-table-column prop="home" label="通讯地址" width="330" align="center"/>
            <el-table-column prop="drivinglicense.name" label="驾照" width="80" align="center"
                             :filters="DrivingLicenseType" :column-key="'DrivingLicenseType'" :filter-multiple="false"/>
            <el-table-column label="人员状态" width="100" align="center"
                             :filters="ZhuangTai" :column-key="'ZhuangTai'" :filter-multiple="false">
                <template slot-scope="scope">
                    <span  v-if="scope.row.yonggongs.length !== 0">{{scope.row.yonggongs[0].zhuangtai.name}}</span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="人员类别" width="100" align="center"
                             :filters="CategoryType" :column-key="'CategoryType'" :filter-multiple="false">
                <template slot-scope="scope">
                    <span  v-if="scope.row.yonggongs.length !== 0">{{scope.row.yonggongs[0].shenfenguilei.name}}</span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="入职时间" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.yonggongs.length !== 0">{{scope.row.yonggongs[0].start}}</span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="岗位工龄" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.yonggongs.length !== 0">{{getAge(scope.row.yonggongs[0].start)}}年</span>
                    <el-tag v-else type="warning">无数据</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="dadui.name" label="所属大队" width="100" align="center"
                             :filters="dadui" :column-key="'dadui'" :filter-multiple="false"/>
            <el-table-column prop="fenzu.name" label="所属中队" width="110" align="center"
                             :filters="fenzu" :column-key="'fenzu'" :filter-multiple="false"/>
            <el-table-column prop="jiediao.name" label="是否借调" width="130" align="center"
                             :filters="Borrow" :column-key="'Borrow'" :filter-multiple="false"/>
            <el-table-column prop="bianzhi.name" label="编制位置" width="100" align="center"
                             :filters="Borrow" :column-key="'Borrow'" :filter-multiple="false"/>
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

        <!-- 修改/修改数据数据弹窗 -->
        <el-dialog
                :title="fromdisabled?'查看数据':'修改数据'"
                :visible.sync="modifyData" label-width="70px"
                width="60%" :show-close="false" :destroy-on-close="true" :close-on-press-escape="false"
                :close-on-click-modal="false" :close="modifyquxiao"
                center>
            <el-form :model="modifyinfo" :rules="addrules" ref="modifyinfo" label-width="80px" :disabled="fromdisabled">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="账号" prop="user">
                            <el-select v-model="modifyinfo.user"
                                       :disabled="modifydisabled">
                                <el-option v-for="user in dataselect" :key="user.id" :label=user.username
                                           :value="user.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编号" prop="idfj">
                            <el-input v-model="modifyinfo.idfj"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="modifyinfo.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="曾用名" prop="named">
                            <el-input v-model="modifyinfo.named"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="modifyinfo.mobile"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证" prop="idnumber">
                            <el-input v-model="modifyinfo.idnumber"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="4">
                        <el-form-item label="民族" prop="nation">
                            <el-input v-model="modifyinfo.nation"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="性别" prop="sex">
                            <el-input v-model="modifyinfo.sex" :disabled="true" placeholder="系统自动根据身份证识别"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="生日" prop="birthday">
                            <el-input v-model="modifyinfo.birthday" :disabled="true" placeholder="系统自动根据身份证识别"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="生肖" prop="zodiac">
                            <el-input v-model="modifyinfo.zodiac" placeholder="系统自动根据身份证识别" :disabled="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="星座" prop="constellation">
                            <el-input v-model="modifyinfo.constellation" placeholder="系统自动根据身份证识别" :disabled="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="爱好/特长" prop="hobby">
                            <el-input v-model="modifyinfo.hobby"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="籍贯" prop="jiguan">
                            <el-select v-model="modifyinfo.jiguan"
                                       :disabled="true" placeholder="系统自动根据身份证识别">
                                <el-option v-for="jiguan in jiguanselect" :key="jiguan.id" :label=jiguan.jiguan
                                           :value="jiguan.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="户籍类别" prop="permanenttype">
                            <el-select v-model="modifyinfo.permanenttype">
                                <el-option v-for="permanenttype in hujiselect"
                                           :key="permanenttype.id"
                                           :label=permanenttype.name
                                           :value="permanenttype.id"/>
                            </el-select>
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
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="退役类别" prop="veteran">
                            <el-select v-model="modifyinfo.veteran">
                                <el-option v-for="veteran in Type.DemobilizedType" :key="veteran.id" :label=veteran.name
                                           :value="veteran.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="婚姻状态" prop="marriage">
                            <el-select v-model="modifyinfo.marriage">
                                <el-option v-for="marriage in Type.Marriage" :key="marriage.id" :label=marriage.name
                                           :value="marriage.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驾照" prop="drivinglicense">
                            <el-select v-model="modifyinfo.drivinglicense">
                                <el-option v-for="drivinglicense in Type.DrivingLicenseType"
                                           :key="drivinglicense.id"
                                           :label=drivinglicense.name
                                           :value="drivinglicense.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="大队" prop="dadui">
                            <el-select v-model="modifyinfo.dadui" @change="modifyfenzu(modifyinfo.dadui)">
                                <el-option v-for="dadui in dadui" :key="dadui.value" :label=dadui.text
                                           :value="dadui.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="中队/小组" prop="fenzu">
                            <el-select v-model="modifyinfo.fenzu">
                                <el-option v-for="fuzu in fenzu" :key="fuzu.value" :label=fuzu.text
                                           :value="fuzu.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="借调位置" prop="jiediao">
                            <el-select v-model="modifyinfo.jiediao">
                                <el-option v-for="jiediao in Type.Borrow"
                                           :key="jiediao.id"
                                           :label=jiediao.name
                                           :value="jiediao.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="编制位置" prop="bianzhi">
                            <el-select v-model="modifyinfo.bianzhi">
                                <el-option v-for="bianzhi in Type.Organization" :key="bianzhi.id" :label=bianzhi.name
                                           :value="bianzhi.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="家庭经济" prop="economics">
                            <el-select v-model="modifyinfo.economics">
                                <el-option v-for="economics in Type.Economics" :key="economics.id" :label=economics.name
                                           :value="economics.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="经济来源" prop="sources">
                            <el-select v-model="modifyinfo.sources">
                                <el-option v-for="sources in Type.Sources"
                                           :key="sources.id"
                                           :label=sources.name
                                           :value="sources.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" class="row-bg" justify="space-around">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="beizhu">
                            <el-input v-model="modifyinfo.beizhu"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                                      type="textarea" placeholder="请输入内容"/>
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
              <el-button type="primary" @click="modifytijiao">提  交</el-button>
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
      // 类目列表
      Type: [],
      // 籍贯列表
      jiguanselect: [],
      // 户籍类别列表
      hujiselect: [],
      // 数据加载动画
      tableloading: true,
      // 大队中队小组分类数据
      dadui: [],
      fenzu: [],
      sex: [{ text: '男', value: '男' }, { text: '女', value: '女' }],
      Politics: [],
      ZhuangTai: [],
      DiZhi: [],
      DrivingLicenseType: [],
      Organization: [],
      Borrow: [],
      CategoryType: [],
      filters: {
        'dadui': '',
        'fenzu': '',
        'sex': '',
        'Politics': '',
        'ZhuangTai': '',
        'DiZhi': '',
        'DrivingLicenseType': '',
        'Organization': '',
        'Borrow': '',
        'CategoryType': ''
      },
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
    // 分组数据选择（修改数据页面用）
    modifyfenzu (id) {
      this.modifyinfo.fenzu = null
      this.typelist('', id)
    },
    // 大队分类数据获取
    async typelist (category, parent) {
      await this.$http.get('DaduiZhongduiTypeList', {
        params: {
          category_type: category,
          parent_category: parent
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
          this.fenzu = []
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
    plist: async function (search, size, p) {
      // this.tableloading = true
      await this.$http.get('PersonalInformationList', {
        params: {
          search: search,
          page_size: size,
          p: p,
          dadui: this.filters['dadui'],
          fenzu: this.filters['fenzu'],
          sex: this.filters['sex'],
          dangtuannot: this.filters['Politics'],
          yonggongs__zhuangtai__name: this.filters['ZhuangTai'],
          jiguan__jiguan: this.filters['DiZhi'],
          drivinglicense__name: this.filters['DrivingLicenseType'],
          bianzhi__name: this.filters['Organization'],
          jiediao__name: this.filters['Borrow'],
          yonggongs__shenfenguileinot__name: this.filters['CategoryType']
        }
      })
        .then(req => {
          this.datalist = req.data.results
          this.count = req.data.count
          if (req.data.count === 0) {
            this.$message.warning('无数据')
          } else {
            this.tableloading = false
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
    async userlist (userid) {
      await this.$http.get(
        'UserInformationNoneList'
      )
        .then(req => {
          if (req.data.length === 0) {
            // 不存在多个未分配账号
            this.modifydisabled = true
            if (userid) {
              this.userone(userid)
            }
          } else {
            // 存在多个未分配账号
            this.dataselect = req.data
            let staff = window.sessionStorage.getItem('pms')
            let superuser = window.sessionStorage.getItem('superuser')
            if (userid) {
              this.userone(userid)
            } else {
              this.dataselect.unshift({ 'id': 1, 'username': '自动生成账号' })
            }
            this.modifydisabled = !(staff || superuser)
          }
        })
        .catch(err => {
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
          this.typelist('', this.modifyinfo.dadui)
          this.userlist(this.modifyinfo.user)
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
      // this.tableloading = true
      this.modifyData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
      this.fromdisabled = true
      this.dadui = []
      this.fenzu = []
    },
    // 提交
    modifytijiao () {
      // 重置数据
      this.modifyData = false
      this.dataselect = []
      this.modifydisabled = false
      this.modifyinfo = {}
      this.fromdisabled = true
      this.dadui = []
      this.fenzu = []
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
      this.dadui = []
      this.fenzu = []
    },
    // 提交弹出框数据
    tijiao () {
      this.tableloading = true
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
                this.plist(this.search, this.page_size, this.p)
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
      this.p = 1
      this.page_size = 10
      // console.log(val.hasOwnProperty('dadui'))
      // console.log(val)
      // 大队中队级联获取
      if (val.hasOwnProperty('dadui')) {
        this.filters['dadui'] = val.dadui[0]
        if (val.dadui[0] === undefined) {
          this.fenzu = []
        } else {
          this.typelist('', val.dadui[0])
        }
      }
      if (val.hasOwnProperty('fenzu')) {
        this.filters['fenzu'] = val.fenzu[0]
      } else { this.filters['fenzu'] = '' }
      // 性别获取
      if (val.hasOwnProperty('sex')) {
        this.filters['sex'] = val.sex[0]
      }
      // 政治面貌筛选
      if (val.hasOwnProperty('Politics')) {
        this.filters['Politics'] = val.Politics[0]
      }
      // 籍贯筛选
      if (val.hasOwnProperty('DiZhi')) {
        this.filters['DiZhi'] = val.DiZhi[0]
      }
      // 驾照筛选
      if (val.hasOwnProperty('DrivingLicenseType')) {
        this.filters['DrivingLicenseType'] = val.DrivingLicenseType[0]
      }
      // 编制筛选
      if (val.hasOwnProperty('Organization')) {
        this.filters['Organization'] = val.Organization[0]
      }
      // 借调筛选
      if (val.hasOwnProperty('Borrow')) {
        this.filters['Borrow'] = val.Borrow[0]
      }
      // 人员筛选
      if (val.hasOwnProperty('CategoryType')) {
        this.filters['CategoryType'] = val.CategoryType[0]
      }
      // 人员状态筛选
      if (val.hasOwnProperty('ZhuangTai')) {
        this.filters['ZhuangTai'] = val.ZhuangTai[0]
      }
      this.plist(this.search, this.page_size, this.p)
      // if (this.filters['dadui'].length === 0) {
      //   this.fenzu = []
      // }
    },
    // 清空所有筛选按钮
    clearFilter () {
      // console.log(this.$refs)
      this.$refs.filterTable.clearFilter()
      this.filters = {
        'dadui': '',
        'fenzu': '',
        'sex': '',
        'Politics': '',
        'ZhuangTai': '',
        'DiZhi': '',
        'DrivingLicenseType': '',
        'Organization': '',
        'Borrow': '',
        'CategoryType': ''
      }
      // console.log(this.filters)
      this.plist(this.search, this.page_size, this.p)
    },
    // 刷新数据
    shuaxin () {
      this.$refs.filterTable.clearFilter()
      this.tableloading = true
      this.filters = {
        'dadui': '',
        'fenzu': '',
        'sex': '',
        'Politics': '',
        'ZhuangTai': '',
        'DiZhi': '',
        'DrivingLicenseType': '',
        'Organization': '',
        'Borrow': '',
        'CategoryType': ''
      }
      this.plist()
    },
    // 获取分类
    async typelists () {
      await this.$http.get('Type')
        .then(req => {
          // console.log(req.data)
          // 获取政治面貌分类
          const persons = req.data.Politics
          const ZhuangTai = req.data.ZhuangTai
          const DrivingLicenseType = req.data.DrivingLicenseType
          const Organization = req.data.Organization
          const Borrow = req.data.Borrow
          this.hujiselect = req.data.PermanentType
          this.Type = req.data
          // console.log(this.jiguanselect)
          for (let i = 0; i < persons.length; i++) {
            const dic = {}
            dic['text'] = persons[i].name
            dic['value'] = persons[i].name
            this.Politics.push(dic)
          }
          for (let i = 0; i < ZhuangTai.length; i++) {
            const dic = {}
            dic['text'] = ZhuangTai[i].name
            dic['value'] = ZhuangTai[i].name
            this.ZhuangTai.push(dic)
          }
          for (let i = 0; i < DrivingLicenseType.length; i++) {
            const dic = {}
            dic['text'] = DrivingLicenseType[i].name
            dic['value'] = DrivingLicenseType[i].name
            this.DrivingLicenseType.push(dic)
          }
          for (let i = 0; i < Organization.length; i++) {
            const dic = {}
            dic['text'] = Organization[i].name
            dic['value'] = Organization[i].name
            this.Organization.push(dic)
          }
          for (let i = 0; i < Borrow.length; i++) {
            const dic = {}
            dic['text'] = Borrow[i].name
            dic['value'] = Borrow[i].name
            this.Borrow.push(dic)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取籍贯信息
    jiguanlist () {
      this.$http.get('DiZhiList')
        .then(req => {
          // console.log(req.data)
          const persons = req.data
          // this.jiguanselect = req.data
          // console.log(this.jiguanselect)
          for (let i = 0; i < persons.length; i++) {
            const dic = {}
            dic['text'] = persons[i].jiguan
            dic['value'] = persons[i].jiguan
            this.DiZhi.push(dic)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取全部籍贯信息
    jiguanlistall () {
      this.$http.get('DiZhiNotListAll')
        .then(req => {
          this.jiguanselect = req.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取人员/岗位类别信息
    categorylist (category, parent) {
      this.$http.get('CategoryTypeList', {
        params: {
          category_type: category,
          parent_category: parent
        }
      })
        .then(req => {
          const CategoryType = req.data
          if (category === '人员类别') {
            for (let i = 0; i < CategoryType.length; i++) {
              const dic = {}
              dic['text'] = CategoryType[i].name
              dic['value'] = CategoryType[i].name
              this.CategoryType.push(dic)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ceshi () {
      console.log(this.filters)
    }
  },
  created () {
    this.typelist('大队')
    this.categorylist('人员类别')
    this.typelists()
    this.jiguanlist()
    this.jiguanlistall()
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

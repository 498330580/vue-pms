<template>
  <div class="login-container">
    <div class="login-box">
      <!--   网站logo   -->
      <div class="logo-box">
        <img src="../../assets/logo.png" alt="LOGO">
      </div>
      <!--   登录表单   -->
      <el-form label-width="0px" class="login-form" :model="loginform" :rules="loginformrules" ref="loginRef">
        <!-- :model绑定数据  ：rules表单验证  ：ref引用，做数据重置 -->
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="el-icon-user" placeholder="请输入用户名"
                    @keyup.enter.native="login"/>
        </el-form-item>
        <!--密码-->
        <el-form-item v-if="formpassword" prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginform.password" placeholder="请输入密码"
                    @keyup.enter.native="login">
            <i slot="suffix" class="iconfont icon-icon-test1" @click="changpass"/>
          </el-input>
        </el-form-item>
        <el-form-item v-else prop="password">
          <el-input type="text" prefix-icon="el-icon-lock" v-model="loginform.password" placeholder="请输入密码"
                    @keyup.enter.native="login">
            <i slot="suffix" class="iconfont icon-icon-test" @click="changpass"/>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="del">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      loginform: {
        username: '498330580',
        password: '19920124Zhy@.'
      },
      // 判断是否明文显示密码
      formpassword: true,
      // 表单验证
      loginformrules: {
        // 下面的值必须与表单数据中的取值相同
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 18, message: '长度为18个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在10到18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changpass () {
      // 判断是否显示明文密码
      this.formpassword = !this.formpassword
    },
    del () {
      // 重置表单
      // this.loginform.name = this.loginform.pass = '';
      this.$refs.loginRef.resetFields()
    },
    login () {
      // 登录按钮
      // eslint-disable-next-line no-undef
      // 验证表单数据是否合法
      this.$refs.loginRef.validate(async (valid) => {
        if (valid) {
          await this.$http.post('login', this.loginform)
            .then(req => {
              // 储存token到本地localStorag中，关闭浏览器不会消失
              // window.localStorage.setItem('JWT', req.data.token)
              // 储存token到本地sessionStorage中，关闭浏览器会消失，一般适用于token
              window.sessionStorage.setItem('pmstoken', req.data.token)
              window.sessionStorage.setItem('superuser', req.data.superuser)
              console.log(req.data)
              this.$message.success('登录成功')
              // 登录成功后跳转到主页
              this.$router.push('/home')
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status === 400) {
                  this.$message.warning('用户名或密码错误')
                  console.log(error.response.data.non_field_errors[0])
                }
              } else {
                this.$message.error('错误:未获得服务器返回数据。')
              }
              // console.log(error.response.status)
              // console.log(error.response.data)
              // console.log(error.response.headers)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2d3a4b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #eeeeee;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .logo-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}

.button {
  display: flex;
  justify-content: flex-end;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

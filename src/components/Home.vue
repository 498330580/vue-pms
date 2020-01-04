<template>
  <el-container>

    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo">
        <span>人员管理系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 菜单区域 -->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"/>
              <span>人员信息</span>
            </template>
            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-s-custom"/>
                <span>账号信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="1-2" @click="plist">
              <template slot="title">
                <i class="el-icon-user"/>
                <span>个人信息</span>
              </template>
            </el-menu-item>
            <!--
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
            -->
          </el-submenu>
          <!--
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
          -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>Main</el-main>
        <!--        <el-footer>Footer</el-footer>-->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async plist () {
      this.$http.get('api/PersonalInformationList')
        .then(req => {
          console.log(req)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>

.el-header, .el-footer {
  background-color: #333333;
  color: #eeeeee;
  text-align: center;
  line-height: 60px;
}

.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;

    > span {
      margin-left: 15px;
    }

    > img {
      height: 45px;
      width: 45px;
      /*border-radius: 50%;*/
      /*background-color: #eeeeee;*/
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #eeeeee;
  /*text-align: center;*/
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  height: 100%;
  width: 100%;
  /*margin-bottom: 40px;*/
}

/*.el-container:nth-child(5) .el-aside,*/
/*.el-container:nth-child(6) .el-aside {*/
/*  line-height: 260px;*/
/*}*/

/*.el-container:nth-child(7) .el-aside {*/
/*  line-height: 320px;*/
/*}*/
</style>

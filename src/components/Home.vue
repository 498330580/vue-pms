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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单区域 -->
        <div class="toggle-button">
          <span @click="menubutton">
            <i v-if="isCollapse" class="el-icon-s-unfold"/>
            <i v-else class="el-icon-s-fold"/>
          </span>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="menupath"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          v-for="item in menulist" :key="item.id"
          :router="true">
          <!-- 一级菜单 -->
          <el-submenu v-if="item.is_look && item.sub_cat.length > 0" :index="item.path">
            <template slot="title">
              <i :class="item.class_img"/>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="item2 in item.sub_cat" :key="item2.id" :index="item2.path"
                          @click="sevemenupath(item2.path,[item.name, item2.name])">
              <template slot="title" v-if="item2.is_look">
                <i :class="item2.class_img"/>
                <span>{{ item2.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.path" @click="sevemenupath(item.path, [item.name])">
            <i :class="item.class_img"/>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 主体区域 -->
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="breadcrumb.length >= 1">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ breadcrumb[0] }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="breadcrumb.length >= 2">{{ breadcrumb[1] }}</el-breadcrumb-item>
            </el-breadcrumb>
          <el-card>
            <router-view  @breadcrumb="showbreadcrumb"/>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      // 默认打开折叠菜单
      isCollapse: true,
      menupath: '',
      breadcrumb: []
    }
  },
  methods: {
    logout () {
      // 退出登录，清除登录信息，并跳转到登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async menu () {
      await this.$http.get('Menu')
        .then(req => {
          this.menulist = req.data
        })
        .catch(error => console.log(error))
    },
    // 菜单折叠判断
    menubutton () {
      this.isCollapse = !this.isCollapse
    },
    sevemenupath (path, breadcrumb) {
      // 储存到sess中防止刷新页面菜单定位失败
      window.sessionStorage.setItem('pmsmenupath', path)
      window.sessionStorage.setItem('breadcrumb', breadcrumb)
      this.menupath = path
      this.breadcrumb = breadcrumb
    },
    showbreadcrumb () {
      // 此方法传递给子组件，将菜单路径与面包屑的值重置为初始值
      this.menupath = ''
      this.breadcrumb = []
    }
  },
  created () {
    this.menu()
    if (window.sessionStorage.getItem('pmsmenupath')) {
      this.menupath = window.sessionStorage.getItem('pmsmenupath')
    }
    if (window.sessionStorage.getItem('breadcrumb')) {
      this.breadcrumb = window.sessionStorage.getItem('breadcrumb').split(',')
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
  /*line-height: 200px;*/

  .el-menu {
    border-right: none;
  }
}

/*.el-main {*/
/*  background-color: #E9EEF3;*/
/*  color: #333;*/
/*  text-align: center;*/
/*  line-height: 160px;*/
/*}*/

.el-container {
  height: 100%;
  width: 100%;
  margin-right: 10px;
  /*margin-bottom: 40px;*/
  background-color: #eeeeee;
}

.toggle-button {
  font-size: 15px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}

/*.el-container:nth-child(5) .el-aside,*/
/*.el-container:nth-child(6) .el-aside {*/
/*  line-height: 260px;*/
/*}*/

/*.el-container:nth-child(7) .el-aside {*/
/*  line-height: 320px;*/
/*}*/
</style>

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
          <div v-for="(item,index) in menulist" :key="index">
            <el-submenu v-if="item.is_look && item.sub_cat.length > 0" :index="String(index+1)">
              <template slot="title">
                <i :class="item.class_img"/>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item v-for="(item2, index2) in item.sub_cat" :key="index2"
                            :index="String(index+1)+'-'+String(index2+1)">
                <template slot="title" v-if="item2.is_look">
                  <i :class="item2.class_img"/>
                  <span>{{ item2.name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.is_look" :index="String(index+1)">
              <i :class="item.class_img"/>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </div>
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
  data () {
    return {
      menulist: ''
    }
  },
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
    },
    async menu () {
      await this.$http.get('api/Menu')
        .then(req => {
          this.menulist = req.data
          console.log(req.data)
        })
        .catch(error => console.log(error))
    }
  },
  created () {
    this.menu()
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

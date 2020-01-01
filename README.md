# pms

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# 项目目录文件介绍
[教程地址](https://www.bilibili.com/video/av50680998?p=342)

## 文件
***
+ babel.config.js → babel的配置文件
+ .eslintrc.js 语法配置文件
+ .gitignore git忽略文件
+ package.json 项目包管理文件
+ vue.config.js vue配置文件（自己创建的）

## 目录
***
+ node_modules → 依赖包目录
+ public → 静态资源目录
    + index.html 首页
    + favicon.ico 网站图标
    + *.md 目录介绍
+ src → 组件源码目录
    + assets 静态资源（图片、样式表等）
    + components 组件目录
    + plugins 插件配置目录
    + router 路由
        + index.js 路由配置文件
    + store 
    + views 视图组件
    + App.vue 根组件
    + main.js 项目入口文件
    + *.md目录介绍
    
    
# [Element-ui](https://element.eleme.cn/#/zh-CN/component/installation)
## 1.安装

### 1.1 npm 安装
推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用。
~~~
npm i element-ui -S
~~~

### 1.2 CDN
目前可以通过 unpkg.com/element-ui 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。
~~~
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<!-- 引入组件库 -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
~~~
>建议使用 CDN 引入 Element 的用户在链接地址上锁定版本，以免将来 Element 升级时受到非兼容性更新的影响。锁定版本的方法请查看 unpkg.com。

### 1.3 [图像化界面安装](https://www.bilibili.com/video/av50680998?p=345)


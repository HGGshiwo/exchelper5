<template>
  <el-container style="height: 100%; width: 100%;">
    <el-header style="position: fixed; width: 100%; text-align: left; z-index:10; background-color:white;left: 0;top: 0;right: 0;">
      <el-row
        ><el-col :span="18"
          ><img style="height: 50px" src="./static/logol.png"
        /></el-col>
        <el-col :span="2"
          ><el-link type="primary" href="mailto:1272126735@qq.com"
            >联系作者</el-link
          ></el-col
        >
        <el-col :span="1"
          ><el-link type="primary" href="https://github.com/HGGshiwo/exchelper5"
            >项目地址</el-link
          ></el-col
        >
      </el-row>
    </el-header>
    <Suspense>
      <template v-slot:default>
        <router-view></router-view>
      </template>
      <template v-slot:fallback>
        <el-skeleton :rows="8" animated />
      </template>
    </Suspense>
  </el-container>
</template>
<script>
</script>
<style>
#app {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

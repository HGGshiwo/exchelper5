<template>
  <el-container style="height: 100%">
    <el-aside style="height: 100%; position: fixed; margin-top: 60px" width="200">
      <my-menu />
    </el-aside>
    <el-main style="text-align: left; margin-left: 200px; margin-top: 60px; height: 800px;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import MyMenu from "../components/Menu.vue";

export default {
  components: {
    MyMenu,
  },
};
</script>

<style>
</style>
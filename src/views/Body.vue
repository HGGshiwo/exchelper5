<template>
  <el-container style="height: 100%">
    <el-aside style="height: 100%; position: fixed; margin-top: 60px">
      <my-menu />
    </el-aside>

    <el-main
      style="
        position: fixed;
        height: calc(100%-50px);
        margin-left: 300px;
        margin-top: 60px;
      "
    >
      <el-scrollbar style="width: 100%; text-align: left">
        <router-view></router-view>
      </el-scrollbar>
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
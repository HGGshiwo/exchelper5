<template>
  <el-container style="height: 100%; width: 100%">
    <el-header
      style="
        position: fixed;
        width: 100%;
        text-align: left;
        z-index: 10;
        background-color: white;
        left: 0;
        top: 0;
        right: 0;
      "
    >
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
    <router-view></router-view>
  </el-container>
</template>
<script>
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    //页面关闭或者刷新则保存数据
    window.onbeforeunload = () => {
      ElMessage("数据已保存。");
      store.commit("save");
    };

    //update=false表示之前没有更新过，此时通过LocalStorage更新。
    //如果localStorage=null，说明第一次打开应用，此时使用state中的
    if (!store.state.update) {
      const str = localStorage.getItem("_EXC_HELPER_STATE_");
      if (!str || str.length === 2) {
        ElMessage("已经为您初始化数据，具体设置请到设置页面更改。");
        store.commit("setUpdate");
      } else {
        store.commit("init", JSON.parse(str));
      }
    }
  },
};
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
  background-color: #f5f6f7;
  height: 100%;
}
</style>

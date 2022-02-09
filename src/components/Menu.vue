<template>
  <el-menu
    style="height: 100%; width: 200px"
    :default-active="where()"
    :router="true"
  >
    <el-menu-item index="/">
      <el-icon><icon-menu/></el-icon>
      <span>开始</span>
    </el-menu-item>
    <el-menu-item index="/data">
      <el-icon><icon-document/> </el-icon>
      <span>历史记录</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon><icon-setting/> </el-icon>
      <span>设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { useRouter } from "vue-router";
import { Setting as IconSetting, Document as IconDocument, Menu as IconMenu } from '@element-plus/icons-vue'

export default {
    components:{
        IconSetting, 
        IconDocument, 
        IconMenu
    },
  
  setup() {
    const router = useRouter();

    function to(where) {
      router.push({"name":where});
    }

    function where(){
      return router.currentRoute.value.path
    }

    return {
      to,
      where
    };
  },
};
</script>


<style>
</style>
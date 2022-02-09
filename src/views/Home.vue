<template>
<el-space wrap>
    <el-card v-for="(my,key) in mys" :key="key" style="width: 250px" shadow="hover" @click="to('exc',key)">
      <template #header>
        <div class="card-header">
          <span>{{key}}</span>
        </div>
      </template>
      <div style="width: 200px;">
        <div>
          <div>完成度</div>
          <div><el-progress  :width="80" :percentage="100*my.done/my.total" status="success" /></div>
        </div> 
        <div>正确率</div>
          <div><el-progress :width="80" :percentage="100*my.proper/my.done" status="success" /></div>
      </div> 
    </el-card>
  </el-space>
  <el-divider style="margin-top:200px;width:100%;"/>
<div class="notes">
  <div style="margin-top:5px;">
    <el-button class="block" v-for="p in ['一','二','三','四','五','六','日']" :key="p"  style="background-color:wite;border-color:white;">
      {{p}}
    </el-button>
  </div>
  <div v-for="(p,i) in info" :key="i" style="margin-top:10px;">
    <el-button class="block" v-for="(pp,j) in p" :key="j" :style="{'background-color':pp}"/>
  </div>
</div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup(){

    const store = useStore()
    const mys = ref(store.state.myExc)
    const router = useRouter()
    function to(where,key){
      router.push({"name":where, params:{"excName":key}})
    }
    const info = [
      ["#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9",],
      ["#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9",],
      ["#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9",],
      ["#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9","#f9f9f9",],
    ] 
    return {
      mys,
      to,
      info
    }
  }
}
</script>

<style>
  .block {
    width: 20px;
    height: 20px;
    margin: 5px;
    display: inline;
  }
  .notes {
    padding:20px;
    width: 300px;
    border: 1px solid var(--el-border-color-base);
  }
</style>
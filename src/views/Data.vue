<template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="150" />
      <el-table-column prop="span" label="Span" width="150" />
      <el-table-column prop="number" label="Number" width="150" />
      <el-table-column prop="name" label="Name" width="150" />
      <el-table-column prop="start" label="Start" width="150" />
      <el-table-column prop="end" label="End" width="150" />
      <el-table-column label="" width="90">
        <el-button @click="handleClick()">查看</el-button>
      </el-table-column>
    </el-table>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from "vuex"

export default {
  setup(){
    const store = useStore()
    const { history } = store.state    
    const tableData = computed(()=>{
      let t = []
      for(let time in history){
        let deatail = time.split(":")
        t.push({
          date: deatail[0]+'-'+deatail[2]+'-'+deatail[3],
          span: history[time].span,
          number: Object.keys(history[time].done).length,
          name: history[time].exc,
          start: history[time].startTime,
          end: history[time].endTime,
        })
      }
      return t
    })

    function handleClick(){
      alert("正在开发中，暂时无法查看历史")
    }
    return {
      handleClick,
      tableData
    }
  }
  
}
</script>

<style>

</style>

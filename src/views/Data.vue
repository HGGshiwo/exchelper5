<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="150" />
    <el-table-column prop="span" label="Span" width="150" />
    <el-table-column prop="number" label="Number" width="150" />
    <el-table-column prop="name" label="Name" width="150" />
    <el-table-column prop="start" label="Start" width="150" />
    <el-table-column prop="end" label="End" width="150" />
    <el-table-column>
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索日期或者题集名称" />
      </template>
      <template #default="scope">
        <el-button @click="handleClick(scope.row)">查看</el-button>
        <el-button @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const { history } = store.state;
    const tableData = computed(() => {
      let t = [];
      for (let time in history) {
        let deatail = time.split(":");
        t.unshift({
          time: time,
          date: deatail[0] + "-" + deatail[1] + "-" + deatail[2],
          span: history[time].span,
          number: Object.keys(history[time].done).length,
          name: history[time].exc,
          start: history[time].startTime,
          end: history[time].endTime,
        });
      }
      return t.filter((data)=>{
        return !search.value ||
        data.name.includes(search.value) ||
        data.date.includes(search.value)
      })
    });

    function handleClick(row) {
      router.push({
        name: "exc",
        params: { excName: row.name, submited: true, historyTime: row.time },
      });
    }

    function handleDelete(row){
      if(confirm("该操作不可逆，是否继续?")){
        store.commit("deleteHistory", row.time)
        ElMessage("删除成功!")
      }
    }

    const search = ref("")
    return {
      handleClick, //点击查看的回调函数
      handleDelete, //点击删除的回调函数
      tableData, //表格展示数据
      search, //输入框的内容
    };
  },
};
</script>

<style>
</style>

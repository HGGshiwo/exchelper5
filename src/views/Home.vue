<template>
  <el-space wrap>
    <el-card v-show="show">
     <template #header>
      <div class="card-header">
        <span>添加题库以开始</span>
      </div>
    </template>
      <el-table
        :data="tableData"
        ref="tableRef"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="90"> </el-table-column>
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="total" label="Number" width="180" />
        <el-table-column prop="author" label="Author" width="180" />
        <el-table-column prop="update" label="Update" width="150" />
      </el-table>
      <el-button style="margin-top: 10px" type="primary" @click="onSubmit"
        >确定</el-button
      >
    </el-card>
    <el-card
      v-for="(my, key) in mys"
      :key="key"
      style="width: 250px"
      shadow="hover"
      @click="to('exc', key)"
    >
      <template #header>
        <div class="card-header">
          <span>{{ key }}</span>
        </div>
      </template>
      <div style="width: 200px">
        <div>
          <div>完成度</div>
          <div>
            <el-progress
              :width="80"
              :percentage="Math.round((1000 * my.done) / my.total) / 10"
            />
          </div>
        </div>
        <div>正确率</div>
        <div>
          <el-progress
            :width="80"
            :percentage="
              my.done ? Math.round((1000 * my.proper) / my.done) / 10 : 0
            "
          />
        </div>
      </div>
    </el-card>
  </el-space>
  <el-divider style="margin-top: 200px; width: 100%" />
  <!-- <div class="notes">
    <div style="margin-top: 5px">
      <button
        class="block"
        v-for="p in ['日', '一', '二', '三', '四', '五', '六']"
        :key="p"
        style="background-color:white; border-color: white"
      >
        {{ p }}
      </button>
    </div>
    <div v-for="(p, i) in info" :key="i" style="margin-top: 10px">
      <button
        class="block"
        v-for="(pp, j) in p"
        :key="j"
        :style="{ 'background-color': pp }"
      />
    </div>
  </div> -->
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { nextTick } from "vue-demi";
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const tableData = ref([]);
    const mys = ref(store.state.myExc);
    const show = ref(Object.keys(mys.value).length === 0);

    nextTick(() => {
      if (Object.keys(mys.value).length == 0) {
        axios
          .get("https://hggshiwo.github.io/static/index.json")
          .then((res) => {
            for (let d in res.data) {
              const { myExc } = store.state;
              tableData.value.push({
                ...res.data[d],
                name: d,
                selected: d in myExc,
              });
            }
          });
      }
      console.log(tableData.value)
    });

    function onSubmit() {
      if (confirm("确定修改吗?")) {
        //此时更新myExc
        let newExc = {};
        const { myExc } = store.state;
        selects.forEach((exc) => {
          if (exc.name in myExc) {
            newExc[exc.name] = myExc[exc.name];
          } else {
            newExc[exc.name] = {
              last: "0000:00:00:00:00:00",
              total: exc.total,
              done: 0,
              proper: 0,
            };
          }
        });
        store.commit("changeMyExc", { myExc: newExc });
        mys.value = store.state.myExc;
        show.value = Object.keys(mys.value).length === 0;
        ElMessage("题库添加成功！在设置页中进行更改。")
      }
    }

    let selects = [];
    //改变题集后的回调函数
    function handleSelectionChange(val) {
      selects = [...val];
    }

    function to(where, key) {
      router.push({
        name: where,
        params: { excName: key, historyTime: "0000:00:00:00:00:00" },
      });
    }
    const color = [
      "#ECF5FF",
      "#D9ECFF",
      "#C6E2FF",
      "#B3D8FF",
      "#A0CFFF",
      "#8CC5FF",
      "#79BBFF",
      "#66B1FF",
    ];
    const { note } = store.state;
    const info = note.map((arr) => {
      return arr.map((aarr) => {
        return aarr >= 80 ? color[7] : color[Math.floor(aarr / 10)];
      });
    });
    return {
      mys, //用户已经加入的题集
      to, //点击历史记录的回调函数
      info, //展示的note数组
      color, //note展示的颜色
      onSubmit,
      handleSelectionChange,
      show,
      tableData
    };
  },
};
</script>

<style >
.block {
  width: 35px;
  height: 35px;
  margin: 5px;
  display: inline;
  border-radius: 2px;
  border: 1px solid var(--el-border-color-base);
}
.notes {
  padding: 20px;
  width: 350px;
  border: 1px solid var(--el-border-color-base);
  background-color: white;
}
</style>
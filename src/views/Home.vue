<template>
  <el-space wrap>
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
              :percentage="Math.round(1000 * my.done / my.total)/10"
            />
          </div>
        </div>
        <div>正确率</div>
        <div>
          <el-progress
            :width="80"
            :percentage="my.done ? Math.round((1000 * my.proper) / my.done)/10 : 0"
          />
        </div>
      </div>
    </el-card>
  </el-space>
  <el-divider style="margin-top: 200px; width: 100%" />
  <div class="notes">
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
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

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
        store.commit("setUpdate")
        console.log(store.state.update)
      } else {
        store.commit("init", JSON.parse(str));
      }
    }

    const mys = ref(store.state.myExc);
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
  border: 1px solid var(--el-border-color-base)
}
.notes {
  padding: 20px;
  width: 350px;
  border: 1px solid var(--el-border-color-base);
}
</style>
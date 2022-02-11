<template>
  <el-container style="height: 100%">
    <el-aside style="height: 100%; position: fixed; margin-top: 60px">
      <info-bar
        :progress="progress"
        :correctness="correctness"
        :hHours="hours"
        :hMinutes="minutes"
        :hSecods="seconds"
        :excName="excName"
        :submited="submited"
        @submit="submit"
      />
    </el-aside>

    <el-main
      style="height: calc(100%-60px); margin-left: 300px; margin-top: 60px"
    >
      <el-scrollbar style="width: 100%">
        <div v-if="isLoading">
          <el-skeleton :rows="4" animated />
        </div>
        <div
          v-else
          v-for="(choices, key, i) in history.done"
          :key="key"
          style="text-align: left"
        >
          <p>{{ i + 1 }}&nbsp;&nbsp;{{ excs[key].text }}</p>
          <div v-for="(c, ck) in choices" :key="ck">
            <div>
              <el-checkbox
                :disabled="isSubmit"
                v-model="choices[ck]"
                @click="click(key, ck)"
                >{{ ck + excs[key].choices[ck] }}</el-checkbox
              >
            </div>
          </div>
          <el-alert
            :closable="false"
            v-if="isSubmit"
            :title="'答案是' + excs[key].key.toString()"
            :type="check(key) ? 'success' : 'error'"
          />
          <el-divider />
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import InfoBar from "../components/InfoBar.vue";
import { ElMessage } from "element-plus";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";

export default {
  components: { InfoBar },
  props: {
    excName: String,
    historyTime: String,
  },
  async setup(props) {
    const store = useStore();
    const router = useRouter();

    //得到当前的题集名称
    const { excName, historyTime } = props;
    const {
      setting: { num: historyNum, span, countDown },
      history: historys,
    } = store.state;

    //如果没有传入参数，直接跳到home页面
    if (!historyTime) {
      router.push({ name: "home" });
    }

    //记录下开始的时间
    const start = new Date();
    const submited = historyTime !== "0000:00:00:00:00:00";
    //是否提交
    const isSubmit = ref(submited);

    //数据是否已经就绪
    const isLoading = ref(true);

    //如果是已经提交的，则使用pre history，否则新建一条history
    const history =
      submited && !!historyTime
        ? ref(historys[historyTime])
        : ref({
            exc: excName,
            done: {},
            startTime: getTime(),
            endTime: "",
            span: countDown
              ? num2Str(Math.floor(span / 60)) +
                ":" +
                num2Str(span % 60) +
                ":00"
              : "00:00:00",
            num: 0,
            proper: 0,
          });

    //给出InfoBar的时间，如果已经提交则是history中的时间，否则是00
    let hhmmss = history.value.span.split(":");
    const hours = ref(hhmmss[0]);
    const minutes = ref(hhmmss[1]);
    const seconds = ref(hhmmss[2]);

    //请求当前的完整题集
    const excs = ref({});

    if (!!excName)
      axios
        .get("https://hggshiwo.github.io/static/" + excName + ".json")
        .then((res) => {
          excs.value = res.data;
        })
        .catch((error) => {
          alert(error);
          router.push({ name: "home" });
        })
        .then(() => {
          //如果是未提交的，则从题集中生成需要做的题目id，然后赋值给history
          if (!submited) {
            //查找history表，生成已经完成的题目列表
            let dones = [];
            for (let t in historys) {
              if (historys[t].exc === excName) {
                dones = [...dones, ...Object.keys(historys[t].done)];
              }
            }
            //过滤出未做过的id列表
            const ids = Object.keys(excs.value).filter((id) => {
              return dones.indexOf(id) === -1;
            });
            let i = 0;
            for (; i < historyNum && i < ids.length; i++) {
              let key = ids[i];
              history.value.done[key] = {};
              for (let kk in excs.value[key].choices) {
                history.value.done[key][kk] = false;
              }
            }
            if (i == 0) {
              alert("你已经做完了该题目集，请查看历史记录");
              router.push({ name: "data" });
            }
            history.value = { ...history.value, proper: 0, num: i };
          }
          //数据已经就绪
          isLoading.value = false;
        });

    //计算进度值
    const progress = computed(() => {
      if (isLoading.value) return 0;
      let done = 0;
      for (let key in history.value.done) {
        let isDone = false;
        for (let ckey in history.value.done[key]) {
          isDone |= history.value.done[key][ckey];
        }
        if (isDone) {
          done += 1;
        }
      }
      return (
        (100 * done) / Object.getOwnPropertyNames(history.value.done).length
      );
    });

    //计算用的时间
    function getSpan() {
      let end = new Date();
      let span = end - start;
      return (
        Math.floor(span / 3600000) +
        ":" +
        num2Str(Math.floor(span / 60000)) +
        ":" +
        num2Str(Math.floor(span / 1000))
      );
    }

    //判断是否正确
    function check(id) {
      const ans = history.value.done[id];
      const key = Object.values(excs.value[id].key);

      for (let i = 0; i < key.length; i++) {
        if (!ans[key[i]]) {
          return false;
        }
      }
      return (
        key.length ===
        Object.values(ans).filter((active) => {
          return active;
        }).length
      );
    }

    //计算正确率
    const correctness = computed(() => {
      if (!isSubmit.value || isLoading.value) return 0;
      return (history.value.proper / history.value.num) * 100;
    });

    //完善记录并且提交
    function submitHistory() {
      history.value.endTime = getTime();
      history.value.span = getSpan();
      history.value.num = Object.keys(history.value.done).length;
      for (let id in history.value.done) {
        if (check(id)) history.value.proper += 1;
      }
      let time = getDate() + ":" + history.value.endTime;
      store.commit("addHistory", { time: time, history: history.value });
    }

    //点击的回调函数
    function submit() {
      if (isSubmit.value) {
        router.push({ name: "data" });
      } else {
        if (confirm("确定提交吗?")) {
          isSubmit.value = true;
          //完善历史记录并且提交
          submitHistory();
          ElMessage("成功提交，请到历史记录中查看。");
        }
      }
    }

    //点击的回调事件，确保单选
    function click(key, ck) {
      if (isSubmit.value) return;
      if (!excs.value[key].multi) {
        for (let choice in history.value.done[key]) {
          if (choice != ck) {
            history.value.done[key][choice] = false;
          }
        }
      }
    }

    //数字转为两位字符串
    function num2Str(num) {
      return ("00" + num.toString()).slice(-2);
    }

    //得到当前的日期yy:mm:dd
    function getDate() {
      let date = new Date();
      return (
        date.getFullYear().toString() +
        ":" +
        num2Str(date.getMonth() + 1) +
        ":" +
        num2Str(date.getDate())
      );
    }

    //得到当前的时间hh:mm:ss
    function getTime() {
      let date = new Date();
      return (
        num2Str(date.getHours()) +
        ":" +
        num2Str(date.getMinutes()) +
        ":" +
        num2Str(date.getSeconds())
      );
    }

    return {
      submited, //是否是历史记录
      check, //检验答案函数
      excs, //当前题集数据
      history, //当前显示的用户历史数据
      excName, //当前题集名称
      click, //单击选项的回调函数
      progress, //当前的进度
      correctness, //当前的正确率
      submit, //点击提交的回调函数
      isSubmit, //是否提交
      isLoading, //数据是否就绪
      hours, //初始化infoBar的时间
      seconds, //初始化infoBar的时间
      minutes, //初始化infoBar的时间
    };
  },
};
</script>

<style>
</style>
<template>
  <div style="height: 100%; width: 200px">
    <div class="bar-item" style="height: 60px">
      <div class="bar-title">题集</div>
      <div style="font-size: 20px; margin-top: 5px; color: grey">
        {{ excName }}
      </div>
    </div>
    <div class="bar-item" style="height: 60px">
      <div class="bar-title">时间</div>
      <div style="font-size: 30px; margin-top: 5px; color: grey">
        {{ hours }}:{{ minutes }}:{{ seconds }}
      </div>
    </div>
    <div class="bar-item" style="height: 150px">
      <div class="bar-title">完成进度</div>
      <el-progress :percentage="progress" type="circle" />
    </div>
    <div class="bar-item" style="height: 150px">
      <div class="bar-title">准确率</div>
      <el-progress :percentage="0" type="circle" />
    </div>
    <div class="bar-item" style="height: calc(100% - 475px)">
      <el-button style="margin-top: 10px" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { onUnmounted, toRefs, ref, h } from "vue";
import { ElNotification } from "element-plus";

export default {
  props: {
    progress: Number,
    excName: String,
  },
  setup(props) {
    const router = useRouter();
    //提交按钮的回调函数
    function submit() {
      if (confirm("确定提交吗?")) {
        ElNotification({
          title: "确认提交",
          message: h(
            "i",
            { style: "color: teal" },
            "提交成功，请到历史记录中查看。"
          ),
        });
        router.push({ name: "data" });
      }
    }

    const { progress } = toRefs(props);

    let _seconds = 0;
    let _minutes = 0;
    let _hours = 0;

    const seconds = ref("00");
    const minutes = ref("00");
    const hours = ref("00");

    const countDown = false;

    //计时器
    const timer = setInterval(() => {
      _seconds += countDown ? -1 : 1;
      if (!countDown) {
        if (_seconds == 60) {
          _minutes += 1;
          _seconds = 0;
        }
        if (_minutes == 60) {
          _hours += 1;
          _minutes = 0;
        }
        if (_hours == 100) {
          _hours = 0;
        }
      }
      seconds.value = num2Str(_seconds);
      minutes.value = num2Str(_minutes);
      hours.value = num2Str(_hours);
    }, 1000);

    onUnmounted(() => {
      clearInterval(timer);
    });

    function num2Str(num) {
      return ("00" + num.toString()).slice(-2);
    }

    return {
      submit,
      progress,
      seconds,
      minutes,
      hours,
    };
  },
};
</script>

<style>
.bar-title {
  padding-bottom: 5px;
}
.bar-item {
  width: 100%;
  border: 1px solid var(--el-border-color-base);
  border-bottom: 0;
  padding-bottom: 10px;
}
</style>
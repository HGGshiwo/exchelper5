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
      <el-progress :percentage="correctness" type="circle" />
    </div>
    <div class="bar-item" style="height: calc(100% - 475px)">
      <el-button style="margin-top: 10px" @click="submit()">{{
        text
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { toRefs, ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  emits: {
    submit: null,
  },
  props: {
    progress: Number,
    correctness: Number,
    excName: String,
    submited: Boolean,
    hSecods: String,
    hHours: String,
    hMinutes: String,
  },
  setup(props, context) {
    const {
      progress,
      excName,
      submited,
      correctness,
      hSecods,
      hMinutes,
      hHours,
    } = toRefs(props);
    const store = useStore();

    const isSubmit = ref(submited.value);
    const text = computed(() => {
      return isSubmit.value ? "返回" : "提交";
    });

    //提交按钮的回调函数
    function submit() {
      isSubmit.value = true;
      if (timer) clearInterval(timer);
      context.emit("submit");
    }

    const {
      setting: { span, countDown },
    } = store.state;
    let _seconds = 0;
    let _minutes = countDown ? span % 60 : 0;
    let _hours = countDown ? Math.floor(span / 60) : 0;

    const seconds = ref(hSecods.value);
    const minutes = ref(hMinutes.value) ;
    const hours = ref(hHours.value);

    //计时器
    const timer = submited.value
      ? null
      : setInterval(() => {
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
          } else {
            if (_seconds == -1) {
              _minutes -= 1;
              _seconds = 59;
            }
            if (_minutes == -1) {
              _hours -= 1;
              _minutes = 59;
            }
            if (_hours == -1) {
              _seconds = 0
              _minutes = 0
              _hours = 0
              alert("时间到!");
              submit();
            }
          }
          seconds.value = num2Str(_seconds);
          minutes.value = num2Str(_minutes);
          hours.value = num2Str(_hours);
        }, 1000);

    function num2Str(num) {
      return ("00" + num.toString()).slice(-2);
    }

    return {
      text,
      submit,
      correctness,
      progress,
      seconds,
      minutes,
      hours,
      excName,
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
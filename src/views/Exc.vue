<template>
  <el-container style="height:100%;">
      <el-aside style="height:100%; position:fixed;margin-top:60px">
         <info-bar :progress="progress" :excName="excName" @submit="submit"/>
      </el-aside>

      <el-main style="height:calc(100%-60px);margin-left:300px;margin-top:60px;">
        <el-scrollbar style="width:100%;">
          <div v-for="(choices,key,i) in history.done" :key="key" style="text-align:left;">
            <p>{{i+1}}&nbsp;&nbsp;{{excs[key].text}}</p>
            <div v-for="(c,ck) in choices" :key="ck">
              <div> <el-checkbox v-model="choices[ck]" @click="click(key,ck)">{{ck+excs[key].choices[ck]}}</el-checkbox></div>
            </div>
            <el-divider/>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
</template>

<script>
import InfoBar from '../components/InfoBar.vue'
import { ElNotification } from "element-plus";
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import { useStore } from 'vuex'

export default {  
  components: { InfoBar },
    async setup(){
      const store = useStore()
      const router = useRouter()

      //得到当前的题集名称
      const route = useRoute()
      const { excName } = route.params

      //记录下开始的时间
      const start = new Date()
      
      //是否提交
      const isSubmit = ref(false)

      //数字转为两位字符串
      function num2Str(num){
        return ("00"+num.toString()).slice(-2)
      }

      //得到当前的日期yy:mm:dd
      function getDate(){
        let date = new Date()
        return date.getFullYear().toString()+":"+num2Str(date.getMonth()+1)+":"+num2Str(date.getDay());
      }

      //得到当前的时间hh:mm:ss
      function getTime(){
        let date = new Date()
        return num2Str(date.getHours())+":"+num2Str(date.getMinutes())+":"+num2Str(date.getSeconds()); 
      }

      //新建一条history记录
      const history = ref({
        exc: excName,
        done:{},
        startTime: getTime(),
        endTime: "",
        span: "",
        num: 0,
        proper: 0,
      })

      //请求当前的完整题集
      const excs = ref({})
      axios.get("https://hggshiwo.github.io/static/"+excName+".json").then(
        res=>{
          excs.value = res.data
        },
      ).catch(
        error=>{
          alert(error)
        }
      ).then(()=>{
          //通过题集完善history
          for(let key in excs.value){
            history.value.done[key] = {}
            for(let kk in excs.value[key].choices){
              history.value.done[key][kk] = false
            }
          }
      })

      //点击的回调事件，确保单选
      function click(key, ck){
        if(!excs.value[key].multi){
          for(let choice in history.value.done[key]){
            if(choice != ck){
              history.value.done[key][choice]=false
            } 
          }
        }
      }

      //计算进度值
      const progress = computed(() => {
        let done = 0
        for(let key in history.value.done){
          let isDone = false
          for(let ckey in history.value.done[key]){
            isDone |= history.value.done[key][ckey]
          }
          if(isDone){
            done += 1
          }
        }
        return 100*done/Object.getOwnPropertyNames(history.value.done).length
      })
      
      //计算用的时间
      function getSpan(){
        let end = new Date()
        let span = end - start
        return Math.floor(span/3600000)+":"+num2Str(Math.floor(span / 60000))+":"+num2Str(Math.floor(span / 1000))
      }

      //判断是否正确
      function check(ans, key){
        for(let k in key){
          if(!ans[k]){
            return false
          }
        }
        return key.length === Object.keys(ans).length
      }

      //点击的回调函数
      function submit(){
        //结束时提交
        history.value.endTime = getTime()
        history.value.span = getSpan()
        history.value.num = Object.keys(history.value.done).length
        for(let id in history.value.done){
          if(check(history.value.done[id], excs.value[id].key))
            history.value.proper += 1
        }
        let time = getDate()+":"+history.value.endTime
        store.commit("addHistory", {time: time, history: history.value})

        if(isSubmit.value){
          router.push({ name: "data" });
        }
        else {
          if (confirm("确定提交吗?")) {  
            isSubmit.value = true
            ElNotification({
              title: "确认提交",
              message: h(
                "i",
                { style: "color: teal" },
                "提交成功，请到历史记录中查看。"
              ),
            });
          }
        }
      }

      return {
        excs,
        history,
        excName,
        click,
        progress,
        submit,
        isSubmit,
      }
    }
}
</script>

<style>

</style>
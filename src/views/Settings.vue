<template>
  <el-form ref="formRef" :model="form" label-width="80px">
    <el-form-item label="计时顺序">
      <el-radio-group v-model="form.countDown">
        <el-radio :label="false">倒计时</el-radio>
        <el-radio :label="true">正计时</el-radio>
        <el-radio :label="null" disabled>无计时</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="倒计时长">
      <el-input-number
        v-model="form.span"
        :step="5"
        label="描述文字"
      ></el-input-number>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="自动提交">
      <el-switch v-model="form.autoSubmit"></el-switch>
    </el-form-item>
    <el-form-item label="提交方式">
      <el-radio-group v-model="form.submitWay">
        <el-radio label="dc">双击提交</el-radio>
        <el-radio label="sc">单击提交</el-radio>
        <el-radio label="rc" disabled>右键提交</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-divider></el-divider>
    <el-form-item label="自动更新">
      <el-switch v-model="form.autoFresh"></el-switch>
    </el-form-item>
    <el-form-item label="本地缓存">
      <el-switch v-model="form.localStorage"></el-switch>
    </el-form-item>
    <el-form-item label="题目数量">
      <el-input-number
        v-model="form.num"
        :step="5"
        label="描述文字"
      ></el-input-number>
    </el-form-item>
    <el-divider />

    <el-form-item label="选择题集">
      <el-table :data="tableData" ref="tableRef" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="90"> </el-table-column>
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="total" label="Number" width="180" />
        <el-table-column prop="author" label="Author" width="180" />
        <el-table-column prop="update" label="Update" width="150" />
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button style="margin-left: 40%">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { nextTick, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";

export default {
  async setup() {
    const tableRef = ref(null)
    //发送请求得到table data
    const tableData = ref([]);
    const store = useStore();
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
      })
      .catch((error) => {
        alert(error);
      })
      .then(()=>{
        nextTick(() => {
          tableData.value.forEach((row) => {
          tableRef.value.toggleRowSelection(row, row.selected);
          });
        })
      }
      );

    const form = ref({...store.state.setting});

    const router = useRouter();
    function onSubmit() {
      if (confirm("确定修改吗?")) {
        //此时更新myExc
        let newExc = {}
        const { myExc } =  store.state
        selects.forEach((exc)=>{
          if(exc.name in myExc){
            newExc[exc.name] = myExc[exc.name] 
          }
          else{
            newExc[exc.name] = {
              last:"2022:2:9:12:23:12",
              total:exc.total,
              done:0,
              proper:0}
          }
        })
        store.commit("changeSetting", {form:form.value, myExc:newExc})
        router.push("/");
      }
    }

    let selects = []
    //改变题集后的回调函数
    function handleSelectionChange(val){
      selects = [...val]
    }

    return {
      form,
      onSubmit,
      tableData,
      tableRef,
      handleSelectionChange,
    };
  },
};
</script>

<style>
#main {
  height: 100%;
}
</style>
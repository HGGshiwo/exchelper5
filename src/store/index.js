import { createStore } from 'vuex'

export default createStore({
  state: {
    myExc: {
      "test1": { last: "2022:2:9:12:23:12", total: 30, done: 20, proper: 5 }
    },
    history: {
      "2022:02:09:12:23:12": {
        exc: "毛概题集",
        done: {
          "1": { "A": true, "B": false, "C": false, "D": false },
          "2": { "A": true, "B": false, "C": false, "D": false },
        },
        startTime: "12:00:20",
        endTime: "12:00:11",
        span: "00:00:11",
        num: 2,
        proper: 1,
      }
    },
    setting: {
      countDown: true,
      span: 50,
      autoSubmit: true,
      submitWay: "sc",
      autoFresh: true,
      localStorage: true,
      num: 2,
    }
  },
  mutations: {
    addHistory(state, payload) {
      // 变更状态
      const { time, history } = payload
      state.history[time] = history
      const { done, proper } = state.myExc[history.exc]
      const { num: curNum, proper: curProper } = history
      state.myExc[history.exc] = {
        ...state.myExc[history.exc],
        last: time,
        done: done + curNum,
        proper: proper + curProper
      }
    },
    changeSetting(state, payload){
      const { form, myExc } = payload
      state.setting = {...form}
      state.myExc = {...myExc}
    }
  },
  actions: {
  },
  modules: {
  }
})

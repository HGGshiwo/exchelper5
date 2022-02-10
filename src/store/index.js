import { createStore } from 'vuex'

export default createStore({
  state: {
    myExc: {},
    history: {},
    setting: {
      countDown: true,
      span: 50,
      autoSubmit: true,
      submitWay: "sc",
      autoFresh: true,
      localStorage: true,
      num: 20,
    },
    note: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    update: false
  },
  mutations: {
    setUpdate(state){
      state.update = true
    },
    init(state, payload) {
      const { myExc, history, setting, note, update } = payload
      state.history = history
      state.setting = setting
      state.note = note
      state.myExc = myExc
      state.update = update
    },
    save(state) {
      localStorage.setItem("_EXC_HELPER_STATE_", JSON.stringify(state))
    },
    addHistory(state, payload) {
      // 变更状态
      const { time, history } = payload
      state.history[time] = history
      console.log(history.exc,state.myExc)
      const { done, proper } = state.myExc[history.exc]
      const { num: curNum, proper: curProper } = history
      state.myExc[history.exc] = {
        ...state.myExc[history.exc],
        last: time,
        done: done + curNum,
        proper: proper + curProper
      }
      const d = new Date()
      state.note[Math.floor(d.getDate() / 7) % 4][d.getDay()] += history.num
    },
    changeSetting(state, payload) {
      const { form, myExc } = payload
      state.setting = { ...form }
      state.myExc = { ...myExc }
    }
  },
  actions: {
  },
  modules: {
  }
})

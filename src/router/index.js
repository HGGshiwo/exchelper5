import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home'
import Exc from '../views/Exc'
import Data from '../views/Data'
import Body from '../views/Body'
import Settings from '../views/Settings'

const routes = [
  {
    path: '/',
    component: Body,
    children:[
      {
        path: '/',
        name:'home',
        component: Home
      },
      {
        path: 'data',
        name: 'data',
        component: Data
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings
      }
    ],
  },
  {
    path: '/exc/:excName',
    name: 'exc',
    component: Exc
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

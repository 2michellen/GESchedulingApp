import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import FindRoom from '@/components/FindRoom.vue'
import DoFirst from '@/components/DoFirst.vue'
import RequestScreen1 from '@/components/RequestScreen1.vue'
import RequestScreen2 from '@/components/RequestScreen2.vue'
import RequestScreen3 from '@/components/RequestScreen3.vue'
import GuestWiFi from '@/components/GuestWiFi.vue'
import LocalHotels from '@/components/LocalHotels.vue'
import LocalCaterers from '@/components/LocalCaterers.vue'
import AttentionNotes from '@/components/AttentionNotes.vue'
import RequestSummary from '@/components/RequestSummary.vue'
import ITHelp from '@/components/ITHelp.vue'
import About from '@/components/About.vue'
import SendSubmittedEmail from '@/components/SendSubmittedEmail.vue'


import AdminHome from '@/components/admin/AdminHome.vue'
import AdminMaintenance from '@/components/admin/AdminMaintenance.vue'
import AdminAdd from '@/components/admin/AdminAdd.vue'
import AdminUpdate from '@/components/admin/AdminUpdate.vue'
import AdminSendInvite from '@/components/admin/AdminSendInvite.vue'
import AdminSendApprovedEmail from '@/components/admin/SendApprovedEmail.vue'
import AdminSendNeedMoreInfoEmail from '@/components/admin/SendRejectedEmail.vue'
import SendAdminAddEmail from '@/components/admin/SendAdminAddEmail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      alias: '/Login'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
        path: '/findroom',
        name: 'FindRoom',
        component: FindRoom
    },
    {
      path: '/dofirst/:isNewRequest',
      name: 'DoFirst',
      component: DoFirst
    },
    {
      path: '/request/1',
      name: 'RequestScreen1',
      component: RequestScreen1
    },
    {
      path: '/request/2',
      name: 'RequestScreen2',
      component: RequestScreen2
    },
    {
      path: '/request/3',
      name: 'RequestScreen3',
      component: RequestScreen3
    },
    {
      path: '/guestwifi',
      name: 'GuestWiFi',
      component: GuestWiFi
    },
    {
      path: '/localhotels',
      name: 'LocalHotels',
      component: LocalHotels
    },
    {
      path: '/localcaterers',
      name: 'LocalCaterers',
      component: LocalCaterers
    },
    {
      path: '/attentionNotes',
      name: 'AttentionNotes',
      component: AttentionNotes
    },
    {
      path: '/requestsummary',
      name: 'RequestSummary',
      component: RequestSummary
    },
    {
      path: '/ithelp',
      name: 'ITHelp',
      component: ITHelp
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path:'/sendsubmittedemail',
      name: 'SendSubmittedEmail',
      component: SendSubmittedEmail
    },
    {
      path: '/admin/home',
      name: 'AdminHome',
      component: AdminHome
    },
    {
      path: '/admin/maintenance',
      name: 'AdminMaintenance',
      component: AdminMaintenance
    },
    {
      path: '/admin/manageaccounts',
      name: 'AdminAdd',
      component: AdminAdd
    },
    {
      path: '/admin/updatedata',
      name: 'AdminUpdate',
      component: AdminUpdate
    },
    {
      path: '/admin/sendinvite',
      name: 'AdminSendInvite',
      component: AdminSendInvite
    },
    {
      path: '/admin/sendapprovedemail',
      name: 'AdminSendApprovedEmail',
      component: AdminSendApprovedEmail
    },
    {
      path: '/admin/sendneedmoreinfoemail',
      name: 'AdminSendNeedMoreInfoEmail',
      component: AdminSendNeedMoreInfoEmail
    },
    {
      path: '/admin/sendadminaddemail',
      name: 'SendAdminAddEmail',
      component: SendAdminAddEmail
    },
  ]
})
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VCalendar from 'v-calendar'
import Trend from "vuetrend"
import firebase from 'firebase/app'
import 'firebase/firestore';

//for chart
Vue.use(Trend)
// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc', 
});

Vue.config.productionTip = false;

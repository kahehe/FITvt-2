import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VCalendar from "v-calendar";
import Trend from "vuetrend";
import firebase from "firebase/app";
import "firebase/firestore";
//for chart
Vue.use(Trend);
// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "vc", // Use <vc-calendar /> instead of <v-calendar />
});
Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGjUAQT7VdY4IEmYvkBAeyYWkke1t4m8M",
  authDomain: "fitvt-b63fd.firebaseapp.com",
  databaseURL: "https://fitvt-b63fd.firebaseio.com",
  projectId: "fitvt-b63fd",
  storageBucket: "fitvt-b63fd.appspot.com",
  messagingSenderId: "218761718770",
  appId: "1:218761718770:web:642831b723a08ff451196b",
  measurementId: "G-07FDZY9W3L",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
router.beforeEach((to, from, next) => {
  //page is restricted
  if (to.meta.requiresAuth) {
    //user is logged in
    if (firebase.auth().currentUser) {
      next();
    }
    //user is not logged in
    else {
      next("/login");
    }
  } else {
    next();
  }
});
let db = firebase.firestore();
window.db = db;
let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});

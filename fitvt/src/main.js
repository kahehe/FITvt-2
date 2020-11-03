import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import 'firebase/firestore';


Vue.config.productionTip = false;

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyDIEA01msH8_f6PB3eIP6WOtyX5Oovz_sk",
    authDomain: "fitvt-4d8bd.firebaseapp.com",
    databaseURL: "https://fitvt-4d8bd.firebaseio.com",
    projectId: "fitvt-4d8bd",
    storageBucket: "fitvt-4d8bd.appspot.com",
    messagingSenderId: "114620864183",
    appId: "1:114620864183:web:50fbed92a03dd34a7d9f32",
    measurementId: "G-F5PWXHRGPM" 
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
			next('/login');
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
		}).$mount('#app');
	}
});
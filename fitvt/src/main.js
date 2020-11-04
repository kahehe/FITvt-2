import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import 'firebase/firestore';


Vue.config.productionTip = false;

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: 
    authDomain: 
    databaseURL: 
    projectId: 
    storageBucket: 
    messagingSenderId: 
    appId: 
    measurementId: 
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
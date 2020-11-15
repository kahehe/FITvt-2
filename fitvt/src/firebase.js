import firebase from "firebase";

// const firebaseConfig = {
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

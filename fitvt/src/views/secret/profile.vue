<template>
  <div class="profile main">
    <Spinner v-if="loading" />
    <aside class="left"><SideBar /></aside>
    <main>
      <sNavBar />
      <section id="my-workouts">
        <h3><span>My Workouts</span></h3>
        <div class="create-workout" style="margin-top: 1rem">
          <router-link to="/secret/profile/create-workout">
            <i class="fas fa-plus"></i>
            create new workout
          </router-link>
        </div>
        <ul>
          <li
            v-for="(post, index) in posts"
            :key="index"
            @click="showPost(post)"
          >
            <p style="text-decoration: underline">{{ post.title }}</p>
          </li>
          <br />
        </ul>
      </section>

    </main>
    <aside class="right">
      <CalendarChart />
    </aside>
  </div>
</template>

<script>
import SideBar from "@/components/secret/SideBar";
import CalendarChart from "@/components/secret/Calendar-Chart";
import sNavBar from "@/components/secret/NavBar";
import Spinner from "@/components/Spinner";
import swal from "sweetalert";
import firebase from "firebase/app";
export default {
  components: {
    SideBar,
    CalendarChart,
    sNavBar,
    Spinner,
  },
  data() {
    return {
      loading: true,
      username: "",
      posts: [],
      savedWorkouts: [],
      myPosts: [],
      likes: {},
    };
  },
  methods: {
    showPost(post) {
      console.log(post);
      var div = document.createElement("div");
      div.innerHTML = `
      <h2 style='margin-bottom:15px'>${post.title}</h2>
      <p>${post.description}</p>
      <input hidden value=${post.documentId} id='documentId'>
      `;
      swal({
        content: div,
        buttons: ["Delete this workout", "ok"],
      });
      let deleteBtn = document.querySelector(".swal-button--cancel");
      deleteBtn.addEventListener("click", async () => {
        let documentId = document.querySelector("#documentId");
        await window.db.collection("workout").doc(documentId.value).delete();
        //redirect to the same page(profile)
        this.$router.go("/secret/profile");
      });
    }
  },
  async mounted() {
    let uid = this.$store.state.UID || localStorage.getItem("UID");
    //fetching username from the firestore
    let res = await window.db
      .collection("username")
      .where("uid", "==", uid)
      .get();
    this.username = res.docs.length && res.docs[0].data().username;
    //save username in store
    this.$store.commit("setuname", this.username);
    //save username in localstorage in case if user refreshes the page
    localStorage.setItem("username", this.username);
    //fetch posts for the one person (owner)
    let res2 = await window.db
      .collection("workout")
      .where("uid", "==", uid)
      .get();

    res2.docs.length &&
      res2.docs.forEach((post, index) => {
        this.posts.push(post.data());
        //adding the document id of each post to this.posts array for use them in delete
        this.posts[index].documentId = post.id;
      });

    //fetch the saved workouts
    let res3 = await window.db
      .collection("saved-post")
      .where("uid", "==", uid)
      .get();
    let array = [];
    res3.docs.forEach((post) => {
      array.push(Object.assign(post.data(), { documentId: post.id }));
    });
    //remove duplicates
    this.savedWorkouts = array.filter(
      (v, i, a) => a.findIndex((t) => t.title === v.title) === i
    );
    //for getting the posts of the user only
    let res4 = await window.db.collection("post").where("uid", "==", uid).get();
    res4.docs.length &&
      res4.docs.forEach((post, index) => {
        this.myPosts.push(post.data());
        this.myPosts[index].documentId = post.id;
      });
    console.log(this.myPosts);
    await window.db.collection("like").onSnapshot((snapshot) => {
      snapshot.docs.forEach((item) => {
        this.likes[item.id] = item.data().text.length;
      });
    });
    console.log(this.likes);
    this.$forceUpdate();
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
</style>
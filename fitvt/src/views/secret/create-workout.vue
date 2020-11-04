<template>
  <div class="create-workout main">
    <Spinner v-if="loading" />
    <aside class="left"><SideBar /></aside>
    <main>
      <sNavBar />
      <p class="error" v-if="error">{{ error }}</p>
      <section id="workout-title">
        <h3>Title of workout:</h3>
        <br />
        <br />
        <input type="text" id="title" v-model="title" />
      </section>
      <section id="workout-desc">
        <h3>Description:</h3>
        <br />
        <br />
        <textarea id="" cols="30" rows="10" v-model="description"></textarea>
      </section>
      <button class="btn" @click="newWorkout">CREATE</button>
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
      title: "",
      description: "",
      loading: false,
      error: "",
    };
  },
  methods: {
    async newWorkout() {
      this.$store.commit("setActivity");
      this.loading = true;
       await window.db.collection("workout").add({
        title: this.title,
        description: this.description,
        uid: localStorage.getItem("UID"),
      });
      this.loading = false;
      this.title = "";
      this.description = "";
    },
  },
};
</script>

<style scoped>
.main {
	 display: flex;
}
 aside, main {
	 text-align: center;
	 padding: 15px;
	 min-height: 100%;
}
 .left {
	 width: 20%;
	 max-width: 350px;
	 background-color: #212936;
}
 main {
	 width: 50%;
	 background-color: #2b3648;
}
 .right {
	 width: 30%;
	 max-width: 500px;
	 background-color: #2b3648;
}
 
</style>
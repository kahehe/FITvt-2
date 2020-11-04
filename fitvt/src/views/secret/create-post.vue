<template>
  <div class="create-workout main">
    <Spinner v-if="loading" />
    <aside class="left"><SideBar /></aside>
    <main>
      <sNavBar />
      <p class="error" v-if="error">{{ error }}</p>
      <section id="workout-select">
        <h3>select your workout:</h3>
        <select v-model="select">
          <option
            v-for="(workout, index) in workouts"
            :key="index"
            :value="workout.description + '$' + workout.title"
          >
            {{ workout.title }}
          </option>
        </select>
      </section>

      <section id="post-title">
        <h3>Title of Post:</h3>
        <br />
        <br />
        <input type="text" id="title" v-model="title" />
      </section>
      <section id="workout-image">
        <h3>Image:</h3>
        <br /><br />
        <input type="file" @change="inputChange" />
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
import firebase from "firebase/app";
import "firebase/storage";
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
      loading: false,
      file: "",
      error: "",
      url: "",
      workouts: [],
      select: "",
    };
  },
  methods: {
    inputChange(e) {
      let file = e.target.files[0];
      this.file = file;
    },
  },
  async mounted() {
      this.$store.commit("setActivity");
    let res = await window.db
      .collection("workout")
      .where("uid", "==", localStorage.getItem("UID"))
      .get();
    res.docs.forEach((workout) => {
      this.workouts.push(workout.data());
    });
  },
};

<style scoped>
</style>
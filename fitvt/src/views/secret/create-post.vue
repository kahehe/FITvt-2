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
};

<style scoped>
</style>
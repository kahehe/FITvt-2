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
 main section {
	 padding: 15px;
	 color: #eee;
	 margin: 1rem 0;
	 text-align: center;
	 background-color: #212936;
}
 main section h3 {
	 float: left;
}
 main #workout-select select {
	 background-color: #212936;
	 color: #eee;
}
 main #workout-select select span {
	 display: none;
}
 main #workout-title input, main #post-title input {
	 width: 50%;
	 background-color: #a7b5cb;
	 height: 10vh;
	 border: none;
	 border-radius: 15px;
}
 main #workout-title input:focus, main #post-title input:focus {
	 background-color: #c7d0de;
	 outline: none;
}
 main #workout-desc textarea {
	 width: 60%;
	 background-color: #a7b5cb;
	 border: none;
	 border-radius: 15px;
	 padding: 20px;
}
 main #workout-image input {
	 background-color: #a7b5cb;
}
 main button {
	 background-color: #008cff !important;
	 border-radius: 20px;
	 color: #eee;
}
 
</style>
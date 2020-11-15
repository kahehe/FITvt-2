<template>
  <div class="create-workout main">
    <Spinner v-if="loading" />
    <aside class="left"><SideBar /></aside>
    <main>
      <sNavBar />
      <p class="error" v-if="error">{{ error }}</p>
      <section id="workout-select">
        <h3>Select your workout:</h3>
        <br /><br />
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
        <br />
        <input type="file" @change="inputChange" />
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
import CalendarChart from "@/components/secret/CalendarChart";
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
    newWorkout() {
      //getting the description and title from the selected workout
      let select = this.select.split("$");
      let wdescription = select[0];
      let wtitle = select[1];
      //enable the spinner when we are uploading to firestore
      this.loading = true;
      //make sure that all of the inputs have recieved a valid value
      if (!this.file) {
        this.file = "placeholder";
      }
      if (this.file && this.title.length > 3) {
        //create a storage ref
        let storageRef = firebase.storage().ref(`photos/${this.file.name}`);
        //upload the file to storage ref
        let task = storageRef.put(this.file);
        task.on(
          "state_changed",
          function progress() {
            console.log("in progress");
          },
          function error(err) {
            console.log(err);
          },
          async () => {
            try {
              //get the url of the image from storage and save it in firestore
              let url = await task.snapshot.ref.getDownloadURL();
              this.url = url;
              console.log(url);
              let uid = this.$store.state.UID || localStorage.getItem("UID");
              await window.db.collection("post").add({
                title: this.title,
                url: this.url,
                wtitle,
                wdescription,
                uid,
              });
              this.loading = false;
              this.$router.push("/secret/profile");
            } catch (error) {
              console.log(error);
            }
          }
        );
      }
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
</script>

<style scoped>
.main {
  display: flex;
}
aside,
main {
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
main #workout-title input,
main #post-title input {
  width: 50%;
  background-color: #a7b5cb;
  height: 10vh;
  border: none;
  border-radius: 15px;
}
main #workout-image input {
  background-color: #a7b5cb;
}
main button {
  background-color: #008cff !important;
  border-radius: 20px;
  color: #eee;
}

.btn {
  background-color: transparent;
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  outline: none;
  overflow: hidden;
  letter-spacing: 1.2px;
  border: none;
  font-size: 1.1rem;
}
</style>

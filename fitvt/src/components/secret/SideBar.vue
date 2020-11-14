<template>
  <section>
    <Spinner v-if="loading" />
    <header>
      <div class="profile-image">
        <input type="file" @change="inputChange" />
        <img
          :src="
            profileImageUrl ||
            'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
          "
          alt="avatar"
          id="avatar"
        />
      </div>
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
        <p>FITvt</p>
      </div>
    </header>
    <br />
    <br />
    <div class="name">
      <h3>{{ username }}</h3>
    </div>
    <br />
    <hr />
    <br />
    <div class="friends">
      <p>Friends</p>
      <router-link to="/secret/all-users">
					<img src = "@/assets/addfriends.png" style="width:25px "/>
				</router-link>
    </div>
    <br />
    <div class="friends-list">
      <div
        class="friend"
        v-for="(friend, index) in friends"
        :key="index"
        @click="toUserProfile(friend.uid)"
      >
        <img
          :src="
            friend.url ||
            'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
          "
          alt="profile-image"
          id="avatar"
        />
        <p>
          <span style="font-size: 1rem">
            <strong>{{ friend.username }}</strong>
          </span>

          <br />New York
        </p>
        <img 
          title="unfriend this user" 
          @click="removeFriend(friend.username)" 
          src = "@/assets/delete.png"  
          />
      </div>
      <br />
    </div>
    <button class="btn" @click="logout">LOGOUT</button>
  </section>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import Spinner from "@/components/Spinner";
export default {
  components: { Spinner },
  data() {
    return {
      url: "",
      loading: false,
      profileImageUrl: "",
      friends: [],
    };
  },
  methods: {
    async logout() {
      await firebase.auth().signOut();
      localStorage.removeItem("UID");
      this.$store.commit("removeUID");
      this.$router.push("/login");
    },
    inputChange(e) {
      this.loading = true;
      let file = e.target.files[0];

      let storageRef = firebase.storage().ref(`profileImg/${file.name}`);
      //upload the file to storage ref
      let task = storageRef.put(file);
      task.on(
        "state_changed",
        function progress() {
          //console.log(snapshot);
        },
        function error(err) {
          console.log(err);
        },
        async () => {
          let uid = this.$store.state.UID || localStorage.getItem("UID");
          let url = await task.snapshot.ref.getDownloadURL();
          this.url = url;
          //save this url in profile-image collection
          await window.db.collection("profile-image").doc(uid).set({
            uid: uid,
            url: this.url,
          });
          this.loading = false;
          //after saving the url of profile image redirecting to the same page
          this.$router.go(this.$router.currentRoute.path);
        }
      );
    },
    removeFriend(name) {
      //console.log(name);
      let arrOfFriends = JSON.parse(localStorage.getItem("friends"));
      console.log(arrOfFriends.length);
      //if there is one elment in array we dont need any calc just remove it
      if (arrOfFriends.length == 1) {
        arrOfFriends = [];
      } else {
        arrOfFriends.forEach((friend, index) => {
          //remove the user which is clicked
          if (friend.username == name) {
            arrOfFriends.splice(index, 1);
          }
        });
      }
      //clearin the storage
      localStorage.removeItem("friends");
      //setting newArray to local storage with all the changes
      localStorage.setItem("friends", JSON.stringify(arrOfFriends));
      this.$router.go("/secret/all-users");
    },
    //get to the profile of clicked user
    toUserProfile(uid) {
      this.$router.replace({ path: `/secret/profile/user/${uid}` });
    },
  },
  computed: {
    username() {
      return this.$store.state.username || localStorage.getItem("username");
    },
  },
  async mounted() {
    if (localStorage.getItem("activity")) {
      localStorage.removeItem("activity");
    }
    let uid = this.$store.state.UID || localStorage.getItem("UID");
    let res = await window.db
      .collection("profile-image")
      .where("uid", "==", uid)
      .get();
    this.profileImageUrl = res.docs.length && res.docs[0].data().url;

    //retrieving all of the friends from localstorage
    let array = JSON.parse(localStorage.getItem("friends"));
    this.friends = array;
    //console.log(new Date().toString().indexOf(")"));
  },
};
</script>

<style scoped>
section {
  width: 100%;
  padding: 0 7px;
  position: relative;
  height: 100%;
}
section header {
  display: flex;
  justify-content: space-evenly;
}
section header .profile-image input {
  opacity: 0;
  position: relative;
  top: 40px;
  transform: scale(0.6, 3);
  cursor: pointer;
}
section header .profile-image #avatar {
  vertical-align: middle;
  width: 55px;
  height: 55px;
  border-radius: 50%;
}
section header .logo {
  display: flex;
  align-items: center;
  color: #eee;
  font-size: 2rem;
  user-select: none;
  transform: translate(-80px, 10px);
}
section .name,
section .friends {
  display: flex;
  justify-content: space-between;
  color: #d5d5d5;
}
section .name i,
section .friends i {
  cursor: pointer;
}
section .friends a {
  background-color: #0070cc;
  padding: .5rem;
  border-radius: 70%;
  height: 25px;
  width: 25px;
}


section .friends-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #eee;
}
section .friends-list .friend {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
  cursor: pointer;
}
section .friends-list .friend #avatar {
  vertical-align: middle;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 10px;
}
section .friends-list .friend p {
  font-size: 0.85rem;
}
section .friends-list .friend p strong {
  cursor: pointer;
}
section .friends-list .friend i {
  cursor: pointer;
  margin-left: 10px;
}
section button {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: transparent;
  border: 1px solid #eee;
  padding: 5px 10px;
  cursor: pointer;
  color: #eee;
}
</style>
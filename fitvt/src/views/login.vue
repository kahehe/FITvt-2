<template>
  <div class="login main">
    <NavBar />
    <main>
      <div class="container">
        <section id="text">
          <h1>Welcome back, we’ve missed you!</h1>
        </section>
        <section id="form-image">
          <img src="@/assets/red-login.png" alt="usain-bolt" width="750" />
          <div class="form">
            <form>
              <input
                type="email"
                id="email"
                placeholder="aaronfit@gmail.com"
                v-model="email"
              />
              <input
                type="password"
                id="password"
                placeholder="*******"
                v-model="password"
              />
            </form>
            <button class="btn" @click="login">Login</button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import firebase from "firebase/app";
import "firebase/auth";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      let res = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);
      let uid = res.user.uid;
      this.$store.commit("setUID", uid);
      localStorage.setItem("UID", uid);
      this.$router.push("/secret/home");
    },
  },
};
</script>

<style scoped>
#nav {
  width: 100%;
  background-color: #212936;
  height: 65px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#nav .left {
  display: flex;
  align-items: center;
  color: #eee;
  cursor: pointer;
}
#nav .left p {
  font-size: 30px;
}
.neon-btn {
  transition: all 0.15s ease-in;
  color: #008cff;
}
.neon-btn:hover {
  background-color: #008cff;
  box-shadow: 0 0 20px #008cff, 0 0 30px #008cff, 0 0 40px #008cff,
    0 0 50px #008cff;
  color: #eee;
}
.neon-btn span {
  position: absolute;
  border-radius: 50%;
  background-color: #008cff;
  opacity: 1;
}
.neon-btn span:nth-child(1) {
  left: -100%;
  top: 0;
  width: 100%;
  height: 2px;
  animation: first-child 1s ease-in infinite;
}
.neon-btn span:nth-child(2) {
  left: 0;
  bottom: -100%;
  width: 3px;
  height: 100%;
  animation: second-child 0.8s ease-in infinite;
}
.neon-btn span:nth-child(3) {
  right: -100%;
  bottom: 0;
  width: 100%;
  height: 3px;
  animation: third-child 1s ease-in infinite;
}
.neon-btn span:nth-child(4) {
  top: -100%;
  right: 0;
  height: 100%;
  width: 3px;
  animation: forth-child 0.8s ease-in infinite;
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
@keyframes first-child {
  from {
    left: -100%;
    opacity: 1;
  }
  to {
    left: 100%;
    opacity: 0;
  }
}
@keyframes second-child {
  from {
    top: 100%;
    opacity: 1;
  }
  to {
    top: -100%;
    opacity: 0;
  }
}
@keyframes third-child {
  from {
    right: -100%;
    opacity: 1;
  }
  to {
    right: 100%;
    opacity: 0;
  }
}
@keyframes forth-child {
  from {
    top: -100%;
    opacity: 1;
  }
  to {
    top: 100%;
    opacity: 0;
  }
}
main {
  width: 100%;
  background-color: #2b3648;
}
main .container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
main .container #text h1 {
  color: #eee;
  font-size: 2.5rem;
  padding: 2rem 0 2rem 0;
}
main .container #text button {
  background-color: #4dafff;
}
main .container #form-image {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
main .container #form-image img {
  position: relative;
  bottom: 0;
}
main .container #form-image .form {
  min-width: 300px;
  width: 27%;
  background-color: #212936;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
main .container #form-image .form h1 {
  color: #eee;
  font-size: 2rem;
}
main .container #form-image .form form {
  width: 100%;
}
main .container #form-image .form form input {
  width: 100%;
  margin: 5px 0;
  height: 35px;
  font-size: 1.2rem;
  padding-left: 5px;
}
main .container #form-image .form form input::placeholder {
  color: #a2a2a2;
  padding-left: 5px;
}
main .container #form-image .form button {
  background-color: #4dafff;
}
</style>
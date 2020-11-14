<template>
  <div class="login main">
    <NavBar />
    <main>
      <div class="container">
        <section id="text">
          <h1>Welcome back, we’ve missed you!</h1>
        </section>
        <section id="form-image">
          <img src="@/assets/red-login.png" alt="usain-bolt" width="600" margin-bottom="0px" />
          <div class="form">
            <form>
              <p>Email Address</p>
              <input
                type="email"
                id="email"
                placeholder="aaronfit@gmail.com"
                v-model="email"
              />
              <p>Password</p>
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
  height: 350px;
  width: 27%;
  background-color: #212936;
  padding:20px;
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
}
main .container #form-image .form form p {
  font-size: 0.7rem;
  color: white;
  margin-bottom:0px;
}
main .container #form-image .form form input::placeholder {
  color: #a2a2a2;
  padding-left: 5px;
}
main .container #form-image .form button {
  background-color: #4dafff;
}
</style>
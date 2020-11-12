<template>
  <nav id="nav">
    <div class="left" @click="toMainPage">
      <img src="@/assets/logo.png" alt="logo" />
      <p>FITvt</p>
    </div>
    <div class="right">
      <button class="btn neon-btn" @click="toLogin" v-if="routeIsLogin">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        LOGIN
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    //show the login button only in home ('/') page
    routeIsLogin() {
      return this.$router.currentRoute.path === "/";
    },
  },
  methods: {
    toLogin() {
      this.$router.push("login");
    },
    toMainPage() {
      this.$router.push("/");
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
</style>
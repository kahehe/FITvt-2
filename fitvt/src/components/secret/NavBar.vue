<template>
  <nav>
    <router-link to="/secret/home">
      <img src = "@/assets/home.png" />
      <p>{{"Home"}}</p>
    </router-link>
    <router-link to="/secret/profile">
      <img src = "@/assets/user.png" />
      <p>{{"Profile"}}</p>
    </router-link>
    <router-link to="/secret/feedback">
      <img src = "@/assets/form.png" />
      <p>{{"Feedback"}}</p>
    </router-link>
    <router-link to="/secret/chat">
      <img src = "@/assets/chat.png" />
      <p>{{"Chat"}}</p>
    </router-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
}
nav p {
  margin-top: 5px;
  margin-bottom: 5px;
}

nav a {
  text-decoration: none;
  background-color: #212936;
  width: 70px;
  padding: 10px 20px;
  text-align: center;
  color: white;
  border-radius: 10px;
}
nav .router-link-active {
  background-color: #212936;
}
nav .router-link-active i,
nav .router-link-active p {
  color: white;
}
</style>
<template>
  <nav>
    <router-link v-for="(link, index) in links" :key="index" :to="link.path">
      <i :class="link.class"></i>
      <p>{{ link.text }}</p>
    </router-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { text: "Home", class: "fas fa-home fa-3x", path: "/secret/home" },
        {
          text: "Profile",
          class: "far fa-user-circle fa-3x",
          path: "/secret/profile",
        },
        {
          text: "Feedback",
          class: "far fa-newspaper fa-3x",
          path: "/secret/feedback",
        },
        { text: "Chat", class: "fas fa-comments fa-3x", path: "/secret/chat" },
      ],
    };
  },
};
</script>

<style scoped>
nav {
	 display: flex;
	 justify-content: space-around;
}
 nav a {
	 text-decoration: none;
	 background-color: #212936;
	 padding: 10px 20px;
	 text-align: center;
	 color: #a7b5cb;
	 border-radius: 10px;
}
 nav .router-link-active {
	 background-color: #0062b3;
}
 nav .router-link-active i, nav .router-link-active p {
	 color: white;
}
 
</style>
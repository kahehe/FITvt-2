<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
* {
  font-family: "Roboto", sans-serif;
}
.main {
  min-height: 100vh;
}
.loading-page {
  position: fixed;
  min-width: 100%;
  min-height: 100%;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #212936;
}
.error {
  color: red;
}
.single-post {
  background-color: #42536e;
  margin-bottom: 100px;
  border-radius: 20px;
}
.single-post #delete-btn {
  color: #eee;
  border: none;
  background-color: darkred;
  padding: 2px;
  cursor: pointer;
}
.single-post .profile {
  display: flex;
  align-items: center;
}
.single-post .profile #avatar {
  vertical-align: middle;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin: 10px 5px 0 10px;
}
.single-post .title_image {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.single-post .title_image h1 {
  margin: 0 10px;
  font-size: 3rem;
}
.single-post .title_image .desc {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.single-post .title_image .desc * {
  margin: 1rem 0;
}
.single-post .title_image .desc p {
  padding: 10px;
}
.single-post .title_image .desc img {
  max-width: 250px;
  float: right;
  position: relative;
  right: 0;
  display: block;
  margin: auto;
  height: 250px;
}
.icons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #eee;
}
.icons i {
  margin-left: 10px;
  cursor: pointer;
}
form {
  margin: 10px;
}
form input {
  width: 70%;
  margin: 10px auto;
  background-color: #677fa5;
  color: #eee;
  border: none;
  padding: 5px;
}
form input::placeholder {
  color: #eee;
  padding: 5px;
}
form button {
  background-color: #677fa5;
  border: none;
  outline: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #eee;
}
</style>

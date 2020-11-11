<template>
  <div class="after-sign-up main">
    <NavBar />
    <main>
      <div class="container">
        <section id="text">
          <h1>Welcome to FITvt, Aaron!</h1>
          <button class="btn">Let's get Started</button>
        </section>
        <section id="form-image">
          <img src="@/assets/white-welcome.png" alt="usain-bolt" width="750" />
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
  components: {
    NavBar,
  },
};
</script>

<style>
.container {
    transform: translateX(-130px);
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
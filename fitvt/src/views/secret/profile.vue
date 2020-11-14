<template>
	<div class="profile main">
		<Spinner v-if="loading" />
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<section id="my-workouts">
				<h3><span>My Workouts</span></h3>
				<div class="create-workout" style="margin-top: 1rem">
					<router-link to="/secret/profile/create-workout">
						<img src = "@/assets/smallplus.png" />
						create new workout
					</router-link>
				</div>
				<ul>
					<li
						v-for="(post, index) in posts"
						:key="index"
						@click="showPost(post)"
					>
						<p>{{ post.title }}</p>
					</li>
					<br />
				</ul>
			</section>

			<section id="saved-workouts">
				<h3><span>Saved Workouts</span></h3>
				<ul>
					<li v-for="(workout, index) in savedWorkouts" :key="index">
						<p @click="openSavedW(workout)">
							{{ workout.title }}
						</p>
					</li>
				</ul>
			</section>
			<section id="my-posts">
				<h3><span>My Posts</span></h3>
				<br />
				<div class="create-workout">
					<router-link to="/secret/create-post">
						<img src = "@/assets/smallplus.png" />
						make your post
					</router-link>
				</div>
				<div class="single-post" v-for="(post, index) in myPosts" :key="index">
					<button style="cursor:pointer" id="delete-btn" @click="deletePost(post.documentId)">
						Delete
					</button>
					<div class="profile">
						<p>{{ post.username }}</p>
					</div>

					<div class="title_image">
						<h1>{{ post.title }}</h1>
						<div class="desc">
							<h4>Exercise</h4>
							<p>{{ post.wdescription }}</p>
							<img :src="post.url" alt="exercise_image" />
						</div>
					</div>
					<div class="icons">
						<img style="cursor:pointer; padding-left:5px; padding-bottom:8px" title="See the comments" src = "@/assets/comment.png" @click="showComments(post.documentId)" />
						<img style="cursor:pointer; padding-left:5px; padding-bottom:8px" title="Like this post" src = "@/assets/heart.png" @click="like(post.documentId)" :id="post.documentId" />
						
						<span
							style="font-size: 1.4rem; margin-left: 5px"
							id="like_amount"
							>{{ likes[post.documentId] }}</span
						>
					</div>
				</div>
			</section>
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
import swal from "sweetalert";
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
			loading: true,
			username: "",
			posts: [],
			savedWorkouts: [],
			myPosts: [],
			likes: {},
		};
	},
	methods: {
		showPost(post) {
			console.log(post);
			var div = document.createElement("div");
			div.innerHTML = `
      <h2 style='margin-bottom:15px'>${post.title}</h2>
      <p>${post.description}</p>
      <input hidden value=${post.documentId} id='documentId'>
      `;
			swal({
				content: div,
				buttons: ["Delete this workout", "ok"],
			});
			let deleteBtn = document.querySelector(".swal-button--cancel");
			deleteBtn.addEventListener("click", async () => {
				let documentId = document.querySelector("#documentId");
				await window.db
					.collection("workout")
					.doc(documentId.value)
					.delete();
				//redirect to the same page(profile)
				this.$router.go("/secret/profile");
			});
		},
		openSavedW(workout) {
			console.log(workout);
			var div = document.createElement("div");
			div.innerHTML = `
      <h2>${workout.title}</h2>
      <p>${workout.description}</p>
      <input hidden value=${workout.documentId} id='documentId'>
      `;
			swal({
				content: div,
				buttons: ["Delete this Post", "ok"],
			});
			let deleteBtn = document.querySelector(".swal-button--cancel");
			deleteBtn.addEventListener("click", async () => {
				let documentId = document.querySelector("#documentId");
				await window.db
					.collection("saved-post")
					.doc(documentId.value)
					.delete();
				this.$router.go("/secret/profile");
			});
		},
		async deletePost(docId) {
			await window.db
				.collection("post")
				.doc(docId)
				.delete();
			this.$router.go("/secret/profile");
		},

		async showComments(docId) {
			//clearing the array for not adding the new data to current
			this.comments = [];
			//getting all of the objects which is stored in array
			let res = await window.db
				.collection("comment")
				.where(firebase.firestore.FieldPath.documentId(), "==", docId)
				.get();
			res.docs.length &&
				res.docs[0].data().text.forEach((comment) => {
					this.comments.push(comment);
				});
			//creating a <section><section/> for displaying the comments
			let swalContent = document.createElement("section");
			swalContent.innerHTML = "";
			//looping thorugh the comments array[name,comment] and outputing a div for each item
			this.comments.forEach((comment) => {
				let div = document.createElement("div");
				div.style =
					"display:flex;justify-content:space-between;margin-bottom:5px;border:1px solid gray;padding:10px";
				div.innerHTML = `
          <h4>${comment.name}</h4>
          <h5>${comment.comment}</h5>
          `;
				swalContent.append(div);
			});
			swal({
				title: "Comments",
				content: swalContent,
				allowOutsideClick: "true",
			});
		},

		async like(docId) {
			console.log(docId);
			try {
				//check if there is a document (not the first time that we want to add smth)
				await window.db
					.collection("like")
					.doc(docId)
					.update({
						text: firebase.firestore.FieldValue.arrayUnion({
							uid: localStorage.getItem("UID"),
						}),
					});
			} catch (err) {
				//if it is the first time that we want to add smth to the collection
				if (err.message.slice(0, 21) == "No document to update") {
					await window.db
						.collection("like")
						.doc(docId)
						.set({
							text: [
								{
									uid: localStorage.getItem("UID"),
								},
							],
						});
				}
			}
			this.$forceUpdate();
		},
	},
	async mounted() {
		let uid = this.$store.state.UID || localStorage.getItem("UID");
		//fetching username from the firestore
		let res = await window.db
			.collection("username")
			.where("uid", "==", uid)
			.get();
		this.username = res.docs.length && res.docs[0].data().username;
		//save username in store
		this.$store.commit("setuname", this.username);
		//save username in localstorage in case if user refreshes the page
		localStorage.setItem("username", this.username);
		//fetch posts for the one person (owner)
		let res2 = await window.db
			.collection("workout")
			.where("uid", "==", uid)
			.get();

		res2.docs.length &&
			res2.docs.forEach((post, index) => {
				this.posts.push(post.data());
				//adding the document id of each post to this.posts array for use them in delete
				this.posts[index].documentId = post.id;
			});

		//fetch the saved workouts
		let res3 = await window.db
			.collection("saved-post")
			.where("uid", "==", uid)
			.get();
		let array = [];
		res3.docs.forEach((post) => {
			array.push(Object.assign(post.data(), { documentId: post.id }));
		});
		//remove duplicates
		this.savedWorkouts = array.filter(
			(v, i, a) => a.findIndex((t) => t.title === v.title) === i
		);
		//for getting the posts of the user only
		let res4 = await window.db
			.collection("post")
			.where("uid", "==", uid)
			.get();
		res4.docs.length &&
			res4.docs.forEach((post, index) => {
				this.myPosts.push(post.data());
				this.myPosts[index].documentId = post.id;
			});
		console.log(this.myPosts);
		await window.db.collection("like").onSnapshot((snapshot) => {
			snapshot.docs.forEach((item) => {
				this.likes[item.id] = item.data().text.length;
			});
		});
		console.log(this.likes);
		this.$forceUpdate();
		this.loading = false;
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
  background-color: #212936;
  color: #eee;
  margin: 2rem 0;
}
main section h3 span {
  padding: 5px 10px;
  background-color: #677fa5;
  border-radius: 20px;
}
main section ul {
  padding: 10px;
}
/* main section ul li p {
  text-decoration: none;
  position: relative;
  left: 0;
  color: unset;
  float: left;
  cursor: pointer;
  text-decoration: underline;
} */

main section ul li p {
  text-align: left;
  cursor: pointer;
  text-decoration: underline;
}

.create-workout {
  text-align: center;
  margin-top: -1rem;
  background-color: #212936;
  padding: 2rem 1rem;
}
.create-workout a {
  padding: 10px 15px;
  margin: 20px 0;
  background-color: #008cff;
  border-radius: 20px;
  color: #eee;
  text-decoration: none;
  line-break: auto;
}
.single-post {
	background-color: #42536e;
	margin-bottom: 100px;
	border-radius: 20px;
	position: relative;
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
	max-width: 230px;
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
	max-width: 400px;
	float: right;
	position: relative;
	right: 10px;
	display: block;
	padding: 0.5rem;
}
 .single-post .icons {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	color: #eee;
}
 .single-post .icons i {
	margin-left: 10px;
	cursor: pointer;
}
 .single-post form {
	margin: 10px;
}
 .single-post form input {
	width: 70%;
	margin: 10px auto;
	background-color: #677fa5;
	color: #eee;
	border: none;
	padding: 5px;
}
 .single-post form input::placeholder {
	color: #eee;
	padding: 5px;
}
 .single-post form button {
	background-color: #677fa5;
	border: none;
	outline: none;
	padding: 5px 10px;
	cursor: pointer;
	color: #eee;
}
 
</style>

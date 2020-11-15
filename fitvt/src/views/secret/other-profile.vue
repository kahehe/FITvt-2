<template>
	<div class="other-profile main">
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<section id="saved-posts">
				<h1 style="margin: 2rem auto; color: white">
					<span>{{ username }}'s Workouts</span>
				</h1>
				<div>
					<ul>
						<li v-for="(workout, index) in workouts" :key="index">
							<p @click="openSavedW(workout)">
								{{ workout.title }}
							</p>
						</li>
					</ul>
				</div>
			</section>

			<section id="my-posts" style="color: #fff">
				<h1 style="margin: 2rem auto; color: white">
					<span>{{ username }}'s Posts</span>
				</h1>
				<br />
				<div class="single-post" v-for="(post, index) in posts" :key="index">
					<div class="profile">
						<img :src="post.profile_img ||'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'" alt="avatar" id="avatar" />
						<p>{{ username }}</p>
					</div>

					<div class="title_image">
						<h1 style="margin-left:100px">{{ post.title }}</h1>
						<div class="desc">
						<h4>Workout Title: {{ post.wtitle }}</h4>
						<p>Workout Details: {{ post.wdescription }}</p>
						<img :src="post.url" alt="exercise_image" />
						</div>
					</div>

					<div class="icons">
						<img style="cursor:pointer; padding-left:8px"
						title="Save this workout" 
						src = "@/assets/save.png"
						@click="savePost(post, Math.random())"
						:id="post.title.split(' ')[0] + '_' + (post.title.split(' ')[1] && post.title.split(' ')[1][0])" 
						/>
						<img style="cursor:pointer; padding-left:8px"
						title="See the comments" 
						src = "@/assets/comment.png"
						@click="showComments(post.docId)" 
						/>
						<img style="cursor:pointer; padding-left:8px"
						title="Like this post" 
						src = "@/assets/heart.png"
						@click="like(post.docId)" 
						:id="post.docId"
						/>
						
						<span style="font-size:1.4rem;margin-left:5px;" id="like_amount">{{
							likes[post.docId]
						}}</span>
						<form>
							<input type="text" placeholder="Your comment..." v-model="comment" style="width: 550px"/>
							<button @click.prevent="submitComment(post.docId)" style="margin-left:6px">
							<img style="height:10px" src = "@/assets/paper-plane.png" />
							</button>
						</form>
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
import swal from "sweetalert";
import firebase from "firebase/app";
export default {
	components: {
		SideBar,
		CalendarChart,
		sNavBar,
	},
	data() {
		return {
			username: "",
			posts: [],
			profileURL: "",
			comment: "",
			//we are getting the comments dynamicly from db
			comments: [],
			workouts: [],
			likes: {},
		};
	},

	methods: {
		async fetchData(id) {
			console.log(id);
			//getting the username
			let res = await window.db
				.collection("username")
				.where("uid", "==", id)
				.get();
			let name = res.docs.length && res.docs[0].data().username;
			this.username = name;
			//getting posts of respective user
			let res2 = await window.db
				.collection("post")
				.where("uid", "==", id)
				.get();
			res2.docs.length &&
				res2.docs.forEach((post) => {
					this.posts.push(
						Object.assign(post.data(), {
							docId: post.id,
						})
					);
				});

			//getting the url of profile image
			// let friends = JSON.parse(localStorage.getItem("friends"));
			// let specFriend = friends.filter((friend) => {
			// 	return friend.username == this.username;
			// });
			// this.profileURL = specFriend[0].url;
			// console.log(this.posts);
		},
		async submitComment(docId) {
			//adding the comment inside comment collection the same documentId as the post itself
			//and adding the comments inside an array. the format is array
			try {
				//check if there is a document (not the first time that we want to add smth)
				await window.db
					.collection("comment")
					.doc(docId)
					.update({
						text: firebase.firestore.FieldValue.arrayUnion({
							comment: this.comment,
							name: localStorage.getItem("username"),
						}),
					});
			} catch (err) {
				//if it is the first time that we want to add smth to the collection
				if (err.message.slice(0, 21) == "No document to update") {
					await window.db
						.collection("comment")
						.doc(docId)
						.set({
							text: [
								{
									comment: this.comment,
									name: localStorage.getItem("username"),
								},
							],
						});
				}
			}
			//clearing the input
			this.comment = "";
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
		//saving posts
		async savePost(post) {
			console.log(post);
			//post=>{docId,profileImage(owner),uid(owner),url,description,title}
			await window.db.collection("saved-post").add({
				uid: localStorage.getItem("UID"),
				title: post.title,
				description: post.wdescription,
				url: post.url,
				profile_img: post.profile_img,
			});
			//because space in id is not acceptable we have to replace the space with _
			let id =
				post.title.split(" ")[0] +
				"_" +
				(post.title.split(" ")[1] && post.title.split(" ")[1]) +
				post.docId[3] +
				post.docId[4];
			document.querySelector(`#${id}`).style.color = "#008cff";
			swal("Post saved successfully", "", "success");
		},

		openSavedW(workout) {
			console.log(workout);
			var div = document.createElement("div");
			div.innerHTML = `
      <h2>${workout.title}</h2>
      <p>${workout.description}</p>
      `;
			swal({
				content: div,
				button: "ok",
			});
		},
		async fetchWorkout() {
			//fetch the workouts of respective person
			let res2 = await window.db
				.collection("workout")
				.where("uid", "==", this.$route.params.id)
				.get();
			let array = [];
			res2.docs.forEach((post) => {
				array.push(Object.assign(post.data(), { documentId: post.id }));
			});
			//remove duplicates
			this.workouts = array.filter(
				(v, i, a) => a.findIndex((t) => t.title === v.title) === i
			);
		},

		async like(docId) {
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

	watch: {
		"$route.params": {
			handler(newValue) {
				const { id } = newValue;
				this.posts = [];
				this.workouts = [];
				this.fetchData(id);
				this.fetchWorkout();
			},
			immediate: true,
		},
	},
	async mounted() {
		this.fetchWorkout();
		//  res2.docs.forEach(like=>{
		//    this.likes[like.id] = like.data().text.length;
		//  })
		await window.db.collection("like").onSnapshot((snapshot) => {
			snapshot.docs.forEach((item) => {
				this.likes[item.id] = item.data().text.length;
			});
		});
		this.$forceUpdate();
	},
};
</script>

<style scoped>
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
	margin-left: 10px;
}
 .single-post .icons i {
	margin-left: 15px;
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

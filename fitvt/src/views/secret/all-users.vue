<template>
	<div class="all-users main">
		<Spinner v-if="loading" />
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<section id="all-users">
				<h3>All Users</h3>
				<br /><br /><br />
				<input type="text" placeholder="Search" v-model="search" />
				<div
					class="single-user"
					v-for="(user, index) in filteredUsers"
					:key="index"
				>
					<div class="img-name">
						<img
							:src="
								user.url ||
									'https://www.showflipper.com/blog/images/default.jpg'
							"
							alt="profile-image"
							id="avatar"
						/>
						<p>{{ user.username }}</p>
					</div>
					<div class="add-btn">
						<button
							class="btn"
							@click="addToFriends(user.uid, user.username, user.url)"
						>
							<img src = "@/assets/plus.png" />
						</button>
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
export default {
	components: {
		SideBar,
		CalendarChart,
		sNavBar,
		Spinner,
	},
	data() {
		return {
			users: [],
			loading: true,
			search: "",
		};
	},
	computed: {
		filteredUsers() {
			return this.users.filter((user) => {
				return user.username.match(this.search);
			});
		},
	},

	methods: {
		addToFriends(uid, username, url) {
			//there is an array in localstorage so we can just push the new friend to it
			if (localStorage.getItem("friends")) {
				let array = JSON.parse(localStorage.getItem("friends"));
				if (array.some((user) => user.uid === uid)) {
					//user is duplicated so we cant add to storage
					console.log("user is already in storage");
					swal(
						`${username} is already your friend!`,
						"",
						"info"
					);
				} else {
					//this user is new so we can add it
					array.push({ uid, username, url });
					localStorage.removeItem("friends");
					localStorage.setItem("friends", JSON.stringify(array));
					swal(
						`You added ${username}!`,
						"",
						"success"
					).then(() => {
						this.$router.go("/secret/all-users");
					});
				}
			}
			//if it is the first time that we are saving to friends to localstorage
			else {
				console.log(uid, username, url);
				localStorage.setItem(
					"friends",
					JSON.stringify([{ uid, username, url }])
				);
				swal(
					`You added ${username}!`,
					"",
					"success"
				).then(() => {
					this.$router.go("/secret/all-users");
				});
			}
		},
	},
	async mounted() {
		this.users = [];
		this.loading = true;
		let uid = this.$store.state.UID || localStorage.getItem("UID");
		//getting all of the usernames except the username of the current user
		let res = await window.db
			.collection("username")
			.where("uid", "!=", uid)
			.get();
		res.docs.forEach((item) => {
			this.users.push(item.data());
			//console.log(item.data());
		});
		//because this.users is not available inside the function Im creating a new variable
		let usersWithProfileImg = [];
		async function addImageToUserArr(users) {
			//looping through the this.users (user) array and fetching the url of the respective uid
			for (let user of users) {
				let res2 = await window.db
					.collection("profile-image")
					.where("uid", "==", user.uid)
					.get();
				//creating a new key in users array
				user.url = res2.docs.length && res2.docs[0].data().url;
				usersWithProfileImg.push(user);
			}
		}
		addImageToUserArr(this.users).then(() => {
			//setting the users array to a new array that is containing the url of the image
			this.users = [...usersWithProfileImg];
			this.loading = false;
		});
		console.log(this.users);
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

main #all-users {
	margin: 2rem 0;
	background-color: #212936;
	padding: 1rem;
}
main #all-users h3 {
	color: #eee;
	float: left;
}
main #all-users input {
	background-color: #677fa5;
	border: none;
	width: 70%;
	color: #eee;
	padding: 7px;
	border-radius: 10px;
	margin-bottom: 10px;
}
main #all-users input::placeholder {
	color: #eee;
}
main #all-users .single-user {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}
main #all-users .single-user .img-name {
	display: flex;
	align-items: center;
}
main #all-users .single-user .img-name img {
	vertical-align: middle;
	width: 80px;
	height: 80px;
	border-radius: 50%;
}
main #all-users .single-user .img-name p {
	margin-left: 10px;
	color: #eee;
}
main #all-users .single-user .img-name .add-btn button {
	color: #eee;
	background-color: #008cff;
	padding: 10px;
	border-radius: 100%;
}
</style>

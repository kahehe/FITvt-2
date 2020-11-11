<template>
	<div class="chat main">
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<section id="chat">
				<div
					class="single-user"
					v-for="(user, index) in users"
					:key="index"
					@click="goToUser(user.uid, user.username)"
				>
					<img
						:src="
							user.url ||
								'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
						"
						alt="avatar"
						id="avatar"
					/>
					<div class="text">
						<h3>{{ user.username }}</h3>
						<p v-if="!isLast_msg(user.uid)">click to start your conversation</p>
						<p v-if="isLast_msg(user.uid)">{{ last_msg }}</p>
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
export default {
	components: {
		SideBar,
		CalendarChart,
		sNavBar,
	},
	data() {
		return {
			users: [],
			last_msg: "",
		};
	},

	methods: {
		goToUser(uid, username) {
			this.$router.push("/secret/chat/user/" + uid);
			//also add the image url and username to store
			this.$store.commit("setChatUsername", username);
		},
		isLast_msg(uid) {
			let friends_arr = JSON.parse(localStorage.getItem("friends"));
			let friend = friends_arr.find((item) => item.uid == uid);
			if (friend.last_msg) {
				this.last_msg = friend.last_msg;
				return true;
			} else {
				return false;
			}
		},
	},
	async mounted() {
		let friends = JSON.parse(localStorage.getItem("friends"));
		this.users = friends;
		console.log(this.users);
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

#chat {
	margin: 2rem 0;
	background-color: #212936;
}
#chat .single-user {
	display: flex;
	margin: 2rem 0;
	color: #eee;
	padding: 1rem;
	cursor: pointer;
}
#chat .single-user img {
	vertical-align: middle;
	width: 55px;
	height: 55px;
	border-radius: 50%;
	margin: 0 1rem;
}
</style>

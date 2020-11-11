<template>
	<div class="home main">
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<friend-posts />
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
import Friendposts from "@/components/secret/Friend-posts";
export default {
	components: {
		SideBar,
		CalendarChart,
		sNavBar,
		"friend-posts": Friend_posts,
	},
};
</script>

<style scoped>
#home {
	margin: 2rem 0;
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
</style>

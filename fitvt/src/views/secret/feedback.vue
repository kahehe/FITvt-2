<template>
	<div class="feedback main">
		<aside class="left"><SideBar /></aside>
		<main>
			<sNavBar />
			<section id="feedback">
				<h2>Help us grow by sharing any feedback with us!</h2>
				<br /><br /><br />
				<label>Type of feedback:</label>
				<br />
				<select v-model="feedbackKind">
					<option value="bugs">Bugs</option>
					<option value="general">General Feedback</option>
				</select>
				<br />
				<br />
				<br />
				<br />
				<label>Details:</label><br />
				<textarea
					id=""
					cols="70"
					rows="10"
					v-model="feedbackDescription"
					placeholder="details of your feedback"
				>
Details of feedback</textarea
				>
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
				<button class="btn" @click="submit" v-show="showSubmitBtn">
					Submit
				</button>
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
export default {
	components: {
		SideBar,
		CalendarChart,
		sNavBar,
	},
	data() {
		return {
			feedbackKind: "",
			feedbackDescription: "",
			showSubmitBtn: true,
		};
	},
	methods: {
		async submit() {
			//removing the submit button after it is clicked to prevent multiple requests at once
			this.showSubmitBtn = false;
			await window.db.collection("feedback").add({
				"feedback-title": this.feedbackKind,
				"feedback-detail": this.feedbackDescription,
			});
			swal(
				"thanks for your feedback",
				"we will definitaly take it to consideration",
				"success"
			);
			//showing the submit button after ok button has been pressed in alert
			let alert_btn = document.querySelector(".swal-button-container");
			alert_btn.addEventListener("click", () => {
				this.showSubmitBtn = true;
				//also clear the inputs
				this.feedbackKind = "";
				this.feedbackDescription = "";
			});
		},
	},
};
</script>

<style scoped>
#feedback {
	margin: 2rem 0;
}
#feedback h2 {
	color: #eee;
}
#feedback textarea,
#feedback select {
	background-color: #212936;
	color: #aeaeae;
	float: left;
	padding: 0.5rem;
}
#feedback label {
	color: #aeaeae;
	float: left;
}
#feedback button {
	float: left;
	background-color: #212936;
	color: #eee;
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
</style>

<template>
  <div class="chat-single main">
    <aside class="left"><SideBar /></aside>
    <main>
      <sNavBar />
      <section id="chat-single">
        <h2>{{ unameOfChattingPerson }}</h2>
        <div
          class="container"
          v-for="(message, index) in messages"
          :key="index"
        >
          <div :class="message.to == myUID ? 'other' : 'me'">
            <div v-if="message.to == myUID">
              <img
                :src="
                  other_profile_img ||
                  'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
                "
                id="avatar"
              />
              <p>{{ message.text }}</p>
            </div>
            <div v-if="message.to !== myUID">
              <p>{{ message.text }}</p>
              <img
                :src="
                  self_profile_img ||
                  'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
                "
                id="avatar"
              />
            </div>
          </div>
        </div>
        <div id="re">
          <input
            type="text"
            v-model="message"
            placeholder="write your message and click enter"
            @keypress.enter="sendMessage"
          />
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
import CalendarChart from "@/components/secret/Calendar-Chart";
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
      message: "",
      unameOfChattingPerson: "",
      messages: [],
      myUID: localStorage.getItem("UID"),
      self_profile_img: "",
      other_profile_img: "",
    };
  },
  methods: {
    async sendMessage() {
      await window.db.collection("chat").add({
        from: localStorage.getItem("UID"),
        to: this.$route.params.id,
        text: this.message,
        date: new Date(),
      });
      this.message = "";
      console.log("sent");
      let chatBox = document.querySelector("#chat-single");
      setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 300);
    },
  },
  async mounted() {
    this.unameOfChattingPerson = this.$store.state.chattingUsername;
    await window.db
      .collection("chat")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (
            change.type == "added" &&
            (change.doc.data().to == this.$route.params.id ||
              change.doc.data().to == localStorage.getItem("UID")) &&
            (change.doc.data().from == localStorage.getItem("UID") ||
              change.doc.data().from == this.$route.params.id)
          ) {
            this.messages.push(change.doc.data());
          }
        });
        //saving the last message of each chat in local storage for display in chat page
        let last_msg =
          this.messages.length && this.messages[this.messages.length - 1];
        let friends_arr = JSON.parse(localStorage.getItem("friends"));
        friends_arr.forEach((friend, index) => {
          if (friend.username == this.$store.state.chattingUsername) {
            friends_arr[index].last_msg = last_msg.text;
          }
        });
        console.log(friends_arr);
        localStorage.removeItem("friends");
        localStorage.setItem("friends", JSON.stringify(friends_arr));
      });
    let chatBox = document.querySelector("#chat-single");
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 700);
    //getting profile images for display beside the chat(text)
    let res = await window.db
      .collection("profile-image")
      .where("uid", "==", this.myUID)
      .get();
    this.self_profile_img = res.docs.length && res.docs[0].data().url;
    let res2 = await window.db
      .collection("profile-image")
      .where("uid", "==", this.$route.params.id)
      .get();
    this.other_profile_img = res2.docs.length && res2.docs[0].data().url;
  },
};
</script>

<style scoped>

.main {
	 display: flex;
}
aside, main {
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

#chat-single {
	margin: 2rem 0;
	background-color: #212936;
	color: #eee;
	padding-bottom: 20px;
	height: 375px;
	overflow-y: scroll;
	position: relative;
}
#chat-single .container {
	width: 100%;
	height: 10vh;
}
#chat-single .container div #avatar {
	vertical-align: middle;
	width: 55px;
	height: 55px;
	border-radius: 50%;
}
#chat-single .container p {
	margin-top: 17px;
	display: flex;
	align-items: center;
	padding: 0 5px;
	border-radius: 20px;
}
#chat-single .me div {
	float: right;
	display: flex;
}
#chat-single .me div p {
	background-color: #56657f;
}
#chat-single .other div {
	float: left;
	display: flex;
}
#chat-single .other div p {
	background-color: #6886bb;
}
#chat-single #re {
	display: flex;
	align-items: flex-end;
	justify-content: center;
}
#chat-single #re input {
	width: 400px;
	position: fixed;
	top: 490px;
}
 

</style>
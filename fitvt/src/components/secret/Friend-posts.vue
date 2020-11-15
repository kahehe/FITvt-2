<template>
  <section id="home">
    <div class="single-post" v-for="(post, index) in posts" :key="index">
      <div class="profile">
        <img
          :src="
            post.profile_img ||
            'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-1-2.png'
          "
          alt=""
          id="avatar"
        />
        <p>{{ post.username }}</p>
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
        <img style="cursor:pointer; padding-left:6px"
          title="Save this workout" 
          src = "@/assets/save.png"
          @click="savePost(post, Math.random())"
          :id="randomId" 
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
        <span style="font-size:1.4rem;margin-left:5px;" id="like_amount">{{likes[post.docId]}}</span>
      <form>
        <input type="text" placeholder="Your comment..." v-model="comment" style="width: 550px"/>
        <button @click.prevent="submitComment(post.docId)" style="margin-left:6px">
          <img style="height:10px" src = "@/assets/paper-plane.png" />
        </button>
      </form>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "firebase/app";
import swal from "sweetalert";
export default {
  components: {},
  data() {
    return {
      posts: [],
      comment: "",
      //we are getting the comments dynamicly from db
      comments: [],
      randomId: null,
      likes:{},
    };
  },
  methods: {
    async submitComment(docId) {
      //adding the comment inside comment collection with the same documentId as the post itself
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
      //creating a section for displaying the comments
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
    async savePost(post, num) {
      console.log(post);
      this.randomId = post.title.split(" ")[0] + num.toString().split(".")[1];
      console.log(this.randomId);
      //post=>{docId,profileImage(owner),uid(owner),url,description,title}
      await window.db.collection("saved-post").add({
        uid: localStorage.getItem("UID"),
        title: post.title,
        description: post.wdescription,
        url: post.url,
        profile_img: post.profile_img,
      });
      //because space in id is not acceptable we have to replace the space with _
      document.querySelector(`#${this.randomId}`).style.color = "#008cff";
      swal({
        text: "post saved successfully", 
        icon: "success"});
    },
    async like(docId){
      try {
        //check if there is a document (not the first time that we want to add smth)
        await window.db
          .collection("like")
          .doc(docId)
          .update({
            text: firebase.firestore.FieldValue.arrayUnion({
              uid:localStorage.getItem('UID')
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
                  uid:localStorage.getItem('UID')
                },
              ],
            });
        }
      }
      this.$forceUpdate();
    }
  },
  async mounted() {
    let friends_array = JSON.parse(localStorage.getItem("friends"));
    let uids = [];
    //pushing all of the uids in friends array to uids array
    friends_array &&
      friends_array.forEach((friend) => {
        uids.push(friend.uid);
      });
    // and fetch all of the posts of our friends from firestore
    let res =
      friends_array.length &&
      (await window.db.collection("post").where("uid", "in", uids).get());
    res &&
      res.docs.forEach((item) => {
        let f = friends_array.findIndex((friend) => {
          return friend.uid == item.data().uid;
        });
        this.posts.push(
          Object.assign(item.data(), {
            username: friends_array[f].username,
            profile_img: friends_array[f].url,
            docId: item.id,
          })
        );
      });
          await window.db.collection('like').onSnapshot((snapshot)=>{
        snapshot.docs.forEach(item=>{
          this.likes[item.id] = item.data().text.length
        })
      });
      console.log(this.likes);
      this.$forceUpdate()
  },

};
</script>

<style scoped>

#home {
	margin: 2rem 0;
}
 #home p, #home h1, #home h4 {
	color: #eee;
}
 #home .single-post {
	background-color: #42536e;
	margin-bottom: 100px;
	border-radius: 20px;
	position: relative;
}
 #home .single-post .profile {
	display: flex;
	align-items: center;
}
 #home .single-post .profile #avatar {
	vertical-align: middle;
	width: 55px;
	height: 55px;
	border-radius: 50%;
	margin: 10px 5px 0 10px;
}
 #home .single-post .title_image {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
 #home .single-post .title_image h1 {
	margin: 0 10px;
	font-size: 3rem;
	max-width: 230px;
}
 #home .single-post .title_image .desc {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
 #home .single-post .title_image .desc * {
	margin: 1rem 0;
}
 #home .single-post .title_image .desc p {
	padding: 10px;
}
 #home .single-post .title_image .desc img {
	max-width: 400px;
	float: right;
	position: relative;
	right: 10px;
	display: block;
	padding: 0.5rem;
}
 #home .single-post .icons {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	color: #eee;
  margin-left: 10px;
}
 #home .single-post .icons i {
	margin-left: 15px;
	cursor: pointer;
}
 #home .single-post form {
	margin: 10px;
}
 #home .single-post form input {
	width: 70%;
	margin: 10px auto;
	background-color: #677fa5;
	color: #eee;
	border: none;
	padding: 5px;
}
 #home .single-post form input::placeholder {
	color: #eee;
	padding: 5px;
}
 #home .single-post form button {
	background-color: #677fa5;
	border: none;
	outline: none;
	padding: 5px 10px;
	cursor: pointer;
	color: #eee;
}
</style>
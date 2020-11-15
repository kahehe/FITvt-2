<template>
  <section>
    <div class="calendar">
      <vc-date-picker v-model="date" is-dark />
    </div>

    <div class="chart">
      <p>Activity</p>
      <trend
        :data="data"
        :gradient="['#008cff', '#008cff', '#008cff']"
        auto-draw
        smooth
        stroke-width="3"
        id="chart"
      ></trend>
      <span>Last 7 days</span>
    </div>
    <div class="create-workout" v-if="!isInCreatePage">
      <router-link to="/secret/profile/create-workout">
        <img src = "@/assets/smallplus.png" style="width:13px"/>
        Create New Workout
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
      data: [],
    };
  },
  computed: {
    isInCreatePage() {
      return this.$router.currentRoute.path == "/secret/profile/create-workout" || this.$router.currentRoute.path == "/secret/profile";
    },
  },
  mounted() {
    this.data = this.$store.state.activity;
    console.log(this.data);
  },
    watch: {
    '$store.state.activity': {
      handler: function (n) {
        console.log('sctivity changed')
        this.data = n
      },
      deep: true
    }
  }
};
</script>

<style scoped>

section {
	padding: 15px;
}
section * {
	margin: auto;
}
section .chart {
	text-align: center;
	color: #a7b5cb;
	background-color: #212936;
	margin-top: 2rem;
}
section .chart #chart {
	background-color: #212936;
}
section .create-workout {
	text-align: center;
	margin-top: 2rem;
	background-color: #212936;
	padding: 2rem 1rem;
}
 section .create-workout a {
	padding: 10px 15px;
	margin: 20px 0;
	background-color: #008cff;
	border-radius: 20px;
	color: #eee;
	text-decoration: none;
	line-break: anywhere;
}


</style>
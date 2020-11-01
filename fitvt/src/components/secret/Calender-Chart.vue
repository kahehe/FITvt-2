<template>
  <section>
    <div class="calendar">
      <vc-date-picker v-model="date" is-dark />
    </div>

    <div class="chart">
      <p>activity</p>
      <trend
        :data="data"
        :gradient="['#008cff', '#008cff', '#008cff']"
        auto-draw
        smooth
        stroke-width="3"
        id="chart"
      ></trend>
      <span>last 7 days</span>
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

</style>
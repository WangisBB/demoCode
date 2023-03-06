<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
		<el-input v-model="dataobj"></el-input>
      <el-button @click="startHacking">Start</el-button>{{dataobj}}
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
		dataobj:""
		}
	},

  methods: {
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  display: flex;
}
</style>

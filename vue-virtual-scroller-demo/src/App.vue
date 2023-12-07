<script >

import HelloWorld from './components/HelloWorld.vue'
import project from './components/project.vue'
const list = Array.from({ length: 2000 }, (e, i) => ({ name: 'name' + i, id: i + 1, value: 'value' + i, date: "2022-09-13", height: i / 200 ? '200' : '300' }))
export default {
  data () {
    return {
      list: list,
      show: false
    }
  },
  components: {
    HelloWorld,
    project
  }
}
</script>

<template>
  <div class="back">
    <img alt="Vue logo"
         src="./assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + Vite"
                :list="list" />

    <!-- <div>
      <button @click="show=!show"></button>
      <transition name="el-zoom-in-top">
        <ul v-if="show">
          <li>ssss</li>
          <li>ssss</li>
          <li>ssss</li>
        </ul>
      </transition>

    </div> -->
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

$--md-fade-transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
  opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) !default;
// $--md-fade-transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
//   opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) !default;
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  // transform: scaleY(1);
  transition: all 0.3s;
  display: inline-block;
  transform-origin: center top;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  position: absolute;
  // transform: scaleY(0);
}

.back {
  width: 100vw;
  height: 100vh;
  background: url('./back.jpg') center center no-repeat;
  background-size: cover;
  overflow: auto;
  // overflow: hidden;
}
.head {
  background: url('./h.jpg') right center no-repeat;
  height: 65px;
}
.l {
  background: url('./h-r.jpg') left center no-repeat;
  height: 65px;
}
.back-title {
  padding: 12vh 0 40px;
  font-weight: 600;
  text-align: center;
  font-size: 26px;
  color: #068e68;
}
</style>

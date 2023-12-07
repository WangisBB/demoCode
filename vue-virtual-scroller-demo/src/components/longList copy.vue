<template>
  <!-- <div class="hidden-scroll">
   
  </div> -->
  <div class="viewport"
       ref="viewport"
       @scroll="listener">
    <div class="list-phantom"
         ref="phantom"></div>
    <div class="list-area"
         ref="viewportList">
      <slot name="longList"
            v-bind:showList="showList"> </slot>
    </div>
  </div>
</template>

<script>
// const throttle = function (fn, time) {
//   let start, end;
//   return function () {
//     if (!start) {
//       fn.apply(this, arguments)
//       start = Date.now()
//     } else {
//       end = Date.now()
//       if (end - start >= time) {
//         fn.apply(this, arguments)
//         start = Date.now()
//       }
//     }
//   }
// }
const throttle = function (fn, time) {
  let timer
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, time);
    }
  }
}

export default {
  props: {
    list: Array,
    itemHeight: Number,
    showNum: Number,
    col: { default: 1 },
    buffer: { default: 20 }
  },
  data () {
    return {
      viewport: null,
      listPhantom: null,
      viewportList: null,
      start: 0,
      end: 0,
      bindId: null,
      scrollListener: throttle(this.listener, 17),
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.viewport = this.$refs['viewport'];
      this.listPhantom = this.$refs['phantom']
      this.viewportList = this.$refs['viewportList']
      this.end = this.showNum
      this.listPhantom.style.height = this.itemHeight * this.list.length + "px";//完整高度
    })
  },
  watch: {
    list () {
      this.listPhantom && (this.listPhantom.style.height = this.itemHeight * this.list.length + "px")//完整高度
    },
  },
  methods: {
    listener (v) {
      //获取滚动高度
      const { viewport, itemHeight, showNum } = this,
        scrollTop = viewport.scrollTop;
      //开始的数组索引
      const temp = this.buffer,
        currentStart = Math.floor(scrollTop / itemHeight),
        beforeStart = currentStart - temp,
        start = beforeStart < 0 ? 0 : beforeStart,
        end = currentStart + showNum + temp;
      console.log(start, end, scrollTop, start === this.start && end === this.end);
      this.viewportList.style.transform = `translateY(${scrollTop}px)`//对列表项进行偏移
      if (start === this.start && end === this.end) {
        return
      }
      console.log('true', scrollTop);
      this.start = start
      this.end = end

    },
  },
  computed: {
    showList () {
      const { list, start, end } = this
      return list.slice(start, end);
    }
  },
};
</script>

<style scoped >
.viewport {
  overflow-y: auto;
  width: 100%;
  position: relative;
  /* // width: calc(100% + 20px); */
}

.list-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
</style>

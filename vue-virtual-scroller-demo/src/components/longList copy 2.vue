<template>
  <div class="viewport"
       ref="viewport"
       @scroll="listener">
    <div class="list-phantom"
         ref="phantom"></div>
    <div class="list-area"
         ref="viewportList">
      <slot name="longList"
            v-bind:showList="pool"> </slot>
    </div>
  </div>
</template>

<script>
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
    buffer: { default: 200 },
    sizeField: {
      type: String,
      default: 'height',
    },
    direction: {
      type: String,
      default: 'vertical',
    },

  },
  data () {
    return {
      pool: [],
      viewport: null,
      listPhantom: null,
      viewportList: null,
      start: 0,
      end: 0,
      bindId: null,
      scrollListener: throttle(this.listener, 17),
      $_startIndex: 0,
      $_endIndex: 0,
    };
  },
  created () {
    this.$_startIndex = 0
    this.$_endIndex = 0
  },
  mounted () {
    this.$nextTick(() => {
      // In SSR mode, render the real number of visible items
      this.listener(true)
    })
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
    listener (checkItem, checkPositionDiff = false) {
      const itemHeight = this.itemHeight,
        list = this.list,
        count = list.length,
        buffer = this.buffer;
      let startIndex, endIndex, totalSize,
        pool = this.pool;


      if (!count) {
        startIndex = endIndex = totalSize = 0
      } else {
        const scroll = this.getScroll()


        startIndex = ~~((scroll.start - buffer) / itemHeight)
        endIndex = Math.ceil((scroll.end + buffer) / itemHeight)
        startIndex < 0 && (startIndex = 0)
        endIndex > count && (endIndex = count)

        console.log(startIndex, endIndex, scroll.start, scroll.end);
        if (this.viewportList) {
          this.viewportList.style.transform = `translateY(${scroll.start}px)`
        }
      }

      // const continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex

      this.pool = list.slice(startIndex, endIndex);
      this.$_endIndex = endIndex

      this.$_startIndex = startIndex

      // const { viewport, itemHeight, showNum } = this,
      //   scrollTop = viewport.scrollTop;
      // //开始的数组索引
      // const temp = this.buffer,
      //   currentStart = Math.floor(scrollTop / itemHeight),
      //   beforeStart = currentStart - temp,
      //   start = beforeStart < 0 ? 0 : beforeStart,
      //   end = currentStart + showNum + temp;
      // this.viewportList.style.transform = `translateY(${scrollTop}px)`//对列表项进行偏移
      // if (start === this.start && end === this.end) {
      //   return
      // }
      // console.log('true', scrollTop);
      // this.start = start
      // this.end = end

    },
    getScroll () {
      const { $el: el, direction } = this
      const isVertical = direction === 'vertical'
      let scrollState

      if (this.pageMode) {
        const bounds = el.getBoundingClientRect()
        const boundsSize = isVertical ? bounds.height : bounds.width
        let start = -(isVertical ? bounds.top : bounds.left)
        let size = isVertical ? window.innerHeight : window.innerWidth
        if (start < 0) {
          size += start
          start = 0
        }
        if (start + size > boundsSize) {
          size = boundsSize - start
        }
        scrollState = {
          start,
          end: start + size,
        }
      } else if (isVertical) {
        scrollState = {
          start: el.scrollTop,
          end: el.scrollTop + el.clientHeight,
        }
      } else {
        scrollState = {
          start: el.scrollLeft,
          end: el.scrollLeft + el.clientWidth,
        }
      }
      return scrollState
    },
  },
  computed: {
    showList () {
      const { list, start, end } = this
      // return list.slice(start, end);
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
  height: 80vh;
}

.list-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
</style>

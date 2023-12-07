<template>
  <div class="viewport"
       @scroll="listener">
    <div class="list-phantom"
         ref="phantom">
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
    buffer: { default: 20 },
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
      listPhantom: null,
      start: 0,
      end: 0,
      isRolldown: -1,
      scrollListener: throttle(this.listener, 170),
      $_endIndex: 0,
    };
  },
  created () {
    this.$_endIndex = 0
  },
  mounted () {
    this.$nextTick(() => {
      // In SSR mode, render the real number of visible items
      this.listener(true)
    })
    this.$nextTick(() => {
      this.listPhantom = this.$refs['phantom']
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
    listener () {
      const itemHeight = this.itemHeight,
        list = this.list,
        count = list.length,
        buffer = this.buffer;
      let startIndex, endIndex, totalSize,
        pool = this.pool;

        const scroll = this.getScroll()

        startIndex = ~~((scroll.start - buffer * itemHeight) / itemHeight)
        endIndex = Math.ceil((scroll.end + buffer * itemHeight) / itemHeight)
        startIndex < 0 && (startIndex = 0)
        endIndex > count && (endIndex = count)


        if (this.listPhantom) {
          // console.log(startIndex, endIndex, scroll.start, scroll.end, `${count * itemHeight - scroll.start}`);
          this.listPhantom.style.paddingTop = `${scroll.start}px`
        }

      this.isRolldown = this.start < scroll.start ? 1 : -1
     
     if(this.isRolldown===1){
       this.pool.splice(0,startIndex)
  console.log(startIndex);
      this.pool= this.pool.concat(this.list.slice(endIndex-buffer,endIndex))
      // for (let index = 0; index < buffer; index++) {
     
      //   this.pool.push(list[endIndex-buffer+index])
      // }
     }else{
       
       this.pool.splice(endIndex-buffer,buffer)
        this.pool= this.list.slice(startIndex,startIndex+buffer).concat(this.pool) 
      //  for (let index = 0; index < buffer; index++) {
      //   this.pool.unshift(list[startIndex-index])
      // }
     }


      this.start = scroll.start
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
      // return list.slice(start, end);
    }
  },
};
</script>

<style scoped >
.viewport {
  overflow-y: auto;
  width: 100%;
  /* // width: calc(100% + 20px); */
  height: calc(100vh - 220px);
}
</style>

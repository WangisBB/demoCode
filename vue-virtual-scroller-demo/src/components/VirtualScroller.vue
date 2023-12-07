<template>
  <div @scroll.passive="onScroll"
       class="scroll-wrap">
    <div v-if="list.length > 0"
         :style="{height: `${totalHeight}px`}"
         class="view-wrap">
      <div class="scroll-item"
           :id="item.id"
           v-for="(item, index) in pool"
           :key="item.id"
           :style="{transform: `translateY(${item.view.pos}px)`}">
        <slot :item="item.view.item"
              :index="item.view.index"
              :pos="item.view.pos"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualScroller',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    itemHeight: {
      type: Number,
      default: 0
    },
    keyField: {
      type: String,
      default: "id"
    },
    buffer: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      startIndex: 0,
      endIndex: 0,
      scrollItems: -1,
      showNum: 0,
      totalHeight: "auto",
      pool: [],
      views: null,
      keyid: 0,
      isInit: false,
    }
  },
  watch: {
    list: {
      handler () {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.views = new Map();
      this.pool = [];
      this.keyid = 0;
      this.isInit = false;
      this.startIndex = 0;
      this.endIndex = 0;
      this.scrollItems = -1;
      this.viewHeight = this.$el.getBoundingClientRect().height;
      this.totalHeight = this.list.length * this.itemHeight
      this.showNum = Math.ceil((this.viewHeight + this.buffer * 2) / this.itemHeight);
      if (!this.list.length <= 0) {
        this.updateItems();
      }
    },
    getPositionIndex () {
      this.startIndex = this.scrollItems;
      if (this.startIndex < 0) {
        this.startIndex = 0;
      }
      if (this.startIndex > this.list.length - this.showNum) {
        this.startIndex = this.list.length - this.showNum
      }
      this.endIndex = this.startIndex + this.showNum - 1;
    },
    onScroll (e) {
      requestAnimationFrame(() => {
        this.updateItems();
      });
    },
    updateItems () {
      const _scrollItems = this.scrollItems;
      const st = this.$el.scrollTop;
      this.scrollItems = Math.ceil((st - this.buffer) / this.itemHeight);
      const toDown = this.scrollItems > _scrollItems ? true : false
      if (this.scrollItems == _scrollItems && this.isInit) {
        return;
      }
      console.log("-----------------------更新开始------------------");
      const _startIndex = this.startIndex;
      const _endIndex = this.endIndex;
      this.getPositionIndex();
      console.log("滚动过的条数", this.scrollItems);
      console.log(_startIndex, "上次开始索引");
      console.log(_endIndex, "上次结束索引");
      console.log(this.startIndex, "这次开始索引");
      console.log(this.endIndex, "这次结束索引");
      let count = 0;
      let difCount = this.showNum - 1;
      let newItems = [];
      for (let i = this.startIndex; i <= this.endIndex; i++) {
        const item = this.list[i];
        const view = this.views.get(item[this.keyField]);
        if (!view) {
          this.views.set(item[this.keyField], {
            index: i,
            item,
            pos: this.itemHeight * i,
          });
        }
        if (this.pool.length < this.showNum) {
          this.pool.push({ id: this.keyid++, view: this.views.get(item[this.keyField]) });
        } else {
          const index = this.pool.findIndex(item => {
            return item.view.index === i;
          });
          if (index == -1) {
            newItems.push(item[this.keyField]);
          }
        }
      }
      console.log(newItems, "不存在的条目索引");
      if (toDown) {
        for (let i of newItems) {
          this.pool[count].view = this.views.get(i)
          count++;
        }
      } else {
        for (let i of newItems.reverse()) {
          this.pool[difCount].view = this.views.get(i)
          difCount--;
        }
      }
      this.pool.sort((viewA, viewB) => viewA.view.index - viewB.view.index);
      this.isInit = true;
      console.log(this.pool.map(item => item.id).toString(), "渲染池");
      console.log("-----------------------更新结束------------------");
    }
  },
  created () {
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll-wrap .view-wrap {
  position: relative;
}
.scroll-wrap .scroll-item {
  position: absolute;
}
</style>
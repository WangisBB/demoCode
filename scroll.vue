
<script>
import Bar from './bar.vue'
export default {
  props: {
    height: { default: "230px" },
  },
  data () {
    return {
      verticalStyle: '0px',
      horizontalStyle: '0px'
    };
  },
  render (h) {
    const view = h('div', {
      class: ['scroll_layout'],
      ref: 'scroll_layout',
      on: {
        mousewheel: this.mousewheel
      }
    }, this.$slots.default);
    console.log(h);
    return h(
      "div",
      { style: { height: this.height }, class: "scroll_box", ref: 'scroll_box' },
      [view,
        [
          h(Bar, { props: { size: this.verticalStyle } }),
          h(Bar, { props: { horizontal: true, size: this.horizontalStyle } })
        ]
      ]
    )
  },
  computed: {
    scrollBox () {
      return this.$refs.scroll_box
    },
    scrollLayout () {
      return this.$refs.scroll_layout
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.verticalStyle = this.scrollBox?.clientHeight / this.scrollLayout?.clientHeight * 100 + '%'
      this.horizontalStyle = this.scrollLayout?.clientWidth / this.scrollBox?.clientWidth * 100 + '%'
    })

  },
  methods: {
    mousewheel (e) {
      // e.preventDefault ? e.preventDefault() : e.returnValue = false;

      if (e.wheelDelta) {

      }
      console.log(e);
    },

  },

};
</script>

<style scoped lang="scss">
.scroll_box {
  position: relative;
  overflow: auto;

  // overflow: hidden;
  &:hover .scrollbar__wrap {
    .scroll_bar {
    }
  }
}
.scroll_box::after {
  content: '';
  display: block;
  margin-top: 20px;
}
</style>

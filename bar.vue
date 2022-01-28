

<script>
export default {
  props: {
    horizontal: Boolean,
    size: {}
  },
  render (h) {
    console.log(this.size);
    return h('div',
      { class: [{ "is-horizontal": this.horizontal, "is-vertical": !this.horizontal }, 'scrollbar__wrap'], ref: "scrollbar__wrap", },
      [h('div', { class: "scroll_bar", style: { height: this.size } })]
    )
  },
  data () {
    return {

    };
  },
};
</script>

<style scoped lang="scss">
.is-horizontal {
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  bottom: -20px;
  .scroll_bar {
    height: 20px;
    border-radius: 3px;
  }
}
.is-vertical {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  right: -20px;
  .scroll_bar {
    width: 20px;
    border-radius: 3px;
  }
}
.scroll_bar {
  background: #eee;
}
</style>

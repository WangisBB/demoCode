const install = (Vue, Popper) => {
  Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, bind) {
      const uid = crypto.randomUUID()
      el.setAttribute('id', uid)
      const val = bind.value
      console.log(Popper);
      let popper = document.querySelector(val)
      let pIntance = Popper.createPopper(el, popper, {
        placement: 'top',
        modifiers: {
          preventOverflow: {
            priority: ['top']
          }
        }
      });
      console.log(pIntance);
    }
  })
}
export default install
<template>
  <div>
    <div class="div1" draggable="true" style="background-color:#ff6a00;" @drop="drop" @dragover="dragover"  @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave">
      <p class="title">我是第一！</p>
    </div>
    <div class="div2" @drop="drop" @dragover="dragover" draggable="true" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave" style="background-color:#00ff21;">
      <p class="title">我是第二！</p>
    </div>
    <div class="div3" @drop="drop" @dragover="dragover" draggable="true" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave" style="background-color:red;">
      <p class="title">我是第三！</p>
    </div>

  </div>
</template>

<script>
var startDiv = null; //储存拖拽的元素
var temp = null;
//给子元素动态绑定事件
document.querySelectorAll(".title").forEach(function (item, index) {
  item.onclick = function () {
    console.log(index);
  };
});

export default {
  data() {
    return {
      activeDom: "",
    };
  },
  methods: {
    //在元素开始被拖动时候触发
    dragstart(e) {
      this.activeDom = e.target;
      //   this.activeDom.classList.add("dragging");
    },
    //在拖动操作完成时触发
    dragend(dom) {
      console.log("dragend");
      //   this.activeDom.classList.remove("dragging");
    },
    //当被拖动元素在目的地元素内时触发
    dragover(e) {
      //  console.log("dragover",e);

      e.preventDefault();
      if (e.target !== this.activeDom) {
        e.target.classList.add("drag-over");
      }
    },
    //当被拖动元素没有放下就离开目的地元素时触发
    dragleave(e) {
      console.log("dragleave");
      e.target.classList.remove("drag-over");
    },
    //当拖动完后,释放元素触发
    //如果子元素没有动态绑定的事件可用innerHTML方法，此方法会使动态绑定的事件不生效
    // function drop(e, dom) {
    // 	startDiv.classList.remove('dragging');
    // 	dom.classList.remove('drag-over');
    // 	if (startDiv !== dom) {
    // 		temp = startDiv.innerHTML;
    // 		startDiv.innerHTML = dom.innerHTML;
    // 		dom.innerHTML = temp;
    // 	}
    // }
    //如果子元素有动态绑定的事件可用下边方法
    drop(e, dom) {
      console.log("drop", e.target, this.activeDom);

      this.activeDom.classList.remove("dragging");
      e.target.classList.remove("drag-over");
      if (this.activeDom !== e.target) {
        const parent = e.target.parentElement;
        if (parent) {
          let temp = document.createElement("div");
            parent.replaceChild(temp, this.activeDom);
          parent.replaceChild(this.activeDom, e.target);
            parent.replaceChild(e.target, temp);
        }

        //   var startLen =  this.activeDom.children.length;
        //   var endLen =  e.target.children.length;
        //   for (; startLen--; ) {
        //      e.target.appendChild( this.activeDom.children[0]);
        //   }
        //   for (; endLen--; ) {
        //      this.activeDom.appendChild( e.target.children[0]);
        //   }
      }
    },
  },
};
</script>

<style>
.div1,
.div2,
.div3 {
  float: left;
  width: 100px;
  margin: 10px;
  height: 100px;
  border: 1px solid #ccc;
  transition: all linear 0.3s;
}

.div {
  height: 100%;
}

p {
  font-size: 20px;
  margin: 0;
}

.dragging {
    transition: all linear 0.3s;
  border: 3px solid blue !important;
}

.drag-over {
    transition: all linear 0.3s;
  border: 3px dashed purple !important;
}
</style>
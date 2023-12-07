<script >
import longList from "./longList.vue"
import VirtualScroller from "./VirtualScroller.vue"
export default {
  data () {
    return {

    }
  },
  created () {
    console.log(this.list);
  },
  props: {
    list: Array
  },
  components: { longList, VirtualScroller }
}

</script>

<template>
  <div class="box">
    <!-- :page-mode="true" -->
    <RecycleScroller :key="true"
                     ref="scroller"
                     class="scroller"
                     :items="list"
                     :item-size="80"
                     :buffer="200"
                     key-field="id"
                     size-field="height">

      <template v-slot="props">
        <div class="user">
          {{  props.item.name }}
        </div>
      </template>
    </RecycleScroller>
    <long-list :list="list"
               class="long-list"
               :itemHeight="80"
               :col="4"
               :showNum="12">
      <template v-slot:longList="slotProps">
        <div v-for="(brand,index) in slotProps.showList"
             style="height:80px"
             :key="index">{{brand}}</div>

      </template>
    </long-list>
    <!-- <VirtualScroller :list="list"
                     keyField="id"
                     class="scroller"
                     :itemHeight="200">

      <template v-slot="props">
        <div class="user">
          {{  props.item.name }}
        </div>
      </template>
    </VirtualScroller> -->
  </div>
</template>

<style scoped>
.box {
  display: flex;
}
.box > div {
  width: 50%;
}
.scroller {
  height: calc(100vh - 220px);
  overflow-y: auto;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
/* .long-list {
  height: calc(100vh - 220px);
} */
</style>

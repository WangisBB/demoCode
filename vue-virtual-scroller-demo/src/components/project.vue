<template>
  <div class="select-project-box">
    <el-input placeholder="搜索项目"
              prefix-icon="el-icon-search"
              class="search-box"
              clearable
              @change="search"
              v-model="projectName">
    </el-input>
    <div v-loading="loading">
      <ul class="select-project"
          v-if="showList && showList.length">
        <li v-for="(el) in showList"
            :key="el.id"
            class="item-hover">
          <div>{{el.name}}</div>
          <span>{{el.date}}</span>
        </li>
      </ul>
      <div class="empty"
           v-else>暂无项目</div>
    </div>
    <div class="more "
         v-show="showList && showList.length>=6"
         @click="more">
      更多项目...
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  },
  data () {
    return {
      num: 6,
      total: 0,
      projectName: "",
      showList: [],
      loading: false
    };
  },
  mounted () {
    this.total = this.list.length
    this.showList = this.list.slice(0, this.num)
  },
  methods: {
    more () {
      this.num += 6
      const projectName = this.projectName
      return this.showList = this.list.filter(e => e.name.indexOf(projectName) > -1).slice(0, this.num)
    },
    search () {
      this.num = 6
      this.loading = true
      setTimeout(() => {
        this.loading = false

      }, 400);
      const projectName = this.projectName
      this.showList = this.list.filter(e => e.name.indexOf(projectName) > -1).slice(0, this.num)
    },
  },

};
</script>

<style scoped lang="scss">
.search-box {
  width: 300px;
  margin: 0 auto 30px;
  display: block;
}
$back-color-opacity: rgba(
  $color: #ffffff,
  $alpha: 0.8,
);

$border-opacity: 0px 0px 0px 6px
  rgba(
    $color: #ffffff,
    $alpha: 0.5,
  );
.select-project-box {
  width: 750px;
  margin: 0 auto;
}
.select-project {
  list-style: none;
  li {
    float: left;
    width: 29%;
    background: $back-color-opacity;
    padding: 20px 8px;
    box-shadow: $border-opacity;
    margin: 20px 15px;
    text-align: center;
    border-radius: 5px;
    div {
      font-size: 20px;
      color: #333;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      color: #999;
      font-size: 16px;
    }
  }
  &:after {
    content: '';
    clear: both;
    display: block;
  }
}
.more {
  background: $back-color-opacity;
  text-align: center;
  padding: 4px 30px;
  width: 300px;
  margin: 30px auto 40px;
  cursor: pointer;
  &:hover {
    background: rgba($color: #ffffff, $alpha: 0.95);
  }
}
.item-hover {
  transition: all 400ms;
  cursor: default;
  &:hover {
    background: rgba($color: #ffffff, $alpha: 0.95);
    box-shadow: $border-opacity;
    transform: scale(1.08);
  }
}
.empty {
  height: 208px;
  background: $back-color-opacity;
  box-shadow: $border-opacity;
  text-align: center;
  line-height: 208px;
  font-size: 22px;
}
</style>

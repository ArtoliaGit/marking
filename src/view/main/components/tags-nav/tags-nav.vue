<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-outline"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="btn-con left-btn">
      <Button icon="chevron-left" type="text" @click="handleScroll(240)"></Button>
    </div>
    <div class="btn-con right-btn">
      <Button icon="chevron-right" type="text" @click="handleScroll(-240)"></Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            v-for="item in list"
            ref="tagsPageOpened"
            :key="`tag-nav-${item.name}`"
            :name="item.name"
            @on-close="handleClose"
            @click.native="handleClick(item)"
            :closable="item.name==='home'?false:true"
            :color="item.name === value.name ? 'blue' : 'default'"
          >{{ showTitleInside(item) }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { showTitle } from '@/libs/util'
export default {
  name: 'tagsNav',
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return []
      }
    },
    beforePush: {
      type: Function,
      default: (item) => {
        return true
      }
    }
  },
  data () {
    return {
      tagBodyLeft: 0,
      currentPageName: this.$route.name
    }
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (this.$refs.scrollOuter.offsetWidth < this.$refs.scrollBody.offsetWidth) {
          if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollOuter.offsetWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, this.$refs.scrollOuter.offsetWidth - this.$refs.scrollBody.offsetWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    handleTagsOption (type) {
      if (type === 'close-all') {
        // 关闭所有，除了home
        let res = this.list.filter(item => item.name === 'home')
        this.$emit('on-close', res, 'all')
      } else {
        // 关闭除当前页和home页的其他页
        let res = this.list.filter(item => item.name === this.value.name || item.name === 'home')
        this.$emit('on-close', res, 'others')
      }
    },
    handleClose (e, name) {
      let pageOpenedList = this.list
      let lastPageObj = pageOpenedList[0]
      if (this.currentPageName === name) {
        let len = pageOpenedList.length
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i < (len - 1)) {
              lastPageObj = pageOpenedList[i + 1]
            } else {
              lastPageObj = pageOpenedList[i - 1]
            }
            break
          }
        }
      } else {
        let tagWidth = event.target.parentNode.offsetWidth
        this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0)
      }
      let res = this.list.filter(item => item.name !== name)
      this.$emit('on-close', res, name)
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj)
      }
    },
    handleClick (item) {
      this.$emit('input', item)
    },
    showTitleInside (item) {
      return showTitle(item, this)
    },
    linkTo (item) {
      let routerObj = {}
      routerObj.name = item.name
      if (item.argu) {
        routerObj.params = item.argu
      }
      if (item.query) {
        routerObj.query = item.query
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj)
      }
    }
  },
  watch: {
    '$route' (to) {
      this.currentPageName = to.name
    }
  }
}
</script>

<style lang="less">
@import './tags-nav.less';
</style>

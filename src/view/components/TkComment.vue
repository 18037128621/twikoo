<template>
  <div class="tk-comment">
    <tk-avatar :nick="comment.nick" :mail-md5="comment.mailMd5" readonly />
    <div class="tk-main">
      <div class="tk-row">
        <div class="tk-meta">
          <strong>{{ comment.nick }}</strong>
          <span class="tk-tag" v-if="comment.master">博主</span>
          <small class="tk-time">{{ displayUpdated }}</small>
        </div>
        <div class="tk-action">
          <el-link class="tk-action-link" type="primary">赞 (0)</el-link>
          <el-link class="tk-action-link" type="primary">回复 (0)</el-link>
        </div>
      </div>
      <div class="tk-content" v-html="comment.comment"></div>
    </div>
  </div>
</template>

<script>
import { timeago } from '../../js/utils'
import TkAvatar from './TkAvatar.vue'

export default {
  components: {
    TkAvatar
  },
  props: {
    comment: Object
  },
  computed: {
    displayUpdated () {
      return timeago(this.comment.updated)
    }
  }
}
</script>

<style scoped>
.tk-main {
  flex: 1;
}
.tk-row {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.tk-action-link {
  margin-left: 0.5rem;
}
.tk-avatar {
  margin-right: 1rem;
}
.tk-comment {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
}
</style>

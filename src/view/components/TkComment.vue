<template>
  <div class="tk-comment">
    <tk-avatar :nick="comment.nick" :mail="comment.mail" :site="comment.site" readonly />
    <div class="tk-main">
      <div class="tk-first-line">
        <div class="tk-meta">
          <strong>{{ comment.nick }}</strong>
          <span class="tk-tag" v-if="comment.master">博主</span>
          <small class="tk-time">{{ displayUpdated }}</small>
        </div>
      </div>
      <div class="tk-content" v-html="comment.content"></div>
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
      return timeago(comment.updated)
    }
  }
}
</script>

<style scoped>
.tk-comment-item {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
}
</style>

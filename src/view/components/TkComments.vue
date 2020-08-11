<template>
  <div class="tk-comments">
    <div class="tk-comments-container" v-loading="loading">
      <h1>{{ comments.length }} 条评论</h1>
      <tk-comment v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :replying="replyId === comment.id"
        @reply="onReply"
        @load="initComments" />
    </div>
  </div>
</template>

<script>
import TkComment from './TkComment.vue'

export default {
  components: {
    TkComment
  },
  data () {
    return {
      loading: true,
      comments: [],
      replyId: ''
    }
  },
  methods: {
    async initComments () {
      this.loading = true
      const comments = await this.$tcb.app.callFunction({
        name: 'comment-get',
        data: { url: window.location.pathname }
      })
      if (comments && comments.result && comments.result.data) {
        this.comments = comments.result.data
      }
      this.loading = false
    },
    onReply (id) {
      this.replyId = id
    }
  },
  mounted () {
    this.initComments()
  }
}
</script>

<style scoped>
.tk-comments-container {
  min-height: 10rem;
}
</style>

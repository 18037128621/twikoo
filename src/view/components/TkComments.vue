<template>
  <div class="tk-comments">
    <h3>{{ comments.length }} 条评论</h3>
    <tk-comment v-for="comment in comments"
        :key="comment.id"
        :comment="comment" />
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
      comments: []
    }
  },
  methods: {
    async initComments () {
      const comments = await this.$tcb.app.callFunction({
        name: 'comment-get',
        data: { url: window.location.pathname }
      })
      if (comments && comments.result && comments.result.data) {
        this.comments = comments.result.data
      }
    }
  },
  mounted () {
    this.initComments()
  }
}
</script>

<style scoped>

</style>

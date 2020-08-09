<template>
  <div class="tk-comments">
    <tk-comment v-for="comment in comments"
        :key="comment._id"
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
      const comments = await this.$tcb.db
        .collection('comment')
        .orderBy('updated', 'asc')
        .get()
      this.comments = comments.data
    }
  },
  async mounted () {
    debugger
    if (this.$tcb && this.$tcb.db) {
      await this.initComments()
    }
  }
}
</script>

<style scoped>

</style>

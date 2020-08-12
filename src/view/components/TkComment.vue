<template>
  <div class="tk-comment" :id="comment.id">
    <tk-avatar :nick="comment.nick" :mail-md5="comment.mailMd5" readonly />
    <div class="tk-main">
      <div class="tk-row">
        <div class="tk-meta">
          <strong v-if="!comment.link">{{ comment.nick }}</strong>
          <el-link v-if="comment.link" :href="comment.link" target="_blank">
            <strong>{{ comment.nick }}</strong>
          </el-link>
          <span class="tk-tag" v-if="comment.master">博主</span>
          <small class="tk-time">{{ displayUpdated }}</small>
        </div>
        <div class="tk-action">
          <!-- TODO: 点赞 -->
          <el-link class="tk-action-link" type="primary" @click="onReply">回复{{ repliesCount }}</el-link>
        </div>
      </div>
      <div class="tk-content" v-html="comment.comment"></div>
      <!-- 回复列表 -->
      <tk-comment v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        @load="onLoad"
        @reply="onReplyReply" />
      <!-- 回复框 -->
      <tk-submit v-if="replying"
        :reply-id="comment.id"
        :pid="pid"
        @load="onLoad"
        @cancel="onCancel" />
    </div>
  </div>
</template>

<script>
import { timeago } from '../../js/utils'
import TkAvatar from './TkAvatar.vue'
import TkSubmit from './TkSubmit.vue'

export default {
  name: 'tk-comment', // 允许组件模板递归地调用自身
  components: {
    TkAvatar,
    TkSubmit
  },
  data () {
    return {
      pid: ''
    }
  },
  props: {
    comment: Object,
    replying: Boolean
  },
  computed: {
    displayUpdated () {
      return timeago(this.comment.updated)
    },
    repliesCount () {
      if (this.comment.replies && this.comment.replies.length > 0) {
        return ` (${this.comment.replies.length})`
      } else {
        return ''
      }
    }
  },
  methods: {
    onReply () {
      this.$emit('reply', this.comment.id)
    },
    onReplyReply (id) {
      // 楼中楼回复
      this.pid = id
      this.$emit('reply', this.comment.id)
    },
    onCancel () {
      this.pid = ''
      this.$emit('reply', '')
    },
    onLoad () {
      this.$emit('load')
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
.tk-submit {
  margin-top: 1rem;
}
</style>

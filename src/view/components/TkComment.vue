<template>
  <div class="tk-comment" :id="comment.id">
    <tk-avatar :nick="comment.nick" :mail-md5="comment.mailMd5" :link="comment.link" />
    <div class="tk-main">
      <div class="tk-row">
        <div class="tk-meta">
          <strong class="tk-nick" v-if="!comment.link">{{ comment.nick }}</strong>
          <a class="tk-nick tk-nick-link" v-if="comment.link" :href="comment.link" target="_blank">
            <strong>{{ comment.nick }}</strong>
          </a>
          <span class="tk-tag tk-tag-green" v-if="comment.master">博主</span>
          <small class="tk-time">{{ displayUpdated }}</small>
          <div class="tk-tag">{{ comment.os }}</div>
          <div class="tk-tag">{{ comment.browser }}</div>
        </div>
        <div class="tk-action">
          <a class="tk-action-link" @click="onReply">
            <span class="tk-replies-icon" v-html="iconHeart"></span>
            <span class="tk-replies-icon tk-replies-icon-solid" v-html="iconHeartSolid"></span>
            <span class="tk-replies-count">{{ repliesCount }}</span>
          </a>
          <a class="tk-action-link" @click="onReply">
            <span class="tk-replies-icon" v-html="iconComment"></span>
            <span class="tk-replies-icon tk-replies-icon-solid" v-html="iconCommentSolid"></span>
            <span class="tk-replies-count">{{ repliesCount }}</span>
          </a>
        </div>
      </div>
      <div class="tk-content" v-html="comment.comment"></div>
      <!-- 回复列表 -->
      <div class="tk-replies" :class="{ 'tk-replies-expand': isExpanded }" ref="tk-replies">
        <tk-comment v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            @load="onLoad"
            @reply="onReplyReply" />
        <div class="tk-expand" v-if="showExpand" @click="onExpand">查看更多...</div>
      </div>
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
import iconComment from '@fortawesome/fontawesome-free/svgs/regular/comment.svg'
import iconCommentSolid from '@fortawesome/fontawesome-free/svgs/solid/comment.svg'
import iconHeart from '@fortawesome/fontawesome-free/svgs/regular/thumbs-up.svg'
import iconHeartSolid from '@fortawesome/fontawesome-free/svgs/solid/thumbs-up.svg'

export default {
  name: 'tk-comment', // 允许组件模板递归地调用自身
  components: {
    TkAvatar,
    TkSubmit
  },
  data () {
    return {
      iconComment,
      iconCommentSolid,
      iconHeart,
      iconHeartSolid,
      pid: '',
      isExpanded: false,
      hasExpand: false
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
        return `(${this.comment.replies.length})`
      } else {
        return ''
      }
    },
    showExpand () {
      return this.hasExpand && !this.isExpanded
    }
  },
  methods: {
    showExpandIfNeed () {
      if (this.comment.replies && this.comment.replies.length > 0 && this.$refs['tk-replies']) {
        this.hasExpand = this.$refs['tk-replies'].scrollHeight > 200
      }
    },
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
    },
    onExpand () {
      this.isExpanded = true
    }
  },
  mounted () {
    this.$nextTick(this.showExpandIfNeed)
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
.tk-action {
  display: flex;
  align-items: center;
}
.tk-action-link {
  margin-left: 0.5rem;
  color: #409eff;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.tk-action-link .tk-replies-icon-solid {
  display: none;
}
.tk-action-link:hover .tk-replies-icon {
  display: none;
}
.tk-action-link:hover .tk-replies-icon-solid {
  display: block;
}
.tk-replies-count {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  height: 1.5rem;
  line-height: 1.5rem;
}
.tk-replies-icon {
  display: inline-block;
  height: 1em;
  width: 1em;
  line-height: 0;
}
.tk-replies-icon /deep/ svg {
  fill: #409eff;
}
.tk-avatar {
  margin-right: 1rem;
}
.tk-nick-link {
  color: inherit;
  text-decoration: none;
}
.tk-nick-link:hover {
  color: #409eff;
}
.tk-tag {
  display: inline-block;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  background-color: #f2f6fc;
}
.tk-tag-green {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
}
.tk-comment {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
}
.tk-replies {
  max-height: 200px;
  overflow: hidden;
  position: relative;
}
.tk-replies-expand {
  max-height: none;
}
.tk-expand {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
  cursor: pointer;
}
.tk-submit {
  margin-top: 1rem;
}
</style>

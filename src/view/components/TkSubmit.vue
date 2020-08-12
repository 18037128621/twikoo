<template>
  <div class="tk-submit">
    <div class="tk-row">
      <tk-avatar :nick="nick" :mail="mail" :link="link" @update="onMetaUpdate" />
      <el-input class="tk-input"
          type="textarea"
          v-model="comment"
          placeholder="请输入内容"
          :autosize="{ minRows: 3 }"
          @change="updatePreview" />
    </div>
    <div class="tk-row actions">
      <el-button class="tk-cancel"
          v-if="!!replyId"
          size="small"
          @click="cancel">取消</el-button>
      <el-button class="tk-preview"
          size="small"
          :disabled="!canSend"
          @click="preview">预览</el-button>
      <el-tooltip class="item" effect="dark" placement="bottom" :content="disableTooltip" :disabled="!disableTooltip">
        <!-- 套一层 div 解决 tooltip 在 disabled button 上不起作用 -->
        <div class="tk-send">
          <el-button class="tk-send-button"
              type="primary"
              size="small"
              :disabled="!canSend"
              @click="send">发送</el-button>
        </div>
      </el-tooltip>
    </div>
    <div class="tk-preview" v-if="isPreviewing" v-html="commentHtml"></div>
  </div>
</template>

<script>
import TkAvatar from './TkAvatar.vue'
import { marked } from '../../js/utils'

export default {
  components: {
    TkAvatar
  },
  props: {
    replyId: String,
    pid: String
  },
  data () {
    return {
      isSending: false,
      isPreviewing: false,
      comment: '',
      commentHtml: '',
      nick: '',
      mail: '',
      link: ''
    }
  },
  computed: {
    canSend () {
      return !this.isSending
          && !!this.nick
          && !!this.mail
          && !!this.comment
    },
    disableTooltip () {
      if (this.isSending) return '发送中'
      else if (!this.nick) return '请填写昵称'
      else if (!this.mail) return '请填写邮箱'
      else if (!this.comment) return '请填写内容'
    }
  },
  methods: {
    onMetaUpdate (metaData) {
      this.nick = metaData.nick
      this.mail = metaData.mail
      this.link = metaData.link
    },
    cancel () {
      this.$emit('cancel')
    },
    preview () {
      this.isPreviewing = !this.isPreviewing
      this.updatePreview()
    },
    updatePreview () {
      if (this.isPreviewing) {
        this.commentHtml = marked(this.comment)
      }
    },
    async send () {
      this.isSending = true
      const comment = {
        nick: this.nick,
        mail: this.mail,
        link: this.link,
        ua: navigator.userAgent,
        url: window.location.pathname,
        comment: marked(this.comment),
        pid: this.pid ? this.pid : this.replyId,
        rid: this.replyId
      }
      const id = await this.$tcb.app.callFunction({
        name: 'comment-submit',
        data: comment
      })
      if (id && id.result && id.result.id) {
        this.onSendComplete()
      }
    },
    onSendComplete () {
      this.comment = ''
      this.isSending = false
      this.$emit('load')
    }
  }
}
</script>

<style scoped>
.tk-submit {
  display: flex;
  flex-direction: column;
}
.tk-row {
  display: flex;
  flex-direction: row;
}
.tk-row.actions {
  margin-top: 1rem;
  justify-content: flex-end;
}
.tk-avatar {
  margin-right: 1rem;
}
.tk-input {
  flex: 1;
}
.tk-send {
  margin-left: 10px;
}
</style>

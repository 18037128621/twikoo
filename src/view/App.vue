<template>
  <div id="twikoo" class="twikoo">
    <tk-comments />
    <tk-footer />
  </div>
</template>

<script>
import TkComments from './components/TkComments.vue'
import TkFooter from './components/TkFooter.vue'

export default {
  components: {
    TkComments,
    TkFooter
  }
}
</script>

<template>
  <div id="twikoo" class="twikoo">
    <tk-new />
    <tk-comments />
  </div>
</template>

<script>
import TkNew from './components/TkNew.vue'
import TkComments from './components/TkComments.vue'

export default {
  components: {
    TkNew,
    TkComments
  }
}
</script>

<template>
  <div id="twikoo" class="twikoo">
    <tk-submit />
    <tk-comments />
  </div>
</template>

<script>
import TkSubmit from './components/TkSubmit.vue'
import TkComments from './components/TkComments.vue'

export default {
  components: {
    TkSubmit,
    TkComments
  }
}
</script>

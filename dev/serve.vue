<script>
import Vue from 'vue'
import VueTrixEditor from '@/vue-trix-editor.vue'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueTrixEditor,
  },
})
</script>

<template>
  <div id="app">
    <vue-trix-editor />
  </div>
</template>

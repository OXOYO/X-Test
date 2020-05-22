<style scoped lang="less">
  .home {
    display: flex;
    padding: 40px 0;
    justify-content: center;
  }
</style>

<template>
  <div class="home">
    <XChat></XChat>
  </div>
</template>

<script>
  import XChat from '@/components/XChat.vue'

  export default {
    name: 'Home',
    components: {
      XChat
    }
  }
</script>

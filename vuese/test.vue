<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <h1>TODO TEST</h1>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      name: 'test',
      title: '测试'
    }
  },
  props: {
    p1: String,
    p2: {
      default: false,
      type: Boolean
    },
    p3: {
      validator (value) {
        return ['circle', 'circle-outline'].includes(value)
      }
    }
  }
}
</script>

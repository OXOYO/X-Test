<style lang="less">
</style>

<template>
  <div>
    <div class="editor" id="editor"></div>
  </div>
</template>

<script>
  // import G6 from '@antv/g6'
  // import Vue from 'vue'
  // import Vuex from 'vuex'
  // import iView from 'iview'
  // Vue.use(iView)
  // window.Vue = Vue
  // import 'iview/dist/styles/iview.css'
  // import xfc from './xfc/xfc.umd.min'
  // import './xfc/xfc.css'
  import xfc from '@oxoyo/xfc'
  import '@oxoyo/xfc/dist/xfc.css'

  export default {
    name: 'app',
    mounted () {
      const xfcEditor = xfc({
        el: '#editor',
        props: {
          i18n: {
            // 默认语言包
            defLocale: 'en-US',
            // 自定义语音包或覆写系统语音包
            locales: {
              'zh-CN': {
                L10001: '111',
                L10002: '222'
              }
            }
          }
        }
      })
      console.log('xfcEditor', xfcEditor)
    }
  }
</script>

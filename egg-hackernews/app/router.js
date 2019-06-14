/**
 * Created by OXOYO on 2019/6/5.
 *
 *
 */

module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/news', controller.news.list)
}

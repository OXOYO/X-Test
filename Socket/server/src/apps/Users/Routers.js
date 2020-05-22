/**
 * Created by OXOYO on 2017/10/27.
 */

import Ctrl from './Ctrl'

const namespace = '/Users/'

export default (router) => {
  router
    .get(namespace + 'list', Ctrl.getUserList)
    .post(namespace + 'login', Ctrl.doLogin)
    .get(namespace + 'baseInfo', Ctrl.getBaseInfo)
    .post(namespace + 'add', Ctrl.doAddUser)
    .post(namespace + 'edit', Ctrl.doEditUser)
    .post(namespace + 'remove', Ctrl.doRemoveUser)
}
